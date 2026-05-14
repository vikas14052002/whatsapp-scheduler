import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getWorkflowByBusiness, getServicesByBusiness, getBusinessById } from '@/lib/db-hybrid';
import { processWorkflowMessage } from '@/lib/workflow/engine';

export async function POST(request: NextRequest) {
  try {
    const session = requireAuth();
    const { message, phone } = await request.json();

    const workflow = await getWorkflowByBusiness(session.business_id);
    if (!workflow) {
      return NextResponse.json({ error: 'No workflow configured' }, { status: 400 });
    }

    const business = await getBusinessById(session.business_id);
    const services = await getServicesByBusiness(session.business_id);

    await processWorkflowMessage(
      workflow,
      phone || '+919999999999',
      message || 'hi',
      business?.name || 'Your Business',
      services
    );

    return NextResponse.json({ success: true, message: 'Test workflow executed. Check server logs for message output.' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
