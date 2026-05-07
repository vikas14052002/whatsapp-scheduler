import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Business, Service, Appointment, Patient, Staff, ReminderLog } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_PATH, 'db.json');

interface Database {
  businesses: Business[];
  services: Service[];
  appointments: Appointment[];
  patients: Patient[];
  staff: Staff[];
  reminder_logs: ReminderLog[];
}

const defaultDb: Database = {
  businesses: [],
  services: [],
  appointments: [],
  patients: [],
  staff: [],
  reminder_logs: [],
};

function ensureDb(): Database {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
    return defaultDb;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return defaultDb;
  }
}

function saveDb(db: Database): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Seed demo data if empty
function seedIfEmpty(db: Database): Database {
  if (db.businesses.length === 0) {
    const businessId = uuidv4();
    const business: Business = {
      id: businessId,
      name: 'Glow Beauty Salon',
      type: 'salon',
      phone: '+919876543210',
      email: 'demo@glowsalon.in',
      address: '123 Main Street, Mumbai',
      whatsapp_number: '+919876543210',
      timezone: 'Asia/Kolkata',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const services: Service[] = [
      { id: uuidv4(), business_id: businessId, name: 'Haircut', description: 'Standard haircut', duration_minutes: 30, price: 300, deposit_amount: 50, is_active: true, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Facial', description: 'Deep cleansing facial', duration_minutes: 60, price: 800, deposit_amount: 100, is_active: true, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Hair Coloring', description: 'Full hair color', duration_minutes: 120, price: 1500, deposit_amount: 200, is_active: true, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Manicure', description: 'Nail care and polish', duration_minutes: 45, price: 400, deposit_amount: 50, is_active: true, created_at: new Date().toISOString() },
    ];

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const appointments: Appointment[] = [
      { id: uuidv4(), business_id: businessId, service_id: services[0].id, service_name: 'Haircut', staff_id: null, patient_name: 'Priya Sharma', patient_phone: '+919988776655', appointment_date: today, start_time: '10:00', end_time: '10:30', status: 'confirmed', notes: '', deposit_paid: true, deposit_amount: 50, source: 'whatsapp', created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, service_id: services[1].id, service_name: 'Facial', staff_id: null, patient_name: 'Ananya Gupta', patient_phone: '+919977665544', appointment_date: today, start_time: '11:00', end_time: '12:00', status: 'confirmed', notes: 'First time customer', deposit_paid: false, deposit_amount: 100, source: 'manual', created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, service_id: services[0].id, service_name: 'Haircut', staff_id: null, patient_name: 'Rahul Mehta', patient_phone: '+919966554433', appointment_date: today, start_time: '14:00', end_time: '14:30', status: 'cancelled', notes: 'Cancelled via WhatsApp', deposit_paid: false, deposit_amount: 50, source: 'whatsapp', created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, service_id: services[2].id, service_name: 'Hair Coloring', staff_id: null, patient_name: 'Sneha Patel', patient_phone: '+919955443322', appointment_date: tomorrow, start_time: '10:00', end_time: '12:00', status: 'confirmed', notes: '', deposit_paid: true, deposit_amount: 200, source: 'web', created_at: new Date().toISOString() },
    ];

    const patients: Patient[] = [
      { id: uuidv4(), business_id: businessId, name: 'Priya Sharma', phone: '+919988776655', email: '', notes: 'Regular customer', visit_count: 5, last_visit: today, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Ananya Gupta', phone: '+919977665544', email: '', notes: 'First visit', visit_count: 1, last_visit: today, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Rahul Mehta', phone: '+919966554433', email: '', notes: 'Cancelled last time', visit_count: 2, last_visit: today, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Sneha Patel', phone: '+919955443322', email: '', notes: '', visit_count: 3, last_visit: today, created_at: new Date().toISOString() },
    ];

    db.businesses.push(business);
    db.services.push(...services);
    db.appointments.push(...appointments);
    db.patients.push(...patients);
    saveDb(db);
  }
  return db;
}

export function getDb(): Database {
  const db = ensureDb();
  return seedIfEmpty(db);
}

export { saveDb, uuidv4 };

// Query helpers
export function getBusinessById(id: string): Business | undefined {
  return getDb().businesses.find(b => b.id === id);
}

export function getServicesByBusiness(businessId: string): Service[] {
  return getDb().services.filter(s => s.business_id === businessId && s.is_active);
}

export function getAppointmentsByBusiness(businessId: string): Appointment[] {
  return getDb().appointments.filter(a => a.business_id === businessId).sort((a, b) => {
    const da = new Date(a.appointment_date + 'T' + a.start_time);
    const db_ = new Date(b.appointment_date + 'T' + b.start_time);
    return db_.getTime() - da.getTime();
  });
}

export function getPatientsByBusiness(businessId: string): Patient[] {
  return getDb().patients.filter(p => p.business_id === businessId).sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function getTodayAppointments(businessId: string): Appointment[] {
  const today = new Date().toISOString().split('T')[0];
  return getDb().appointments.filter(a => a.business_id === businessId && a.appointment_date === today);
}

export function getUpcomingAppointments(businessId: string, limit = 10): Appointment[] {
  const today = new Date().toISOString().split('T')[0];
  return getDb().appointments
    .filter(a => a.business_id === businessId && a.appointment_date >= today && a.status === 'confirmed')
    .sort((a, b) => {
      const da = new Date(a.appointment_date + 'T' + a.start_time);
      const db_ = new Date(b.appointment_date + 'T' + b.start_time);
      return da.getTime() - db_.getTime();
    })
    .slice(0, limit);
}

export function getDashboardStats(businessId: string) {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  const allAppts = db.appointments.filter(a => a.business_id === businessId);
  const todayAppts = allAppts.filter(a => a.appointment_date === today);
  const weekAppts = allAppts.filter(a => a.appointment_date >= weekAgo);
  const patients = db.patients.filter(p => p.business_id === businessId);
  const noShows = allAppts.filter(a => a.status === 'no_show').length;
  const completed = allAppts.filter(a => a.status === 'completed').length;
  const cancelled = allAppts.filter(a => a.status === 'cancelled').length;

  const totalFinished = completed + noShows + cancelled;
  const noShowRate = totalFinished > 0 ? Math.round((noShows / totalFinished) * 100) : 0;

  return {
    total_appointments_today: todayAppts.length,
    total_appointments_week: weekAppts.length,
    total_patients: patients.length,
    no_show_rate: noShowRate,
    upcoming_appointments: getUpcomingAppointments(businessId, 5),
    recent_patients: patients.slice(0, 5),
  };
}
