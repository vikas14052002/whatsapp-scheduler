-- BookKar Database Schema
-- Run this in Supabase SQL Editor

-- Businesses
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('salon', 'clinic', 'tuition', 'consultant', 'spa', 'other')),
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  address TEXT,
  whatsapp_number TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price INTEGER NOT NULL DEFAULT 0,
  deposit_amount INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Patients (Customers)
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  visit_count INTEGER NOT NULL DEFAULT 0,
  last_visit DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_id, phone)
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  service_name TEXT,
  staff_id UUID,
  staff_name TEXT,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  notes TEXT,
  deposit_paid BOOLEAN NOT NULL DEFAULT false,
  deposit_amount INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('whatsapp', 'manual', 'web')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Staff
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Reminder Logs
CREATE TABLE reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('24hr', '1hr', 'confirmation', 'followup')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'delivered'))
);

-- Indexes for performance
CREATE INDEX idx_services_business ON services(business_id);
CREATE INDEX idx_services_active ON services(business_id, is_active);
CREATE INDEX idx_patients_business ON patients(business_id);
CREATE INDEX idx_patients_phone ON patients(business_id, phone);
CREATE INDEX idx_appointments_business ON appointments(business_id);
CREATE INDEX idx_appointments_date ON appointments(business_id, appointment_date);
CREATE INDEX idx_appointments_status ON appointments(business_id, status);
CREATE INDEX idx_reminders_appointment ON reminder_logs(appointment_id);

-- Workflows
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  steps JSONB NOT NULL DEFAULT '[]',
  bot_personality JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workflows_business ON workflows(business_id);

ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workflows_isolation" ON workflows
  FOR ALL USING (business_id = current_setting('app.business_id')::UUID);

-- Row Level Security (RLS) policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own business data
CREATE POLICY "businesses_isolation" ON businesses
  FOR ALL USING (id = current_setting('app.business_id')::UUID);

CREATE POLICY "services_isolation" ON services
  FOR ALL USING (business_id = current_setting('app.business_id')::UUID);

CREATE POLICY "patients_isolation" ON patients
  FOR ALL USING (business_id = current_setting('app.business_id')::UUID);

CREATE POLICY "appointments_isolation" ON appointments
  FOR ALL USING (business_id = current_setting('app.business_id')::UUID);

CREATE POLICY "staff_isolation" ON staff
  FOR ALL USING (business_id = current_setting('app.business_id')::UUID);
