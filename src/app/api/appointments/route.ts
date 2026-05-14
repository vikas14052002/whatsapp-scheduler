import { NextRequest, NextResponse } from 'next/server';
import {
  getAppointmentsByBusiness,
  getServicesByBusiness,
  createAppointment,
  updateAppointmentStatus,
  getCustomerByPhone,
  createCustomer,
  updateCustomer,
  getBusinessById,
  getUpcomingAppointments as getUpcomingAppointmentsHybrid,
} from '@/lib/db-hybrid';
import { requireAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { sendWhatsAppMessage, generateBookingConfirmationMessage } from '@/lib/whatsapp';

export async function GET() {
  try {
    const session = requireAuth();
    const appointments = await getUpcomingAppointmentsHybrid(session.business_id, 50);
    return NextResponse.json({ appointments });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = requireAuth();
    const body = await request.json();
    const { service_id, patient_name, patient_phone, appointment_date, start_time, notes, deposit_amount } = body;

    const services = await getServicesByBusiness(session.business_id);
    const service = services.find(s => s.id === service_id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Calculate end time
    const [hours, minutes] = start_time.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + service.duration_minutes);
    const end_time = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    const appointment = {
      id: uuidv4(),
      business_id: session.business_id,
      service_id,
      service_name: service.name,
      staff_id: null,
      staff_name: undefined,
      patient_name,
      patient_phone,
      appointment_date,
      start_time,
      end_time,
      status: 'confirmed' as const,
      notes: notes || '',
      deposit_paid: false,
      deposit_amount: deposit_amount || service.deposit_amount,
      source: 'manual' as const,
      created_at: new Date().toISOString(),
    };

    await createAppointment(appointment);

    // Upsert customer
    const existingCustomer = await getCustomerByPhone(patient_phone, session.business_id);
    if (existingCustomer) {
      await updateCustomer({
        id: existingCustomer.id,
        visit_count: (existingCustomer.visit_count || 0) + 1,
        last_visit: appointment_date,
      });
    } else {
      await createCustomer({
        id: uuidv4(),
        business_id: session.business_id,
        name: patient_name,
        phone: patient_phone,
        email: '',
        notes: '',
        visit_count: 1,
        last_visit: appointment_date,
      } as any);
    }

    // Send WhatsApp confirmation
    const business = await getBusinessById(session.business_id);
    if (business) {
      await sendWhatsAppMessage({
        to: patient_phone,
        body: generateBookingConfirmationMessage(
          business.name,
          service.name,
          appointment_date,
          start_time,
          patient_name,
          appointment.deposit_amount
        ),
      });
    }

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = requireAuth();
    const { id, status } = await request.json();

    await updateAppointmentStatus(id, session.business_id, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
