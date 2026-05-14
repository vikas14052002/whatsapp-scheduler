import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getWorkflowByBusiness, saveWorkflow } from '@/lib/db-hybrid';
import { Workflow } from '@/lib/workflow/types';

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const workflow = await getWorkflowByBusiness(session.business_id);
  return NextResponse.json({ workflow });
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = (await request.json()) as Workflow;

  const workflow: Workflow = {
    ...body,
    business_id: session.business_id,
    updated_at: new Date().toISOString(),
  };

  await saveWorkflow(workflow);
  return NextResponse.json({ success: true, workflow });
}
