'use client';

import { useLenis } from '@/hooks/useLenis';
import ScrollProgress from '@/components/ScrollProgress';
import Navbar from '@/components/Navbar';
import HeroSection from '@/sections/HeroSection';
import SocialProofSection from '@/sections/SocialProofSection';
import HowItWorksSection from '@/sections/HowItWorksSection';
import BusinessTypesSection from '@/sections/BusinessTypesSection';
import TestimonialsSection from '@/sections/TestimonialsSection';
import PricingSection from '@/sections/PricingSection';
import CTASection from '@/sections/CTASection';
import FooterSection from '@/sections/FooterSection';

export default function LandingPage() {
  useLenis();

  return (
    <main className="relative">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <SocialProofSection />
      <HowItWorksSection />
      <BusinessTypesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
