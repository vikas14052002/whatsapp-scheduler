import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Business, Service, Appointment, Customer, Staff, ReminderLog, Workflow } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_PATH, 'db.json');

interface Database {
  businesses: Business[];
  services: Service[];
  appointments: Appointment[];
  customers: Customer[];
  staff: Staff[];
  reminder_logs: ReminderLog[];
  workflows: Workflow[];
}

const defaultDb: Database = {
  businesses: [],
  services: [],
  appointments: [],
  customers: [],
  staff: [],
  reminder_logs: [],
  workflows: [],
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
    const stored = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) as Database;
    // Schema migration: ensure new fields exist on old db.json files
    if (!stored.workflows) stored.workflows = [];
    if (!stored.customers) stored.customers = (stored as any).patients || [];
    if (!stored.staff) stored.staff = [];
    if (!stored.reminder_logs) stored.reminder_logs = [];
    return stored;
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
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

    const appointments: Appointment[] = [
      // Today
      { id: uuidv4(), business_id: businessId, service_id: services[0].id, service_name: 'Haircut', staff_id: null, patient_name: 'Priya Sharma', patient_phone: '+919988776655', appointment_date: today, start_time: '10:00', end_time: '10:30', status: 'confirmed', notes: '', deposit_paid: true, deposit_amount: 50, source: 'whatsapp', created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, service_id: services[1].id, service_name: 'Facial', staff_id: null, patient_name: 'Ananya Gupta', patient_phone: '+919977665544', appointment_date: today, start_time: '11:00', end_time: '12:00', status: 'confirmed', notes: 'First time customer', deposit_paid: false, deposit_amount: 100, source: 'manual', created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, service_id: services[0].id, service_name: 'Haircut', staff_id: null, patient_name: 'Rahul Mehta', patient_phone: '+919966554433', appointment_date: today, start_time: '14:00', end_time: '14:30', status: 'cancelled', notes: 'Cancelled via WhatsApp', deposit_paid: false, deposit_amount: 50, source: 'whatsapp', created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, service_id: services[3].id, service_name: 'Manicure', staff_id: null, patient_name: 'Meera Iyer', patient_phone: '+919944332211', appointment_date: today, start_time: '16:00', end_time: '16:45', status: 'completed', notes: 'Happy with service', deposit_paid: true, deposit_amount: 50, source: 'manual', created_at: new Date().toISOString() },
      // Tomorrow
      { id: uuidv4(), business_id: businessId, service_id: services[2].id, service_name: 'Hair Coloring', staff_id: null, patient_name: 'Sneha Patel', patient_phone: '+919955443322', appointment_date: tomorrow, start_time: '10:00', end_time: '12:00', status: 'confirmed', notes: '', deposit_paid: true, deposit_amount: 200, source: 'web', created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, service_id: services[0].id, service_name: 'Haircut', staff_id: null, patient_name: 'Arjun Nair', patient_phone: '+919933221100', appointment_date: tomorrow, start_time: '15:00', end_time: '15:30', status: 'confirmed', notes: 'Wants layers', deposit_paid: false, deposit_amount: 50, source: 'whatsapp', created_at: new Date().toISOString() },
      // Past (for stats)
      { id: uuidv4(), business_id: businessId, service_id: services[1].id, service_name: 'Facial', staff_id: null, patient_name: 'Kavita Reddy', patient_phone: '+919922110099', appointment_date: yesterday, start_time: '11:00', end_time: '12:00', status: 'completed', notes: '', deposit_paid: true, deposit_amount: 100, source: 'manual', created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, service_id: services[0].id, service_name: 'Haircut', staff_id: null, patient_name: 'Deepak Joshi', patient_phone: '+919911009988', appointment_date: twoDaysAgo, start_time: '10:00', end_time: '10:30', status: 'no_show', notes: 'Did not show up', deposit_paid: false, deposit_amount: 50, source: 'whatsapp', created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, service_id: services[3].id, service_name: 'Manicure', staff_id: null, patient_name: 'Fatima Khan', patient_phone: '+919900998877', appointment_date: twoDaysAgo, start_time: '14:00', end_time: '14:45', status: 'completed', notes: 'Loved the nail art', deposit_paid: true, deposit_amount: 50, source: 'web', created_at: new Date().toISOString() },
    ];

    const customers: Customer[] = [
      { id: uuidv4(), business_id: businessId, name: 'Priya Sharma', phone: '+919988776655', email: 'priya@email.com', notes: 'Regular customer, prefers morning slots', visit_count: 5, last_visit: today, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Ananya Gupta', phone: '+919977665544', email: '', notes: 'First visit, referred by Priya', visit_count: 1, last_visit: today, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Rahul Mehta', phone: '+919966554433', email: 'rahul@email.com', notes: 'Cancelled last time, follow up needed', visit_count: 2, last_visit: today, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Sneha Patel', phone: '+919955443322', email: '', notes: 'Loyal customer, books monthly', visit_count: 3, last_visit: tomorrow, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Meera Iyer', phone: '+919944332211', email: 'meera@email.com', notes: 'VIP customer', visit_count: 8, last_visit: today, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Arjun Nair', phone: '+919933221100', email: '', notes: 'New customer from Instagram', visit_count: 1, last_visit: tomorrow, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Kavita Reddy', phone: '+919922110099', email: '', notes: 'Regular, books facials every 2 weeks', visit_count: 4, last_visit: yesterday, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Deepak Joshi', phone: '+919911009988', email: '', notes: 'No-show history, requires confirmation', visit_count: 2, last_visit: twoDaysAgo, created_at: new Date().toISOString() },
      { id: uuidv4(), business_id: businessId, name: 'Fatima Khan', phone: '+919900998877', email: 'fatima@email.com', notes: 'Loves manicures, always on time', visit_count: 6, last_visit: twoDaysAgo, created_at: new Date().toISOString() },
    ];

    // Seed a default Basic Booking workflow
    const defaultWorkflow: Workflow = {
      id: uuidv4(),
      business_id: businessId,
      name: 'Basic Booking',
      template_id: 'basic-booking',
      is_active: true,
      steps: [
        { id: 'step-0', type: 'send_welcome', label: 'Welcome Message', description: 'Greet the customer', enabled: true, config: {} },
        { id: 'step-1', type: 'show_services', label: 'Show Services', description: 'Display available services as a numbered list', enabled: true, config: {} },
        { id: 'step-2', type: 'pick_service', label: 'Pick Service', description: 'Customer selects a service by number', enabled: true, config: {} },
        { id: 'step-3', type: 'pick_date', label: 'Pick Date', description: 'Customer selects from next 7 days', enabled: true, config: { days_ahead: 7 } },
        { id: 'step-4', type: 'pick_time', label: 'Pick Time', description: 'Customer selects from available slots', enabled: true, config: { slots: ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'] } },
        { id: 'step-5', type: 'ask_name', label: 'Ask Name', description: 'Collect customer full name', enabled: true, config: {} },
        { id: 'step-6', type: 'confirm_details', label: 'Confirm Details', description: 'Show summary and ask YES to confirm', enabled: true, config: {} },
        { id: 'step-7', type: 'create_booking', label: 'Create Booking', description: 'Save appointment to database', enabled: true, config: {} },
        { id: 'step-8', type: 'send_confirmation', label: 'Send Confirmation', description: 'Send booking confirmation message', enabled: true, config: {} },
      ],
      bot_personality: {
        tone: 'friendly',
        language: 'english',
        greeting: "👋 Hi! Welcome to {businessName}. I'm your booking assistant.",
        farewell: 'Thank you for booking with us! See you soon. 💚',
        special_notes: '',
        faq: [
          { q: 'What are your working hours?', a: 'We are open 9 AM to 7 PM, Tuesday to Sunday. Monday closed.' },
          { q: 'Do you accept walk-ins?', a: 'Yes, but appointments are preferred to avoid waiting.' },
          { q: 'Can I reschedule my appointment?', a: 'Absolutely! Just reply RESCHEDULE and we will help you find a new slot.' },
        ],
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.businesses.push(business);
    db.services.push(...services);
    db.appointments.push(...appointments);
    db.customers.push(...customers);
    db.workflows.push(defaultWorkflow);
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

export function getBusinessByPhone(phone: string): Business | undefined {
  return getDb().businesses.find(b => b.whatsapp_number === phone || b.phone === phone);
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

export function getCustomersByBusiness(businessId: string): Customer[] {
  return getDb().customers.filter(c => c.business_id === businessId).sort((a, b) => {
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

export function getWorkflowByBusiness(businessId: string): Workflow | undefined {
  return getDb().workflows.find(w => w.business_id === businessId);
}

export function saveWorkflow(workflow: Workflow): void {
  const db = getDb();
  const idx = db.workflows.findIndex(w => w.id === workflow.id);
  if (idx >= 0) {
    db.workflows[idx] = workflow;
  } else {
    db.workflows.push(workflow);
  }
  saveDb(db);
}

export function getDashboardStats(businessId: string) {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  const allAppts = db.appointments.filter(a => a.business_id === businessId);
  const todayAppts = allAppts.filter(a => a.appointment_date === today);
  const weekAppts = allAppts.filter(a => a.appointment_date >= weekAgo);
  const customers = db.customers.filter(c => c.business_id === businessId);
  const noShows = allAppts.filter(a => a.status === 'no_show').length;
  const completed = allAppts.filter(a => a.status === 'completed').length;
  const cancelled = allAppts.filter(a => a.status === 'cancelled').length;

  const totalFinished = completed + noShows + cancelled;
  const noShowRate = totalFinished > 0 ? Math.round((noShows / totalFinished) * 100) : 0;

  return {
    total_appointments_today: todayAppts.length,
    total_appointments_week: weekAppts.length,
    total_customers: customers.length,
    no_show_rate: noShowRate,
    upcoming_appointments: getUpcomingAppointments(businessId, 5),
    recent_customers: customers.slice(0, 5),
  };
}
