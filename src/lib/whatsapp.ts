import { Service, Appointment } from '@/types';

// Demo mode: logs to console instead of sending real WhatsApp messages
const DEMO_MODE = process.env.DEMO_MODE === 'true' || !process.env.TWILIO_ACCOUNT_SID;

export interface WhatsAppMessage {
  to: string;
  body: string;
}

export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<{ success: boolean; sid?: string; error?: string }> {
  if (DEMO_MODE) {
    console.log('📱 [DEMO WHATSAPP MESSAGE]');
    console.log(`To: ${message.to}`);
    console.log(`Body: ${message.body}`);
    console.log('---');
    return { success: true, sid: 'demo-message-id' };
  }

  // Real Twilio integration would go here
  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: process.env.TWILIO_WHATSAPP_NUMBER || '',
        To: `whatsapp:${message.to}`,
        Body: message.body,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, sid: data.sid };
    }
    return { success: false, error: data.message };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export function generateBookingConfirmationMessage(
  businessName: string,
  serviceName: string,
  date: string,
  time: string,
  patientName: string,
  depositAmount: number
): string {
  const depositText = depositAmount > 0 
    ? `\n💰 Deposit: ₹${depositAmount} (please pay to confirm)` 
    : '';

  return `✅ *Booking Confirmed!*\n\n👋 Hi ${patientName},\n\nYour appointment has been booked at *${businessName}*.\n\n📋 *Service:* ${serviceName}\n📅 *Date:* ${date}\n⏰ *Time:* ${time}${depositText}\n\n📍 Please arrive 5 minutes early.\n\nTo reschedule or cancel, reply *RESCHEDULE* or *CANCEL*.\n\nThank you! 💚`;
}

export function generateReminderMessage(
  businessName: string,
  serviceName: string,
  date: string,
  time: string,
  patientName: string,
  hoursBefore: number
): string {
  const timeText = hoursBefore === 24 ? 'tomorrow' : 'in 1 hour';
  return `⏰ *Appointment Reminder*\n\n👋 Hi ${patientName},\n\nThis is a friendly reminder that you have an appointment *${timeText}* at *${businessName}*.\n\n📋 *Service:* ${serviceName}\n📅 *Date:* ${date}\n⏰ *Time:* ${time}\n\n📍 Please arrive 5 minutes early.\n\nReply *CONFIRM* to confirm or *CANCEL* if you can't make it.`;
}

export function generateServicesMenu(businessName: string, services: Service[]): string {
  const servicesList = services.map((s, i) => 
    `${i + 1}. ${s.name} - ₹${s.price} (${s.duration_minutes} min)`
  ).join('\n');

  return `👋 Welcome to *${businessName}*!\n\nPlease reply with the number of the service you'd like to book:\n\n${servicesList}\n\nOr reply *HELP* for assistance.`;
}

export function generateAvailableDatesMessage(serviceName: string): string {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return `${i + 1}. ${d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`;
  }).join('\n');

  return `📅 *${serviceName}*\n\nPlease reply with the number of your preferred date:\n\n${dates}\n\nOr reply *BACK* to choose a different service.`;
}

export function generateAvailableSlotsMessage(date: string): string {
  const slots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  const slotsList = slots.map((s, i) => `${i + 1}. ${s}`).join('\n');

  return `⏰ *Available slots for ${date}*\n\nPlease reply with the number of your preferred time:\n\n${slotsList}\n\nOr reply *BACK* to choose a different date.`;
}

export function generatePaymentLinkMessage(amount: number, link: string): string {
  return `💰 *Payment Required*\n\nPlease pay ₹${amount} to confirm your booking.\n\n${link}\n\nYour slot will be held for 15 minutes.`;
}
