// Hybrid DB: uses Supabase when env vars present, falls back to JSON file
// This lets you develop locally without Supabase, then switch over instantly

import { createServerClient as createSupabaseServerClient } from './supabase';
import * as jsonDb from './db';
import * as supabaseDb from './db-supabase';
import type { Business, Service, Appointment, Customer, Workflow } from '@/types';

const useSupabase = !!(
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-service-role-key-here'
);

// ─── Business ───
export async function getBusinessByEmail(email: string): Promise<Business | null> {
  if (useSupabase) return supabaseDb.getBusinessByEmail(email);
  const db = jsonDb.getDb();
  return db.businesses.find(b => b.email === email) || null;
}

export async function getBusinessById(id: string): Promise<Business | null> {
  if (useSupabase) return supabaseDb.getBusinessById(id);
  const db = jsonDb.getDb();
  return db.businesses.find(b => b.id === id) || null;
}

export async function getBusinessByPhone(phone: string): Promise<Business | null> {
  if (useSupabase) return supabaseDb.getBusinessByPhone(phone);
  return jsonDb.getBusinessByPhone(phone) || null;
}

export async function createBusiness(business: Omit<Business, 'created_at'>): Promise<Business> {
  if (useSupabase) return supabaseDb.createBusiness(business);
  const db = jsonDb.getDb();
  db.businesses.push(business as Business);
  jsonDb.saveDb(db);
  return business as Business;
}

// ─── Services ───
export async function getServicesByBusiness(businessId: string): Promise<Service[]> {
  if (useSupabase) return supabaseDb.getServicesByBusiness(businessId);
  const db = jsonDb.getDb();
  return db.services.filter(s => s.business_id === businessId && s.is_active);
}

export async function createService(service: Omit<Service, 'created_at'>): Promise<Service> {
  if (useSupabase) return supabaseDb.createService(service);
  const db = jsonDb.getDb();
  db.services.push(service as Service);
  jsonDb.saveDb(db);
  return service as Service;
}

export async function deactivateService(id: string, businessId: string): Promise<void> {
  if (useSupabase) return supabaseDb.deactivateService(id, businessId);
  const db = jsonDb.getDb();
  const s = db.services.find(s => s.id === id && s.business_id === businessId);
  if (s) { s.is_active = false; jsonDb.saveDb(db); }
}

// ─── Appointments ───
export async function getAppointmentsByBusiness(businessId: string): Promise<Appointment[]> {
  if (useSupabase) return supabaseDb.getAppointmentsByBusiness(businessId);
  const db = jsonDb.getDb();
  return db.appointments.filter(a => a.business_id === businessId);
}

export async function createAppointment(appointment: Omit<Appointment, 'created_at'>): Promise<Appointment> {
  if (useSupabase) return supabaseDb.createAppointment(appointment);
  const db = jsonDb.getDb();
  db.appointments.push(appointment as Appointment);
  jsonDb.saveDb(db);
  return appointment as Appointment;
}

export async function updateAppointmentStatus(
  id: string,
  businessId: string,
  status: Appointment['status']
): Promise<void> {
  if (useSupabase) return supabaseDb.updateAppointmentStatus(id, businessId, status);
  const db = jsonDb.getDb();
  const a = db.appointments.find(a => a.id === id && a.business_id === businessId);
  if (a) { a.status = status; jsonDb.saveDb(db); }
}

export async function getTodayAppointments(businessId: string): Promise<Appointment[]> {
  if (useSupabase) return supabaseDb.getTodayAppointments(businessId);
  return jsonDb.getTodayAppointments(businessId);
}

export async function getUpcomingAppointments(businessId: string, limit = 10): Promise<Appointment[]> {
  if (useSupabase) return supabaseDb.getUpcomingAppointments(businessId, limit);
  return jsonDb.getUpcomingAppointments(businessId, limit);
}

// ─── Customers ───
export async function getCustomersByBusiness(businessId: string): Promise<Customer[]> {
  if (useSupabase) return supabaseDb.getCustomersByBusiness(businessId);
  const db = jsonDb.getDb();
  return db.customers.filter(c => c.business_id === businessId);
}

export async function createCustomer(customer: Omit<Customer, 'created_at'>): Promise<Customer> {
  if (useSupabase) return supabaseDb.createCustomer(customer);
  const db = jsonDb.getDb();
  db.customers.push(customer as Customer);
  jsonDb.saveDb(db);
  return customer as Customer;
}

export async function getCustomerByPhone(phone: string, businessId: string): Promise<Customer | null> {
  if (useSupabase) return supabaseDb.getCustomerByPhone(phone, businessId);
  const db = jsonDb.getDb();
  return db.customers.find(c => c.phone === phone && c.business_id === businessId) || null;
}

export async function updateCustomer(customer: Partial<Customer> & { id: string }): Promise<void> {
  if (useSupabase) return supabaseDb.updateCustomer(customer);
  const db = jsonDb.getDb();
  const c = db.customers.find(c => c.id === customer.id);
  if (c) { Object.assign(c, customer); jsonDb.saveDb(db); }
}

// ─── Dashboard Stats ───
export async function getDashboardStats(businessId: string) {
  if (useSupabase) return supabaseDb.getDashboardStats(businessId);
  return jsonDb.getDashboardStats(businessId);
}

// ─── Workflows ───
export async function getWorkflowByBusiness(businessId: string): Promise<Workflow | null> {
  if (useSupabase) return supabaseDb.getWorkflowByBusiness(businessId);
  return jsonDb.getWorkflowByBusiness(businessId) || null;
}

export async function saveWorkflow(workflow: Workflow): Promise<void> {
  if (useSupabase) return supabaseDb.saveWorkflow(workflow);
  jsonDb.saveWorkflow(workflow);
}
