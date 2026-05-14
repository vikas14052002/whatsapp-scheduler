// ─── BookKar Workflow Engine ───
// Executes workflow steps sequentially for each customer conversation

import { v4 as uuidv4 } from 'uuid';
import { Workflow, WorkflowStep, WorkflowExecution, BotPersonality } from './types';
import { sendWhatsAppMessage, WhatsAppMessage } from '@/lib/whatsapp';
import { getServicesByBusiness, createAppointment, getCustomerByPhone, createCustomer, updateCustomer, getBusinessById } from '@/lib/db-hybrid';
import type { Service } from '@/types';

// In-memory execution state (replace with Redis in production)
const executions = new Map<string, WorkflowExecution>();

export function getExecution(customerPhone: string): WorkflowExecution | undefined {
  return executions.get(customerPhone);
}

export function createExecution(workflow: Workflow, customerPhone: string): WorkflowExecution {
  const execution: WorkflowExecution = {
    id: uuidv4(),
    workflow_id: workflow.id,
    business_id: workflow.business_id,
    customer_phone: customerPhone,
    current_step_index: 0,
    step_data: {},
    status: 'running',
    logs: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  executions.set(customerPhone, execution);
  return execution;
}

export function clearExecution(customerPhone: string): void {
  executions.delete(customerPhone);
}

export function logStep(execution: WorkflowExecution, step: WorkflowStep, action: string, details?: string): void {
  execution.logs.push({
    step_id: step.id,
    step_type: step.type,
    action,
    timestamp: new Date().toISOString(),
    details,
  });
  execution.updated_at = new Date().toISOString();
}

// ─── Message Builder ───
function buildMessage(template: string, personality: BotPersonality | undefined, businessName: string, data: Record<string, unknown>): string {
  let msg = template
    .replace(/{businessName}/g, businessName)
    .replace(/{customerName}/g, String(data.name || 'there'));

  // Inject personality tone hints
  if (personality?.special_notes) {
    // Special notes are instructions for the builder, not output text
  }

  return msg;
}

// ─── Step Executors ───
type StepResult = { done: boolean; reply?: string; next?: boolean; wait_for_input?: boolean };

export async function executeStep(
  step: WorkflowStep,
  execution: WorkflowExecution,
  customerMessage: string,
  businessName: string,
  services: Service[],
  personality?: BotPersonality,
  onMessage?: (msg: WhatsAppMessage) => Promise<void>
): Promise<StepResult> {
  const send = onMessage || sendWhatsAppMessage;
  const data = execution.step_data;

  switch (step.type) {
    case 'send_welcome': {
      const greeting = personality?.greeting || "👋 Hi! Welcome to {businessName}. I'm your booking assistant.";
      const msg = buildMessage(greeting, personality, businessName, data);
      await send({ to: execution.customer_phone, body: msg });
      logStep(execution, step, 'sent_welcome', msg);
      return { done: true, next: true };
    }

    case 'show_services': {
      const list = services.map((s, i) => `${i + 1}. ${s.name} — ₹${s.price} (${s.duration_minutes} min)`).join('\n');
      const msg = `📋 *Our Services*\n\n${list}\n\nReply with the number of the service you'd like to book.`;
      await send({ to: execution.customer_phone, body: msg });
      logStep(execution, step, 'showed_services', `${services.length} services`);
      return { done: true, next: true };
    }

    case 'pick_service': {
      const trimmed = customerMessage.trim();
      // Empty message = first visit, just show prompt
      if (!trimmed) {
        const list = services.map((s, i) => `${i + 1}. ${s.name} — ₹${s.price} (${s.duration_minutes} min)`).join('\n');
        await send({ to: execution.customer_phone, body: `📋 *Our Services*\n\n${list}\n\nReply with the number of the service you'd like to book.` });
        return { done: false, wait_for_input: true };
      }
      const idx = parseInt(trimmed) - 1;
      if (idx >= 0 && idx < services.length) {
        data.service_id = services[idx].id;
        data.service_name = services[idx].name;
        data.service_price = services[idx].price;
        data.service_duration = services[idx].duration_minutes;
        data.deposit_amount = services[idx].deposit_amount;
        logStep(execution, step, 'picked_service', services[idx].name);
        return { done: true, next: true };
      }
      await send({ to: execution.customer_phone, body: '❌ Invalid selection. Please reply with a number from the list.' });
      return { done: false, wait_for_input: true };
    }

    case 'pick_date': {
      const days = step.config.days_ahead as number || 7;
      const selected = parseInt(customerMessage) - 1;
      if (selected >= 0 && selected < days) {
        const d = new Date();
        d.setDate(d.getDate() + selected);
        data.date = d.toISOString().split('T')[0];
        logStep(execution, step, 'picked_date', data.date as string);
        return { done: true, next: true };
      }
      // Show date menu again
      const dates = Array.from({ length: days }, (_, i) => {
        const dd = new Date();
        dd.setDate(dd.getDate() + i);
        return `${i + 1}. ${dd.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`;
      }).join('\n');
      await send({ to: execution.customer_phone, body: `📅 *Pick a date*\n\n${dates}\n\nReply with a number 1-${days}.` });
      return { done: false, wait_for_input: true };
    }

    case 'pick_time': {
      const slots = (step.config.slots as string[]) || ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
      const selected = parseInt(customerMessage) - 1;
      if (selected >= 0 && selected < slots.length) {
        data.time = slots[selected];
        // Calculate end time
        const [timePart, ampm] = (data.time as string).split(' ');
        let [h, m] = timePart.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const duration = (data.service_duration as number) || 30;
        const end = new Date();
        end.setHours(h, m + duration);
        data.end_time = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
        logStep(execution, step, 'picked_time', data.time as string);
        return { done: true, next: true };
      }
      const slotsList = slots.map((s, i) => `${i + 1}. ${s}`).join('\n');
      await send({ to: execution.customer_phone, body: `⏰ *Available slots*\n\n${slotsList}\n\nReply with a number.` });
      return { done: false, wait_for_input: true };
    }

    case 'ask_name': {
      const trimmed = customerMessage.trim();
      const isCommand = [...CANCEL_WORDS, ...HELP_WORDS, ...START_WORDS].includes(trimmed.toLowerCase());
      const isNumberOnly = /^\d+$/.test(trimmed);
      const isTooShort = trimmed.length < 2;

      if (!data.name && !isCommand && !isNumberOnly && !isTooShort) {
        data.name = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        logStep(execution, step, 'got_name', data.name as string);
        return { done: true, next: true };
      }
      if (!data.name) {
        await send({ to: execution.customer_phone, body: 'Please reply with your full name for the appointment (at least 2 letters).' });
        return { done: false, wait_for_input: true };
      }
      return { done: true, next: true };
    }

    case 'confirm_details': {
      if (customerMessage === 'yes') {
        logStep(execution, step, 'confirmed', 'YES');
        return { done: true, next: true };
      }
      const deposit = (data.deposit_amount as number) || 0;
      const depositText = deposit > 0 ? `\n💰 *Deposit:* ₹${deposit}` : '';
      const msg = `Please confirm your booking:\n\n👤 *Name:* ${data.name}\n📋 *Service:* ${data.service_name}\n📅 *Date:* ${data.date}\n⏰ *Time:* ${data.time}${depositText}\n\nReply *YES* to confirm or *CANCEL* to abort.`;
      await send({ to: execution.customer_phone, body: msg });
      logStep(execution, step, 'asked_confirmation');
      return { done: false, wait_for_input: true };
    }

    case 'create_booking': {
      try {
        // Validate all required data is present
        const missing: string[] = [];
        if (!data.service_id) missing.push('service');
        if (!data.date) missing.push('date');
        if (!data.time) missing.push('time');
        if (!data.name) missing.push('name');

        if (missing.length > 0) {
          await send({
            to: execution.customer_phone,
            body: `❌ Missing information: ${missing.join(', ')}. Let's start over. Reply *BOOK* to restart.`,
          });
          execution.status = 'failed';
          return { done: true, next: false };
        }

        const business = await getBusinessById(execution.business_id);
        if (!business) throw new Error('Business not found');

        // Parse time like "10:00 AM" into 24h format
        const timeStr = data.time as string;
        let startHour = 0, startMin = 0;
        const ampmMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (ampmMatch) {
          startHour = parseInt(ampmMatch[1]);
          startMin = parseInt(ampmMatch[2]);
          const ampm = ampmMatch[3].toUpperCase();
          if (ampm === 'PM' && startHour !== 12) startHour += 12;
          if (ampm === 'AM' && startHour === 12) startHour = 0;
        } else {
          const [hh, mm] = timeStr.split(':').map(Number);
          startHour = hh || 0;
          startMin = mm || 0;
        }
        const startTime = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;

        await createAppointment({
          id: uuidv4(),
          business_id: execution.business_id,
          service_id: data.service_id as string,
          service_name: data.service_name as string,
          staff_id: null,
          staff_name: undefined,
          patient_name: data.name as string,
          patient_phone: execution.customer_phone,
          appointment_date: data.date as string,
          start_time: startTime,
          end_time: data.end_time as string,
          status: 'confirmed',
          notes: 'Booked via WhatsApp workflow',
          deposit_paid: false,
          deposit_amount: (data.deposit_amount as number) || 0,
          source: 'whatsapp',
        } as any);

        // Upsert customer
        const existing = await getCustomerByPhone(execution.customer_phone, execution.business_id);
        if (existing) {
          await updateCustomer({
            id: existing.id,
            visit_count: (existing.visit_count || 0) + 1,
            last_visit: data.date as string,
          });
        } else {
          await createCustomer({
            id: uuidv4(),
            business_id: execution.business_id,
            name: data.name as string,
            phone: execution.customer_phone,
            email: '',
            notes: '',
            visit_count: 1,
            last_visit: data.date as string,
            created_at: new Date().toISOString(),
          } as any);
        }

        logStep(execution, step, 'booking_created', `${data.name} — ${data.service_name} @ ${data.date} ${data.time}`);
        return { done: true, next: true };
      } catch (err) {
        logStep(execution, step, 'booking_failed', String(err));
        await send({ to: execution.customer_phone, body: '❌ Something went wrong while saving your booking. Please try again later.' });
        return { done: true, next: false };
      }
    }

    case 'send_confirmation': {
      const deposit = (data.deposit_amount as number) || 0;
      const depositText = deposit > 0 ? `\n💰 Deposit: ₹${deposit} (please pay to confirm)` : '';
      const farewell = personality?.farewell || 'Thank you for booking with us! See you soon. 💚';
      const msg = `✅ *Booking Confirmed!*\n\n👋 Hi ${data.name},\n\nYour appointment has been booked.\n\n📋 *Service:* ${data.service_name}\n📅 *Date:* ${data.date}\n⏰ *Time:* ${data.time}${depositText}\n\n${farewell}`;
      await send({ to: execution.customer_phone, body: msg });
      logStep(execution, step, 'sent_confirmation');
      return { done: true, next: false };
    }

    case 'ai_chat': {
      // Placeholder: AI chat step will be implemented with LLM integration
      await send({ to: execution.customer_phone, body: '🤖 AI chat coming soon! For now, reply *BOOK* to use the standard booking flow.' });
      logStep(execution, step, 'ai_chat_placeholder');
      return { done: true, next: false };
    }

    case 'collect_deposit': {
      const depAmount = (data.deposit_amount as number) || 0;
      if (depAmount > 0) {
        await send({
          to: execution.customer_phone,
          body: `💰 *Deposit Required*\n\nTo confirm your booking, please pay ₹${depAmount} via UPI.\n\n[Payment link will be generated here]\n\nYour slot is held for 15 minutes.`,
        });
        logStep(execution, step, 'asked_deposit', `₹${depAmount}`);
      }
      return { done: true, next: true };
    }

    case 'send_reminder': {
      const hours = step.config.hours_before as number || 24;
      await sendWhatsAppMessage({
        to: execution.customer_phone,
        body: `⏰ *Reminder*\n\nHi ${data.name || 'there'},\n\nYour appointment at ${businessName} is in ${hours} hours.\n\n📋 ${data.service_name || 'Your service'}\n📅 ${data.date || 'Scheduled date'}\n⏰ ${data.time || 'Scheduled time'}\n\nReply *CONFIRM* to confirm or *CANCEL* if you can't make it.`,
      });
      logStep(execution, step, 'sent_reminder', `${hours}h before`);
      return { done: true, next: true };
    }

    case 'ask_review': {
      await send({
        to: execution.customer_phone,
        body: `🌟 *How was your experience?*\n\nHi ${data.name || 'there'},\n\nWe hope you enjoyed your visit to ${businessName}. If you have a moment, we'd love a review on Google.\n\n[Review link]\n\nThank you! 💚`,
      });
      logStep(execution, step, 'asked_review');
      return { done: true, next: true };
    }

    default:
      return { done: true, next: true };
  }
}

// ─── Main Orchestrator ───
const CANCEL_WORDS = ['cancel', 'stop', 'exit', 'quit', 'back'];
const HELP_WORDS = ['help', 'support', 'assist'];
const START_WORDS = ['hi', 'hello', 'book', 'start', 'hey', 'namaste'];

export async function processWorkflowMessage(
  workflow: Workflow,
  customerPhone: string,
  message: string,
  businessName: string,
  services: Service[],
  onMessage?: (msg: WhatsAppMessage) => Promise<void>
): Promise<void> {
  const normalizedMsg = message.toLowerCase().trim();
  let execution = getExecution(customerPhone);

  // Handle global commands
  const send = onMessage || sendWhatsAppMessage;

  if (HELP_WORDS.includes(normalizedMsg)) {
    const faq = workflow.bot_personality?.faq || [];
    const faqText = faq.length > 0
      ? '\n\n*Common Questions:*\n' + faq.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')
      : '';
    await send({
      to: customerPhone,
      body: `👋 *Help*\n\nReply with:\n• *BOOK* — Start booking\n• *CANCEL* — Cancel current booking\n• *HELP* — Show this message${faqText}\n\nOr call us anytime.`,
    });
    return;
  }

  if (CANCEL_WORDS.includes(normalizedMsg)) {
    if (execution && execution.status === 'running') {
      clearExecution(customerPhone);
      await send({
        to: customerPhone,
        body: '❌ Booking cancelled. Reply *BOOK* to start again.',
      });
    } else {
      await send({
        to: customerPhone,
        body: 'No active booking to cancel. Reply *BOOK* to start.',
      });
    }
    return;
  }

  // Start new execution if none exists or if user says hi/book/start
  const isStartCommand = START_WORDS.includes(normalizedMsg);

  if (!execution || isStartCommand) {
    execution = createExecution(workflow, customerPhone);
  }

  if (execution.status === 'completed') {
    if (isStartCommand) {
      execution = createExecution(workflow, customerPhone);
    } else {
      await send({
        to: customerPhone,
        body: `👋 Hello! Welcome to ${businessName}.\n\nReply *BOOK* to book an appointment or *HELP* for assistance.`,
      });
      return;
    }
  }

  // Guard: no services configured
  if (services.length === 0) {
    await send({
      to: customerPhone,
      body: `👋 Hi! ${businessName} is currently not accepting online bookings. Please call us for assistance.`,
    });
    execution.status = 'failed';
    return;
  }

  // Find current enabled step
  const enabledSteps = workflow.steps.filter(s => s.enabled);
  if (execution.current_step_index >= enabledSteps.length) {
    execution.status = 'completed';
    return;
  }

  const currentStep = enabledSteps[execution.current_step_index];

  // Execute current step
  const result = await executeStep(currentStep, execution, message, businessName, services, workflow.bot_personality, onMessage);

  if (result.next) {
    execution.current_step_index++;

    // Auto-execute next step if it doesn't need input
    while (execution.current_step_index < enabledSteps.length) {
      const nextStep = enabledSteps[execution.current_step_index];
      const nextResult = await executeStep(nextStep, execution, '', businessName, services, workflow.bot_personality, onMessage);
      if (nextResult.wait_for_input) break;
      if (!nextResult.next) {
        execution.status = 'completed';
        break;
      }
      execution.current_step_index++;
    }
  }

  if (execution.current_step_index >= enabledSteps.length) {
    execution.status = 'completed';
  }

  execution.updated_at = new Date().toISOString();
}
