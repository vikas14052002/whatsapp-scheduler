import { ReactNode } from 'react';

// ─── Spacing Token ───
export type SpaceToken =
  | 'none'
  | 'xs'   // 4px
  | 'sm'   // 8px
  | 'md'   // 16px
  | 'lg'   // 24px
  | 'xl'   // 32px
  | '2xl'  // 48px
  | '3xl'  // 64px
  | '4xl'  // 96px
  | '5xl'; // 128px

// ─── Color Token ───
export type ColorToken =
  | 'deepInk'
  | 'warmPaper'
  | 'sageWhisper'
  | 'saffronGlow'
  | 'saffronDark'
  | 'mutedGold'
  | 'coralBlush'
  | 'whatsapp'
  | 'whatsappDark'
  | 'white'
  | 'black'
  | 'transparent';

// ─── Font Token ───
export type FontToken = 'display' | 'headline' | 'body' | 'quote' | 'mono';

// ─── Size Token ───
export type SizeToken =
  | 'xs'    // 12px
  | 'sm'    // 14px
  | 'base'  // 16px
  | 'lg'    // 18px
  | 'xl'    // 20px
  | '2xl'   // 24px
  | '3xl'   // 30px
  | '4xl'   // 36px
  | '5xl'   // 48px
  | '6xl'   // 60px
  | '7xl';  // 72px

// ─── Weight Token ───
export type WeightToken = 'normal' | 'medium' | 'semibold' | 'bold';

// ─── Radius Token ───
export type RadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

// ─── Shadow Token ───
export type ShadowToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'glow';

// ─── Responsive Value ───
export type Responsive<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T };

// ─── Animation Easing ───
export type EasingToken =
  | 'easeOut'
  | 'easeInOut'
  | 'spring'
  | 'bounce'
  | 'power2.out'
  | 'power3.out'
  | 'power4.out';

// ─── Base Primitive Props ───
export interface PrimitiveProps {
  children?: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// ─── Section Data Types ───
export interface HeroContent {
  badge: { text: string; icon: string };
  headline: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  footnote: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  isDecimal?: boolean;
}

export interface BusinessType {
  id: string;
  icon: string;
  title: string;
  description: string;
  gradient: string;
  accentColor: string;
  emoji: string;
}

export interface Step {
  number: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  previewMessage: string;
  previewCaption: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  business: string;
  rating: number;
  initials: string;
  bgClass: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  ctaLabel: string;
  popular: boolean;
}
