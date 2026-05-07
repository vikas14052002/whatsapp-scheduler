'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Sparkles } from 'lucide-react';
import { Container, Button } from '@/design-system/primitives';
import { SectionHeader } from '@/components/SectionHeader';
import { pricingPlans } from '@/content/landing-page';
import TiltCard from '@/components/three/TiltCard';
import Counter from '@/components/Counter';
import { useScrollReveal } from '@/design-system/hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export default function PricingSection() {
  const router = useRouter();
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const footnoteRef = useScrollReveal<HTMLParagraphElement>({ delay: 0.2 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 30 },
          {
            y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
            delay: i * 0.12,
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-sage-whisper/30 relative overflow-hidden">
      <Container className="relative z-10">
        <SectionHeader
          overline="Simple pricing"
          headline="Pay less than one no-show costs you"
          subheadline="Flat monthly fee. No commission on bookings. No hidden charges."
        />

        <div className="grid md:grid-cols-3 gap-5 lg:gap-8 max-w-5xl mx-auto items-start mt-14 lg:mt-16 px-4 sm:px-0">
          {pricingPlans.map((plan, i) => (
            <TiltCard key={plan.id} className={`relative rounded-3xl transition-all duration-300 ${
              plan.popular
                ? 'bg-white border-2 border-saffron-glow/20 shadow-xl lg:scale-105 z-10'
                : 'bg-white/70 border border-deep-ink/5 shadow-sm hover:shadow-md'
            }`} glowColor={plan.popular ? 'rgba(232, 93, 4, 0.2)' : 'rgba(15, 15, 18, 0.06)'}>
            <div ref={(el) => { cardsRef.current[i] = el; }} className="p-6 lg:p-8">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-saffron-glow text-white px-4 py-1.5 rounded-full text-sm font-body font-semibold flex items-center gap-1.5 shadow-lg">
                    <Sparkles size={14} />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-headline text-xl font-semibold text-deep-ink mb-2">{plan.name}</h3>
                <p className="text-sm text-deep-ink/50 font-body">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-deep-ink/40 font-body text-lg">₹</span>
                  <span className="font-display text-5xl font-bold text-deep-ink">
                    <Counter end={plan.price} />
                  </span>
                  <span className="text-deep-ink/40 font-body">/mo</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-saffron-glow/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-saffron-glow" />
                    </div>
                    <span className="text-sm text-deep-ink/70 font-body">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'ghost'}
                className={`w-full py-3.5 rounded-xl font-body font-semibold ${
                  plan.popular ? 'shadow-lg shadow-saffron-glow/20' : 'bg-deep-ink/5 text-deep-ink hover:bg-deep-ink hover:text-white'
                }`}
                onClick={() => router.push('/login?tab=register')}
              >
                {plan.ctaLabel}
              </Button>
            </div>
            </TiltCard>
          ))}
        </div>

        <p ref={footnoteRef} className="text-center text-sm text-deep-ink/40 font-body mt-10">
          All plans include 14-day free trial. No credit card required.
        </p>
      </Container>
    </section>
  );
}
