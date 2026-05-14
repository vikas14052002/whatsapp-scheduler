// ─── Client-side Workflow Simulator ───
// Runs entirely in browser. Simulates the bot conversation
// without hitting the server or database.

import { Workflow, WorkflowStep, BotPersonality } from './types';
import type { Service } from '@/types';

export interface ChatMessage {
  id: string;
  from: 'bot' | 'customer';
  text: string;
  timestamp: Date;
}

export interface SimState {
  stepIndex: number;
  data: Record<string, unknown>;
  status: 'running' | 'completed' | 'cancelled';
}

export class WorkflowSimulator {
  private workflow: Workflow;
  private services: Service[];
  private messages: ChatMessage[] = [];
  private state: SimState;
  private onMessage: (msg: ChatMessage) => void;

  constructor(workflow: Workflow, services: Service[], onMessage: (msg: ChatMessage) => void) {
    this.workflow = workflow;
    this.services = services;
    this.onMessage = onMessage;
    this.state = { stepIndex: 0, data: {}, status: 'running' };
  }

  getMessages(): ChatMessage[] {
    return this.messages;
  }

  private addBot(text: string) {
    const msg: ChatMessage = { id: Math.random().toString(36).slice(2), from: 'bot', text, timestamp: new Date() };
    this.messages.push(msg);
    this.onMessage(msg);
  }

  private addCustomer(text: string) {
    const msg: ChatMessage = { id: Math.random().toString(36).slice(2), from: 'customer', text, timestamp: new Date() };
    this.messages.push(msg);
    this.onMessage(msg);
  }

  start() {
    this.messages = [];
    this.state = { stepIndex: 0, data: {}, status: 'running' };
    this.runNextStep();
  }

  sendCustomerMessage(text: string) {
    if (this.state.status !== 'running') {
      this.addBot('Reply *BOOK* to start a new appointment.');
      return;
    }

    const lower = text.toLowerCase().trim();

    if (['cancel', 'stop', 'exit'].includes(lower)) {
      this.state.status = 'cancelled';
      this.addCustomer(text);
      this.addBot('❌ Booking cancelled. Reply *BOOK* to start again.');
      return;
    }

    this.addCustomer(text);
    this.runNextStep(text);
  }

  private runNextStep(customerInput: string = '') {
    const enabledSteps = this.workflow.steps.filter((s) => s.enabled);

    while (this.state.stepIndex < enabledSteps.length && this.state.status === 'running') {
      const step = enabledSteps[this.state.stepIndex];
      const result = this.executeStep(step, customerInput);

      if (result.waitForInput) {
        return; // Stop and wait for customer reply
      }

      if (result.next) {
        this.state.stepIndex++;
        customerInput = ''; // Clear input for auto-advance steps
      } else {
        this.state.status = 'completed';
        return;
      }
    }

    if (this.state.stepIndex >= enabledSteps.length) {
      this.state.status = 'completed';
    }
  }

  private executeStep(step: WorkflowStep, input: string): { next: boolean; waitForInput: boolean } {
    const data = this.state.data;
    const personality = this.workflow.bot_personality;
    const bizName = 'Your Business';

    switch (step.type) {
      case 'send_welcome': {
        const greeting = personality?.greeting || "👋 Hi! Welcome to {businessName}.";
        this.addBot(greeting.replace(/{businessName}/g, bizName));
        return { next: true, waitForInput: false };
      }

      case 'show_services': {
        if (this.services.length === 0) {
          this.addBot('No services available right now.');
          return { next: true, waitForInput: false };
        }
        const list = this.services.map((s, i) => `${i + 1}. ${s.name} — ₹${s.price}`).join('\n');
        this.addBot(`📋 *Our Services*\n\n${list}\n\nReply with the number.`);
        return { next: false, waitForInput: true };
      }

      case 'pick_service': {
        const idx = parseInt(input) - 1;
        if (idx >= 0 && idx < this.services.length) {
          data.service_id = this.services[idx].id;
          data.service_name = this.services[idx].name;
          data.service_price = this.services[idx].price;
          data.service_duration = this.services[idx].duration_minutes;
          data.deposit_amount = this.services[idx].deposit_amount;
          return { next: true, waitForInput: false };
        }
        this.addBot('❌ Invalid selection. Please reply with a number from the list.');
        return { next: false, waitForInput: true };
      }

      case 'pick_date': {
        const days = (step.config.days_ahead as number) || 7;
        const selected = parseInt(input) - 1;
        if (selected >= 0 && selected < days) {
          const d = new Date();
          d.setDate(d.getDate() + selected);
          data.date = d.toISOString().split('T')[0];
          return { next: true, waitForInput: false };
        }
        const dates = Array.from({ length: days }, (_, i) => {
          const dd = new Date();
          dd.setDate(dd.getDate() + i);
          return `${i + 1}. ${dd.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`;
        }).join('\n');
        this.addBot(`📅 *Pick a date*\n\n${dates}\n\nReply with a number 1-${days}.`);
        return { next: false, waitForInput: true };
      }

      case 'pick_time': {
        const slots = (step.config.slots as string[]) || ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        const selected = parseInt(input) - 1;
        if (selected >= 0 && selected < slots.length) {
          data.time = slots[selected];
          return { next: true, waitForInput: false };
        }
        const slotsList = slots.map((s, i) => `${i + 1}. ${s}`).join('\n');
        this.addBot(`⏰ *Available slots*\n\n${slotsList}\n\nReply with a number.`);
        return { next: false, waitForInput: true };
      }

      case 'ask_name': {
        const trimmed = input.trim();
        if (trimmed.length >= 2 && !/^\d+$/.test(trimmed)) {
          data.name = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
          return { next: true, waitForInput: false };
        }
        this.addBot('Please reply with your full name (at least 2 letters).');
        return { next: false, waitForInput: true };
      }

      case 'confirm_details': {
        if (input.toLowerCase().trim() === 'yes') {
          return { next: true, waitForInput: false };
        }
        const deposit = (data.deposit_amount as number) || 0;
        const depositText = deposit > 0 ? `\n💰 *Deposit:* ₹${deposit}` : '';
        this.addBot(
          `Please confirm:\n\n👤 *Name:* ${data.name}\n📋 *Service:* ${data.service_name}\n📅 *Date:* ${data.date}\n⏰ *Time:* ${data.time}${depositText}\n\nReply *YES* to confirm or *CANCEL* to abort.`
        );
        return { next: false, waitForInput: true };
      }

      case 'create_booking': {
        const missing: string[] = [];
        if (!data.service_id) missing.push('service');
        if (!data.date) missing.push('date');
        if (!data.time) missing.push('time');
        if (!data.name) missing.push('name');

        if (missing.length > 0) {
          this.addBot(`❌ Missing: ${missing.join(', ')}. Reply *BOOK* to restart.`);
          this.state.status = 'completed';
          return { next: false, waitForInput: false };
        }

        this.addBot(`✅ Booking saved for ${data.name}!`);
        return { next: true, waitForInput: false };
      }

      case 'send_confirmation': {
        const farewell = personality?.farewell || 'Thank you! See you soon. 💚';
        this.addBot(`✅ *Confirmed!*\n\n📋 ${data.service_name}\n📅 ${data.date} @ ${data.time}\n\n${farewell}`);
        return { next: false, waitForInput: false };
      }

      case 'collect_deposit': {
        const dep = (data.deposit_amount as number) || 0;
        if (dep > 0) {
          this.addBot(`💰 *Deposit Required*\n\nPlease pay ₹${dep} via UPI to confirm.\n\n[Payment link placeholder]\n\nYour slot is held for 15 minutes.`);
        }
        return { next: true, waitForInput: false };
      }

      case 'ai_chat': {
        this.addBot('🤖 AI chat is not available in preview mode.');
        return { next: false, waitForInput: false };
      }

      case 'send_reminder': {
        const hours = step.config.hours_before as number;
        this.addBot(`⏰ *Reminder:* Your appointment is in ${hours} hours.`);
        return { next: true, waitForInput: false };
      }

      case 'ask_review': {
        this.addBot(`🌟 How was your experience? We'd love a Google review!\n\n[Review link]`);
        return { next: true, waitForInput: false };
      }

      default:
        return { next: true, waitForInput: false };
    }
  }
}
