// ─── BookKar Workflow System ───
// Simple step-based automation for WhatsApp booking
// Vendors pick a template → customise steps → activate

export type WorkflowStepType =
  | 'send_welcome'
  | 'show_services'
  | 'pick_service'
  | 'pick_date'
  | 'pick_time'
  | 'ask_name'
  | 'confirm_details'
  | 'create_booking'
  | 'send_confirmation'
  | 'ai_chat'
  | 'collect_deposit'
  | 'send_reminder'
  | 'ask_review';

export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  label: string;
  description: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface Workflow {
  id: string;
  business_id: string;
  name: string;
  template_id: string;
  is_active: boolean;
  steps: WorkflowStep[];
  bot_personality?: BotPersonality;
  created_at: string;
  updated_at: string;
}

export interface BotPersonality {
  tone: 'friendly' | 'professional' | 'casual' | 'formal';
  language: 'english' | 'hindi' | 'hinglish';
  greeting: string;
  farewell: string;
  special_notes: string;
  faq: { q: string; a: string }[];
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  business_id: string;
  customer_phone: string;
  current_step_index: number;
  step_data: Record<string, unknown>;
  status: 'running' | 'completed' | 'failed' | 'waiting';
  logs: WorkflowLog[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowLog {
  step_id: string;
  step_type: WorkflowStepType;
  action: string;
  timestamp: string;
  details?: string;
}

// ─── Templates ───
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'booking' | 'reminder' | 'followup' | 'ai';
  is_premium: boolean;
  steps: Omit<WorkflowStep, 'id'>[];
  default_personality: BotPersonality;
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'basic-booking',
    name: 'Basic Booking',
    description: 'The classic menu-based booking flow. Customer picks service → date → time → confirms.',
    icon: 'ListOrdered',
    category: 'booking',
    is_premium: false,
    steps: [
      { type: 'send_welcome', label: 'Welcome Message', description: 'Greet the customer', enabled: true, config: {} },
      { type: 'show_services', label: 'Show Services', description: 'Display available services as a numbered list', enabled: true, config: {} },
      { type: 'pick_service', label: 'Pick Service', description: 'Customer selects a service by number', enabled: true, config: {} },
      { type: 'pick_date', label: 'Pick Date', description: 'Customer selects from next 7 days', enabled: true, config: { days_ahead: 7 } },
      { type: 'pick_time', label: 'Pick Time', description: 'Customer selects from available slots', enabled: true, config: { slots: ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'] } },
      { type: 'ask_name', label: 'Ask Name', description: 'Collect customer full name', enabled: true, config: {} },
      { type: 'confirm_details', label: 'Confirm Details', description: 'Show summary and ask YES to confirm', enabled: true, config: {} },
      { type: 'create_booking', label: 'Create Booking', description: 'Save appointment to database', enabled: true, config: {} },
      { type: 'send_confirmation', label: 'Send Confirmation', description: 'Send booking confirmation message', enabled: true, config: {} },
    ],
    default_personality: {
      tone: 'friendly',
      language: 'english',
      greeting: "👋 Hi! Welcome to {businessName}. I'm your booking assistant.",
      farewell: 'Thank you for booking with us! See you soon. 💚',
      special_notes: '',
      faq: [],
    },
  },
  {
    id: 'smart-agent',
    name: 'Smart AI Agent',
    description: 'Customers chat naturally. The AI understands intent, asks clarifying questions, and books automatically.',
    icon: 'Brain',
    category: 'ai',
    is_premium: true,
    steps: [
      { type: 'send_welcome', label: 'Welcome Message', description: 'Greet the customer', enabled: true, config: {} },
      { type: 'ai_chat', label: 'AI Conversation', description: 'LLM-powered natural language booking', enabled: true, config: { max_turns: 10 } },
      { type: 'create_booking', label: 'Create Booking', description: 'Save appointment to database', enabled: true, config: {} },
      { type: 'send_confirmation', label: 'Send Confirmation', description: 'Send booking confirmation message', enabled: true, config: {} },
    ],
    default_personality: {
      tone: 'friendly',
      language: 'hinglish',
      greeting: "👋 Hey! {businessName} mein aapka swagat hai! Kya aap appointment book karna chahte hain?",
      farewell: 'Thank you! Aapka din shubh ho. 🙏',
      special_notes: '',
      faq: [
        { q: 'Do you accept walk-ins?', a: 'Yes, but appointments are preferred to avoid waiting.' },
        { q: 'What products do you use?', a: 'We use only L\'Oréal Professional products.' },
      ],
    },
  },
  {
    id: 'reminder-bot',
    name: 'Reminder Bot',
    description: 'Automatically sends 24-hour and 1-hour reminders. Reduces no-shows by up to 80%.',
    icon: 'Bell',
    category: 'reminder',
    is_premium: true,
    steps: [
      { type: 'send_reminder', label: '24-Hour Reminder', description: 'Send reminder 24 hours before appointment', enabled: true, config: { hours_before: 24 } },
      { type: 'send_reminder', label: '1-Hour Reminder', description: 'Send reminder 1 hour before appointment', enabled: true, config: { hours_before: 1 } },
      { type: 'ask_review', label: 'Ask for Review', description: 'Request Google review after appointment', enabled: true, config: { hours_after: 2 } },
    ],
    default_personality: {
      tone: 'professional',
      language: 'english',
      greeting: '',
      farewell: '',
      special_notes: '',
      faq: [],
    },
  },
  {
    id: 'deposit-first',
    name: 'Deposit First',
    description: 'Collects a deposit via UPI before confirming the booking. Eliminates fake bookings.',
    icon: 'Wallet',
    category: 'booking',
    is_premium: true,
    steps: [
      { type: 'send_welcome', label: 'Welcome Message', description: 'Greet the customer', enabled: true, config: {} },
      { type: 'show_services', label: 'Show Services', description: 'Display available services', enabled: true, config: {} },
      { type: 'pick_service', label: 'Pick Service', description: 'Customer selects a service', enabled: true, config: {} },
      { type: 'pick_date', label: 'Pick Date', description: 'Customer selects date', enabled: true, config: { days_ahead: 7 } },
      { type: 'pick_time', label: 'Pick Time', description: 'Customer selects time slot', enabled: true, config: {} },
      { type: 'ask_name', label: 'Ask Name', description: 'Collect customer name', enabled: true, config: {} },
      { type: 'collect_deposit', label: 'Collect Deposit', description: 'Send UPI link for deposit payment', enabled: true, config: {} },
      { type: 'confirm_details', label: 'Confirm After Payment', description: 'Confirm once deposit is paid', enabled: true, config: {} },
      { type: 'create_booking', label: 'Create Booking', description: 'Save to database after payment', enabled: true, config: {} },
      { type: 'send_confirmation', label: 'Send Confirmation', description: 'Send final confirmation', enabled: true, config: {} },
    ],
    default_personality: {
      tone: 'professional',
      language: 'english',
      greeting: '👋 Welcome to {businessName}! A small deposit secures your appointment.',
      farewell: 'Your appointment is confirmed. See you soon!',
      special_notes: 'Mention that deposit is fully adjustable against final bill.',
      faq: [
        { q: 'Is the deposit refundable?', a: 'Yes, if you cancel 24 hours in advance.' },
      ],
    },
  },
];
