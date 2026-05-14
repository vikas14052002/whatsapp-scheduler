import { createServerClient } from './supabase';
import { Business, Service, Appointment, Customer, Workflow } from '@/types';

// ─── Business ───
export async function getBusinessByEmail(email: string): Promise<Business | null> {
  const supabase = createServerClient();
  const { data } = await supabase.from('businesses').select('*').eq('email', email).single();
  return data as Business | null;
}

export async function createBusiness(business: Omit<Business, 'created_at'>): Promise<Business> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('businesses').insert(business as any).select().single();
  if (error) throw error;
  return data as Business;
}

export async function getBusinessById(id: string): Promise<Business | null> {
  const supabase = createServerClient();
  const { data } = await supabase.from('businesses').select('*').eq('id', id).single();
  return data as Business | null;
}

export async function getBusinessByPhone(phone: string): Promise<Business | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('businesses')
    .select('*')
    .or(`whatsapp_number.eq.${phone},phone.eq.${phone}`)
    .single();
  return data as Business | null;
}

// ─── Services ───
export async function getServicesByBusiness(businessId: string): Promise<Service[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  return (data as Service[]) || [];
}

export async function createService(service: Omit<Service, 'created_at'>): Promise<Service> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('services').insert(service as any).select().single();
  if (error) throw error;
  return data as Service;
}

export async function deactivateService(id: string, businessId: string): Promise<void> {
  const supabase = createServerClient();
  await supabase.from('services').update({ is_active: false } as any).eq('id', id).eq('business_id', businessId);
}

// ─── Appointments ───
export async function getAppointmentsByBusiness(businessId: string): Promise<Appointment[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('business_id', businessId)
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true });
  return (data as Appointment[]) || [];
}

export async function createAppointment(appointment: Omit<Appointment, 'created_at'>): Promise<Appointment> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('appointments').insert(appointment as any).select().single();
  if (error) throw error;
  return data as Appointment;
}

export async function updateAppointmentStatus(
  id: string,
  businessId: string,
  status: Appointment['status']
): Promise<void> {
  const supabase = createServerClient();
  await supabase.from('appointments').update({ status } as any).eq('id', id).eq('business_id', businessId);
}

export async function getUpcomingAppointments(businessId: string, limit = 10): Promise<Appointment[]> {
  const today = new Date().toISOString().split('T')[0];
  const supabase = createServerClient();
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('business_id', businessId)
    .eq('status', 'confirmed')
    .gte('appointment_date', today)
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(limit);
  return (data as Appointment[]) || [];
}

export async function getTodayAppointments(businessId: string): Promise<Appointment[]> {
  const today = new Date().toISOString().split('T')[0];
  const supabase = createServerClient();
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('business_id', businessId)
    .eq('appointment_date', today);
  return (data as Appointment[]) || [];
}

// ─── Customers ───
export async function getCustomersByBusiness(businessId: string): Promise<Customer[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('patients')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });
  return (data as Customer[]) || [];
}

export async function createCustomer(customer: Omit<Customer, 'created_at'>): Promise<Customer> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('patients').insert(customer as any).select().single();
  if (error) throw error;
  return data as Customer;
}

export async function getCustomerByPhone(phone: string, businessId: string): Promise<Customer | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('patients')
    .select('*')
    .eq('phone', phone)
    .eq('business_id', businessId)
    .single();
  return data as Customer | null;
}

export async function updateCustomer(customer: Partial<Customer> & { id: string }): Promise<void> {
  const supabase = createServerClient();
  await supabase.from('patients').update(customer as any).eq('id', customer.id);
}

// ─── Dashboard Stats ───
export async function getDashboardStats(businessId: string) {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const supabase = createServerClient();

  const todayRes = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('business_id', businessId).eq('appointment_date', today);
  const weekRes = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('business_id', businessId).gte('appointment_date', weekAgo);
  const customerRes = await supabase.from('patients').select('*', { count: 'exact', head: true }).eq('business_id', businessId);
  const allAppointmentsRes = await supabase.from('appointments').select('status').eq('business_id', businessId).in('status', ['completed', 'no_show', 'cancelled']);
  const upcoming = await getUpcomingAppointments(businessId, 5);
  const recentCustomersRes = await supabase.from('patients').select('*').eq('business_id', businessId).order('created_at', { ascending: false }).limit(5);

  const allAppointments = allAppointmentsRes.data || [];
  const noShows = allAppointments.filter((a: any) => a.status === 'no_show').length || 0;
  const completed = allAppointments.filter((a: any) => a.status === 'completed').length || 0;
  const cancelled = allAppointments.filter((a: any) => a.status === 'cancelled').length || 0;
  const totalFinished = completed + noShows + cancelled;

  return {
    total_appointments_today: (todayRes as any).count || 0,
    total_appointments_week: (weekRes as any).count || 0,
    total_customers: (customerRes as any).count || 0,
    no_show_rate: totalFinished > 0 ? Math.round((noShows / totalFinished) * 100) : 0,
    upcoming_appointments: upcoming,
    recent_customers: (recentCustomersRes.data as Customer[]) || [],
  };
}

// ─── Workflows ───
export async function getWorkflowByBusiness(businessId: string): Promise<Workflow | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('workflows')
    .select('*')
    .eq('business_id', businessId)
    .single();
  return data as Workflow | null;
}

export async function saveWorkflow(workflow: Workflow): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase.from('workflows').upsert(workflow as any);
  if (error) throw error;
}
