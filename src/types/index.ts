export interface Business {
  id: string;
  name: string;
  type: 'salon' | 'clinic' | 'tuition' | 'consultant' | 'spa' | 'other';
  phone: string;
  email: string;
  address: string;
  whatsapp_number: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  deposit_amount: number;
  is_active: boolean;
  created_at: string;
}

export interface Staff {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  email: string;
  is_active: boolean;
}

export interface Appointment {
  id: string;
  business_id: string;
  service_id: string;
  service_name?: string;
  staff_id: string | null;
  staff_name?: string;
  patient_name: string;
  patient_phone: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  notes: string;
  deposit_paid: boolean;
  deposit_amount: number;
  source: 'whatsapp' | 'manual' | 'web';
  created_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  visit_count: number;
  last_visit: string | null;
  created_at: string;
}

/** @deprecated Use Customer instead */
export type Patient = Customer;

export interface ReminderLog {
  id: string;
  appointment_id: string;
  type: '24hr' | '1hr' | 'confirmation' | 'followup';
  sent_at: string;
  status: 'sent' | 'failed' | 'delivered';
}

export interface DashboardStats {
  total_appointments_today: number;
  total_appointments_week: number;
  total_customers: number;
  no_show_rate: number;
  upcoming_appointments: Appointment[];
  recent_customers: Customer[];
}

export interface UserSession {
  business_id: string;
  email: string;
  name: string;
}

// Re-export config types for convenience
export type { BusinessCategory, BusinessTypeConfig } from '@/lib/config';
export { BUSINESS_TYPES, BUSINESS_TYPE_MAP, LABELS, APP_CONFIG } from '@/lib/config';

// Workflow types
export type {
  Workflow,
  WorkflowStep,
  WorkflowStepType,
  WorkflowExecution,
  WorkflowLog,
  WorkflowTemplate,
  BotPersonality,
} from '@/lib/workflow/types';
export { WORKFLOW_TEMPLATES } from '@/lib/workflow/types';
