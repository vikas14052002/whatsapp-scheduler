-- Seed data for BookKar demo
-- Run after schema.sql

INSERT INTO businesses (id, name, type, phone, email, address, whatsapp_number, timezone, is_active)
VALUES (
  'demo-biz-001',
  'Glow Studio',
  'salon',
  '+91 98765 43210',
  'demo@glowsalon.in',
  '123 Main Street, Mumbai',
  '+91 98765 43210',
  'Asia/Kolkata',
  true
);

INSERT INTO services (id, business_id, name, description, duration_minutes, price, deposit_amount, is_active)
VALUES
  ('svc-001', 'demo-biz-001', 'Haircut', 'Standard haircut with styling', 30, 300, 50, true),
  ('svc-002', 'demo-biz-001', 'Facial', 'Deep cleansing facial treatment', 60, 800, 100, true),
  ('svc-003', 'demo-biz-001', 'Hair Coloring', 'Full hair colour with ammonia-free products', 120, 1500, 200, true),
  ('svc-004', 'demo-biz-001', 'Manicure', 'Nail care, cuticle work and polish', 45, 400, 50, true);

INSERT INTO patients (id, business_id, name, phone, email, notes, visit_count, last_visit)
VALUES
  ('cust-001', 'demo-biz-001', 'Priya Sharma', '+919988776655', 'priya@email.com', 'Regular customer, prefers morning slots', 5, '2026-05-08'),
  ('cust-002', 'demo-biz-001', 'Ananya Gupta', '+919977665544', '', 'First visit, referred by Priya', 1, '2026-05-08'),
  ('cust-003', 'demo-biz-001', 'Rahul Mehta', '+919966554433', 'rahul@email.com', 'Cancelled last time, follow up needed', 2, '2026-05-08'),
  ('cust-004', 'demo-biz-001', 'Sneha Patel', '+919955443322', '', 'Loyal customer, books monthly', 3, '2026-05-09'),
  ('cust-005', 'demo-biz-001', 'Meera Iyer', '+919944332211', 'meera@email.com', 'VIP customer', 8, '2026-05-08'),
  ('cust-006', 'demo-biz-001', 'Arjun Nair', '+919933221100', '', 'New customer from Instagram', 1, '2026-05-09'),
  ('cust-007', 'demo-biz-001', 'Kavita Reddy', '+919922110099', '', 'Regular, books facials every 2 weeks', 4, '2026-05-07'),
  ('cust-008', 'demo-biz-001', 'Deepak Joshi', '+919911009988', '', 'No-show history, requires confirmation', 2, '2026-05-06'),
  ('cust-009', 'demo-biz-001', 'Fatima Khan', '+919900998877', 'fatima@email.com', 'Loves manicures, always on time', 6, '2026-05-06');

INSERT INTO appointments (id, business_id, service_id, service_name, patient_name, patient_phone, appointment_date, start_time, end_time, status, notes, deposit_paid, deposit_amount, source)
VALUES
  -- Today
  ('apt-001', 'demo-biz-001', 'svc-001', 'Haircut', 'Priya Sharma', '+919988776655', '2026-05-08', '10:00', '10:30', 'confirmed', '', true, 50, 'whatsapp'),
  ('apt-002', 'demo-biz-001', 'svc-002', 'Facial', 'Ananya Gupta', '+919977665544', '2026-05-08', '11:00', '12:00', 'confirmed', 'First time customer', false, 100, 'manual'),
  ('apt-003', 'demo-biz-001', 'svc-001', 'Haircut', 'Rahul Mehta', '+919966554433', '2026-05-08', '14:00', '14:30', 'cancelled', 'Cancelled via WhatsApp', false, 50, 'whatsapp'),
  ('apt-004', 'demo-biz-001', 'svc-004', 'Manicure', 'Meera Iyer', '+919944332211', '2026-05-08', '16:00', '16:45', 'completed', 'Happy with service', true, 50, 'manual'),
  -- Tomorrow
  ('apt-005', 'demo-biz-001', 'svc-003', 'Hair Coloring', 'Sneha Patel', '+919955443322', '2026-05-09', '10:00', '12:00', 'confirmed', '', true, 200, 'web'),
  ('apt-006', 'demo-biz-001', 'svc-001', 'Haircut', 'Arjun Nair', '+919933221100', '2026-05-09', '15:00', '15:30', 'confirmed', 'Wants layers', false, 50, 'whatsapp'),
  -- Past (for stats)
  ('apt-007', 'demo-biz-001', 'svc-002', 'Facial', 'Kavita Reddy', '+919922110099', '2026-05-07', '11:00', '12:00', 'completed', '', true, 100, 'manual'),
  ('apt-008', 'demo-biz-001', 'svc-001', 'Haircut', 'Deepak Joshi', '+919911009988', '2026-05-06', '10:00', '10:30', 'no_show', 'Did not show up', false, 50, 'whatsapp'),
  ('apt-009', 'demo-biz-001', 'svc-004', 'Manicure', 'Fatima Khan', '+919900998877', '2026-05-06', '14:00', '14:45', 'completed', 'Loved the nail art', true, 50, 'web');
