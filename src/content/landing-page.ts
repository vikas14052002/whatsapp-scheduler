/**
 * ┌─────────────────────────────────────────┐
 * │  LANDING PAGE CONTENT                   │
 * │  Data-driven content configuration      │
 * └─────────────────────────────────────────┘
 */

import { HeroContent, StatItem, BusinessType, Step, Testimonial, PricingPlan } from '@/types/design-system';

export const heroContent: HeroContent = {
  badge: {
    text: 'Powered by WhatsApp Business API',
    icon: 'whatsapp',
  },
  headline: 'Your customers book on WhatsApp.',
  subheadline:
    'BookKar lets salons, clinics, and service businesses take appointments entirely inside WhatsApp. No apps. No websites. Just a message.',
  primaryCta: {
    label: 'Start Free Trial',
    href: '/login?tab=register',
  },
  secondaryCta: {
    label: 'View Demo Dashboard',
    href: '/login',
  },
  footnote: 'No credit card required • Setup in 5 minutes • Made for India',
};

export const stats: StatItem[] = [
  { value: 500, suffix: '+', label: 'Businesses onboarded' },
  { value: 50, suffix: 'K+', label: 'Appointments booked' },
  { value: 94, suffix: '%', label: 'No-show reduction' },
  { value: 4.9, suffix: '/5', label: 'Average rating', isDecimal: true },
];

export const steps: Step[] = [
  {
    number: '01',
    icon: 'MessageSquare',
    title: 'Customer sends "Hi"',
    description:
      'Your customer messages your WhatsApp number. No app download needed. They already know how to use it.',
    color: 'bg-whatsapp/10 text-whatsapp',
    previewMessage: '👋 Hi, I want to book a haircut',
    previewCaption: 'Customer initiates conversation',
  },
  {
    number: '02',
    icon: 'Calendar',
    title: 'They pick a slot',
    description:
      'Your booking bot shows available services, dates, and time slots — all inside the chat. One tap to select.',
    color: 'bg-saffron-glow/10 text-saffron-glow',
    previewMessage: '📅 Showing 3 slots for tomorrow...',
    previewCaption: 'Bot presents available options',
  },
  {
    number: '03',
    icon: 'IndianRupee',
    title: 'Pay deposit via UPI',
    description:
      'Collect a small deposit through UPI to confirm the booking. Reduces fake bookings by 80%.',
    color: 'bg-muted-gold/20 text-muted-gold',
    previewMessage: '💰 Deposit ₹50 paid via UPI',
    previewCaption: 'Secure payment via Razorpay',
  },
  {
    number: '04',
    icon: 'Bell',
    title: 'Auto reminders sent',
    description:
      '24-hour and 1-hour reminders automatically sent via WhatsApp. No-shows drop by up to 40%.',
    color: 'bg-coral-blush/20 text-coral-blush',
    previewMessage: '⏰ Reminder: Appointment in 1 hour',
    previewCaption: 'Automated WhatsApp reminder',
  },
];

export const businessTypes: BusinessType[] = [
  {
    id: 'salon',
    icon: 'Scissors',
    title: 'Salons & Spas',
    description: 'Haircuts, facials, bridal makeup — manage every chair efficiently.',
    gradient: 'from-saffron-glow/20 to-coral-blush/10',
    accentColor: 'bg-saffron-glow',
    emoji: '🪞',
  },
  {
    id: 'clinic',
    icon: 'Stethoscope',
    title: 'Clinics & Doctors',
    description: 'Dental, dermatology, homeopathy — keep your schedule full.',
    gradient: 'from-whatsapp/10 to-sage-whisper/30',
    accentColor: 'bg-whatsapp',
    emoji: '🩺',
  },
  {
    id: 'tuition',
    icon: 'GraduationCap',
    title: 'Tuition & Coaching',
    description: 'Math classes, entrance prep, music lessons — organize batches.',
    gradient: 'from-muted-gold/20 to-coral-blush/10',
    accentColor: 'bg-muted-gold',
    emoji: '📚',
  },
  {
    id: 'consultant',
    icon: 'Briefcase',
    title: 'Consultants',
    description: 'Tax advisors, astrologers, designers — book consultations.',
    gradient: 'from-deep-ink/10 to-muted-gold/10',
    accentColor: 'bg-deep-ink',
    emoji: '💼',
  },
  {
    id: 'wellness',
    icon: 'Heart',
    title: 'Wellness Centers',
    description: 'Yoga studios, physiotherapy, meditation — calm scheduling.',
    gradient: 'from-coral-blush/20 to-saffron-glow/10',
    accentColor: 'bg-coral-blush',
    emoji: '🧘',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "Before BookKar, I spent 2 hours every morning just replying to WhatsApp messages. Now my customers book themselves. I just check my dashboard.",
    name: 'Priya Sharma',
    business: 'Glow Beauty Salon, Mumbai',
    rating: 5,
    initials: 'PS',
    bgClass: 'bg-saffron-glow/10',
  },
  {
    id: '2',
    quote:
      "No-shows used to kill my revenue. With deposit collection and auto-reminders, I've gone from 30% no-shows to under 5%.",
    name: 'Dr. Rahul Mehta',
    business: 'City Dental Care, Delhi',
    rating: 5,
    initials: 'RM',
    bgClass: 'bg-whatsapp/10',
  },
  {
    id: '3',
    quote:
      "My tuition students' parents love booking via WhatsApp. No more 'Is tomorrow class on?' messages at 11 PM.",
    name: 'Ananya Gupta',
    business: 'Excel Coaching Center, Bangalore',
    rating: 5,
    initials: 'AG',
    bgClass: 'bg-muted-gold/15',
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 399,
    description: 'Perfect for solo practitioners just getting started.',
    features: [
      'Up to 100 appointments/month',
      'WhatsApp booking bot',
      'Auto reminders (24hr + 1hr)',
      '1 staff member',
      'Basic dashboard',
      'Email support',
    ],
    ctaLabel: 'Get Started',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 799,
    description: 'For growing businesses with multiple staff.',
    features: [
      'Unlimited appointments',
      'WhatsApp + SMS reminders',
      'UPI deposit collection',
      'Up to 5 staff members',
      'Customer database',
      'Basic analytics',
      'Priority support',
    ],
    ctaLabel: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1499,
    description: 'For chains and businesses scaling fast.',
    features: [
      'Everything in Growth',
      'Multi-location support',
      'Unlimited staff',
      'Advanced analytics',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
    ],
    ctaLabel: 'Contact Sales',
    popular: false,
  },
];

export const navLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For Business', href: '#businesses' },
  { label: 'Pricing', href: '#pricing' },
];

export const footerLinks = {
  Product: ['Features', 'Pricing', 'WhatsApp Bot', 'Integrations', 'API'],
  Business: ['For Salons', 'For Clinics', 'For Tuition', 'For Consultants', 'For Spas'],
  Company: ['About', 'Blog', 'Careers', 'Press Kit', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'GDPR', 'Security'],
};
