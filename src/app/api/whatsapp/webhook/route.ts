import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { sendWhatsAppMessage, generateServicesMenu, generateAvailableDatesMessage, generateAvailableSlotsMessage, generateBookingConfirmationMessage } from '@/lib/whatsapp';
import { v4 as uuidv4 } from 'uuid';

// In-memory session storage for WhatsApp conversations (in production, use Redis)
const conversations = new Map<string, {
  step: 'idle' | 'selecting_service' | 'selecting_date' | 'selecting_time' | 'entering_name' | 'confirming';
  service_id?: string;
  service_name?: string;
  date?: string;
  time?: string;
  name?: string;
}>();

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Handle Twilio webhook format or direct JSON
  const from = body.From || body.from || body.waId;
  const messageBody = (body.Body || body.body || body.message || '').toString().trim().toLowerCase();
  const businessPhone = body.To || body.to || body.businessPhone;

  if (!from) {
    return NextResponse.json({ error: 'Missing sender' }, { status: 400 });
  }

  // Find business by WhatsApp number
  const db = getDb();
  const business = db.businesses.find(b => b.whatsapp_number === businessPhone || b.phone === businessPhone);
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  const session = conversations.get(from) || { step: 'idle' };
  const services = db.services.filter(s => s.business_id === business.id && s.is_active);

  // Handle commands
  if (messageBody === 'hi' || messageBody === 'hello' || messageBody === 'book' || messageBody === 'start') {
    session.step = 'selecting_service';
    conversations.set(from, session);
    
    await sendWhatsAppMessage({
      to: from,
      body: generateServicesMenu(business.name, services),
    });
    return NextResponse.json({ success: true });
  }

  if (messageBody === 'help') {
    await sendWhatsAppMessage({
      to: from,
      body: `👋 *Help*\n\nReply with:\n• *BOOK* - Book an appointment\n• *HI* - Start booking\n• *CANCEL* - Cancel current booking\n\nOr call us at ${business.phone}`,
    });
    return NextResponse.json({ success: true });
  }

  if (messageBody === 'cancel' || messageBody === 'back') {
    session.step = 'idle';
    conversations.set(from, session);
    await sendWhatsAppMessage({
      to: from,
      body: 'Booking cancelled. Reply *HI* to start again.',
    });
    return NextResponse.json({ success: true });
  }

  // Booking flow
  if (session.step === 'selecting_service') {
    const selectedIndex = parseInt(messageBody) - 1;
    if (selectedIndex >= 0 && selectedIndex < services.length) {
      const service = services[selectedIndex];
      session.step = 'selecting_date';
      session.service_id = service.id;
      session.service_name = service.name;
      conversations.set(from, session);

      await sendWhatsAppMessage({
        to: from,
        body: generateAvailableDatesMessage(service.name),
      });
    } else {
      await sendWhatsAppMessage({
        to: from,
        body: '❌ Invalid selection. Please reply with a number from the list.',
      });
    }
    return NextResponse.json({ success: true });
  }

  if (session.step === 'selecting_date') {
    const selectedIndex = parseInt(messageBody) - 1;
    if (selectedIndex >= 0 && selectedIndex < 7) {
      const date = new Date();
      date.setDate(date.getDate() + selectedIndex);
      const dateStr = date.toISOString().split('T')[0];
      
      session.step = 'selecting_time';
      session.date = dateStr;
      conversations.set(from, session);

      await sendWhatsAppMessage({
        to: from,
        body: generateAvailableSlotsMessage(dateStr),
      });
    } else {
      await sendWhatsAppMessage({
        to: from,
        body: '❌ Invalid selection. Please reply with a number from 1-7.',
      });
    }
    return NextResponse.json({ success: true });
  }

  if (session.step === 'selecting_time') {
    const slots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
    const selectedIndex = parseInt(messageBody) - 1;
    if (selectedIndex >= 0 && selectedIndex < slots.length) {
      session.step = 'entering_name';
      session.time = slots[selectedIndex];
      conversations.set(from, session);

      await sendWhatsAppMessage({
        to: from,
        body: `✅ *${session.time}* selected.\n\nPlease reply with your full name for the appointment.`,
      });
    } else {
      await sendWhatsAppMessage({
        to: from,
        body: '❌ Invalid selection. Please reply with a number from the list.',
      });
    }
    return NextResponse.json({ success: true });
  }

  if (session.step === 'entering_name') {
    const name = messageBody.charAt(0).toUpperCase() + messageBody.slice(1);
    session.step = 'confirming';
    session.name = name;
    conversations.set(from, session);

    const service = services.find(s => s.id === session.service_id);
    const deposit = service?.deposit_amount || 0;

    await sendWhatsAppMessage({
      to: from,
      body: `Please confirm your booking:\n\n👤 *Name:* ${name}\n📋 *Service:* ${session.service_name}\n📅 *Date:* ${session.date}\n⏰ *Time:* ${session.time}\n${deposit > 0 ? `💰 *Deposit:* ₹${deposit}\n` : ''}\nReply *YES* to confirm or *CANCEL* to abort.`,
    });
    return NextResponse.json({ success: true });
  }

  if (session.step === 'confirming') {
    if (messageBody === 'yes') {
      const service = services.find(s => s.id === session.service_id);
      if (!service || !session.date || !session.time || !session.name) {
        await sendWhatsAppMessage({ to: from, body: '❌ Something went wrong. Please start again with *HI*.' });
        session.step = 'idle';
        conversations.set(from, session);
        return NextResponse.json({ success: true });
      }

      // Parse time to 24h format
      const timeStr = session.time;
      const [timePart, ampm] = timeStr.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      const start_time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      // Calculate end time
      const endDate = new Date();
      endDate.setHours(hours, minutes + service.duration_minutes);
      const end_time = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

      // Create appointment
      const appointment = {
        id: uuidv4(),
        business_id: business.id,
        service_id: service.id,
        service_name: service.name,
        staff_id: null,
        patient_name: session.name,
        patient_phone: from,
        appointment_date: session.date,
        start_time,
        end_time,
        status: 'confirmed' as const,
        notes: 'Booked via WhatsApp',
        deposit_paid: false,
        deposit_amount: service.deposit_amount,
        source: 'whatsapp' as const,
        created_at: new Date().toISOString(),
      };

      db.appointments.push(appointment);

      // Upsert patient
      const existingPatient = db.patients.find(p => p.phone === from && p.business_id === business.id);
      if (existingPatient) {
        existingPatient.visit_count += 1;
        existingPatient.last_visit = session.date;
      } else {
        db.patients.push({
          id: uuidv4(),
          business_id: business.id,
          name: session.name,
          phone: from,
          email: '',
          notes: '',
          visit_count: 1,
          last_visit: session.date,
          created_at: new Date().toISOString(),
        });
      }

      saveDb(db);

      // Send confirmation
      await sendWhatsAppMessage({
        to: from,
        body: generateBookingConfirmationMessage(
          business.name,
          service.name,
          session.date,
          session.time,
          session.name,
          service.deposit_amount
        ),
      });

      session.step = 'idle';
      conversations.set(from, session);
    } else {
      await sendWhatsAppMessage({
        to: from,
        body: 'Booking cancelled. Reply *HI* to start again.',
      });
      session.step = 'idle';
      conversations.set(from, session);
    }
    return NextResponse.json({ success: true });
  }

  // Default response
  await sendWhatsAppMessage({
    to: from,
    body: `👋 Hello! Welcome to ${business.name}.\n\nReply *BOOK* to book an appointment or *HELP* for assistance.`,
  });

  return NextResponse.json({ success: true });
}
