import { NextRequest, NextResponse } from 'next/server';
import {
  getBusinessById,
  getBusinessByPhone,
  getServicesByBusiness,
  getWorkflowByBusiness,
} from '@/lib/db-hybrid';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { processWorkflowMessage } from '@/lib/workflow/engine';

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
  let business = businessPhone ? await getBusinessByPhone(businessPhone) : null;
  if (!business && body.businessId) {
    business = await getBusinessById(body.businessId);
  }
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  // Check if business has an active workflow
  const workflow = await getWorkflowByBusiness(business.id);

  if (workflow && workflow.is_active) {
    // Use the workflow engine
    const services = await getServicesByBusiness(business.id);
    await processWorkflowMessage(workflow, from, messageBody, business.name, services);
    return NextResponse.json({ success: true });
  }

  // Fallback: simple greeting when no workflow is configured
  await sendWhatsAppMessage({
    to: from,
    body: `👋 Hello! Welcome to ${business.name}.\n\nOur booking system is being set up. Please call us at ${business.phone} to book.`,
  });

  return NextResponse.json({ success: true });
}
