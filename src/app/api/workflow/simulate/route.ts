import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getWorkflowByBusiness, getServicesByBusiness } from '@/lib/db-hybrid';
import { processWorkflowMessage, getExecution, clearExecution } from '@/lib/workflow/engine';
import { WhatsAppMessage } from '@/lib/whatsapp';

// Map session_id → simulated phone number
const SIM_PHONE_PREFIX = '+91999999';
function getSimPhone(sessionId: string): string {
  // Hash session_id to a consistent 4-digit suffix
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = ((hash << 5) - hash) + sessionId.charCodeAt(i);
    hash |= 0;
  }
  const suffix = String(Math.abs(hash) % 10000).padStart(4, '0');
  return `${SIM_PHONE_PREFIX}${suffix}`;
}

export async function POST(req: NextRequest) {
  let session;
  try {
    session = requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { message, session_id } = body;

  if (!message || !session_id) {
    return NextResponse.json({ error: 'Message and session_id required' }, { status: 400 });
  }

  const workflow = await getWorkflowByBusiness(session.business_id);
  if (!workflow) {
    return NextResponse.json({ reply: 'No workflow configured. Please set up automation first.' });
  }

  const services = await getServicesByBusiness(session.business_id);
  const simPhone = getSimPhone(session_id);
  const businessName = session.name || 'Our Business';

  // Capture all messages sent by the engine in this turn
  const capturedMessages: WhatsAppMessage[] = [];

  await processWorkflowMessage(
    workflow,
    simPhone,
    message,
    businessName,
    services,
    async (msg) => {
      capturedMessages.push(msg);
    }
  );

  // Get the execution state to determine quick replies
  const execution = getExecution(simPhone);
  const enabledSteps = workflow.steps.filter(s => s.enabled);
  const currentStepIndex = execution?.current_step_index ?? 0;
  const currentStep = enabledSteps[currentStepIndex];

  // Generate quick replies based on current step context
  let quickReplies: string[] | undefined;

  if (currentStep) {
    switch (currentStep.type) {
      case 'show_services':
      case 'pick_service': {
        quickReplies = services.slice(0, 4).map((s: any) => s.name);
        break;
      }
      case 'pick_date': {
        const days = (currentStep.config.days_ahead as number) || 7;
        quickReplies = Array.from({ length: Math.min(days, 4) }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() + i);
          return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
        });
        break;
      }
      case 'pick_time': {
        const slots = (currentStep.config.slots as string[]) || ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];
        quickReplies = slots.slice(0, 4);
        break;
      }
      case 'confirm_details': {
        quickReplies = ['Yes', 'No'];
        break;
      }
      case 'ask_review': {
        quickReplies = ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐'];
        break;
      }
      case 'collect_deposit': {
        quickReplies = ['Pay now', 'Skip'];
        break;
      }
    }
  }

  // If no messages were captured (e.g., execution completed), return a fallback
  if (capturedMessages.length === 0) {
    return NextResponse.json({
      reply: workflow.bot_personality?.farewell || 'Thank you! Conversation complete. Type "hi" to start again. 👋',
      quickReplies: ['Book again'],
    });
  }

  // Return the last captured message (engine may send multiple in auto-advance)
  const lastMessage = capturedMessages[capturedMessages.length - 1];

  return NextResponse.json({
    reply: lastMessage.body,
    quickReplies,
  });
}
