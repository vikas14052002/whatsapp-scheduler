// ─── BookKar Configuration ───
// Central place for business-type-specific labels, constants, and terminology.
// Change these to rebrand the app for any service industry.

export type BusinessCategory =
  | 'salon'
  | 'clinic'
  | 'tuition'
  | 'consultant'
  | 'spa'
  | 'gym'
  | 'studio'
  | 'repair'
  | 'other';

export interface BusinessTypeConfig {
  id: BusinessCategory;
  label: string;
  labelPlural: string;
  icon: string; // lucide icon name
  description: string;
  exampleServices: string[];
}

export const BUSINESS_TYPES: BusinessTypeConfig[] = [
  {
    id: 'salon',
    label: 'Salon',
    labelPlural: 'Salons',
    icon: 'Scissors',
    description: 'Hair, beauty, and grooming services',
    exampleServices: ['Haircut', 'Facial', 'Hair Colour', 'Manicure'],
  },
  {
    id: 'clinic',
    label: 'Clinic',
    labelPlural: 'Clinics',
    icon: 'Stethoscope',
    description: 'Medical, dental, and health consultations',
    exampleServices: ['General Checkup', 'Dental Cleaning', 'Consultation', 'Vaccination'],
  },
  {
    id: 'tuition',
    label: 'Tuition Centre',
    labelPlural: 'Tuition Centres',
    icon: 'BookOpen',
    description: 'Coaching classes and tutoring',
    exampleServices: ['Math Class', 'Science Class', 'Mock Test', 'Doubt Session'],
  },
  {
    id: 'consultant',
    label: 'Consultant',
    labelPlural: 'Consultants',
    icon: 'Briefcase',
    description: 'Professional advisory and consulting',
    exampleServices: ['Strategy Session', 'Audit', 'Review Meeting', 'Workshop'],
  },
  {
    id: 'spa',
    label: 'Spa & Wellness',
    labelPlural: 'Spas',
    icon: 'Flower2',
    description: 'Massage, therapy, and relaxation',
    exampleServices: ['Full Body Massage', 'Aromatherapy', 'Steam Bath', 'Pedicure'],
  },
  {
    id: 'gym',
    label: 'Gym & Fitness',
    labelPlural: 'Gyms',
    icon: 'Dumbbell',
    description: 'Personal training and fitness classes',
    exampleServices: ['Personal Training', 'Yoga Class', 'Zumba', 'Nutrition Consult'],
  },
  {
    id: 'studio',
    label: 'Studio',
    labelPlural: 'Studios',
    icon: 'Camera',
    description: 'Photography, recording, and creative spaces',
    exampleServices: ['Photo Shoot', 'Video Recording', 'Podcast Room', 'Edit Session'],
  },
  {
    id: 'repair',
    label: 'Repair Shop',
    labelPlural: 'Repair Shops',
    icon: 'Wrench',
    description: 'Gadget, vehicle, and appliance repairs',
    exampleServices: ['Screen Replacement', 'Battery Service', 'Diagnostics', 'Software Fix'],
  },
  {
    id: 'other',
    label: 'Other Business',
    labelPlural: 'Other Businesses',
    icon: 'Store',
    description: 'Any service that takes appointments',
    exampleServices: ['Service A', 'Service B', 'Service C', 'Service D'],
  },
];

export const BUSINESS_TYPE_MAP = Object.fromEntries(
  BUSINESS_TYPES.map((t) => [t.id, t])
) as Record<BusinessCategory, BusinessTypeConfig>;

// ─── Terminology Labels ───
// These control every UI label. Swap "Customer" for "Client", "Patient", "Student", etc.
export const LABELS = {
  // People who book appointments
  customer: 'Customer',
  customerPlural: 'Customers',
  customerLower: 'customer',
  customersLower: 'customers',

  // What you sell (services, classes, sessions, treatments)
  service: 'Service',
  servicePlural: 'Services',
  serviceLower: 'service',
  servicesLower: 'services',

  // The booking itself
  appointment: 'Appointment',
  appointmentPlural: 'Appointments',
  appointmentLower: 'appointment',
  appointmentsLower: 'appointments',

  // Booking synonyms
  booking: 'Booking',
  bookingPlural: 'Bookings',

  // Staff / provider
  staff: 'Staff',
  staffMember: 'Staff Member',

  // Deposit / advance
  deposit: 'Deposit',
  depositLower: 'deposit',

  // Misc
  calendar: 'Calendar',
  schedule: 'Schedule',
  today: 'Today',
  upcoming: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled',
  noShow: 'No-Show',
} as const;

// ─── App Meta ───
export const APP_CONFIG = {
  name: 'BookKar',
  tagline: 'WhatsApp Appointment Scheduler for Indian Businesses',
  description:
    'Let your customers book appointments directly on WhatsApp. No app downloads, no website forms.',
  priceMonthly: 399,
  currency: '₹',
  supportPhone: '+91 98765 43210',
  supportEmail: 'hello@bookkar.in',
  demoEmail: 'demo@glowsalon.in',
  demoPassword: 'demo',
} as const;

// ─── Demo Data ───
export const DEMO_BUSINESS = {
  id: 'demo-biz-001',
  name: 'Glow Studio',
  type: 'salon' as BusinessCategory,
  email: APP_CONFIG.demoEmail,
  phone: '+919876543210',
  whatsapp_number: '+919876543210',
} as const;
