'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import { Container } from '@/design-system/primitives';
import { SectionHeader } from '@/components/SectionHeader';
import { testimonials } from '@/content/landing-page';
import TiltCard from '@/components/three/TiltCard';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.testimonial-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { y: 30 },
          {
            y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
            delay: i * 0.1,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-warm-paper relative overflow-hidden">
      <div className="absolute top-10 left-10 font-quote text-[300px] leading-none text-deep-ink/[0.02] select-none pointer-events-none">"</div>

      <Container className="relative z-10">
        <SectionHeader
          overline="Loved by business owners"
          headline="Real stories from real India"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mt-14 lg:mt-16">
          {testimonials.map((t) => (
            <TiltCard key={t.id} className="testimonial-card bg-white rounded-3xl border border-deep-ink/5 shadow-sm relative overflow-hidden group hover:shadow-lg transition-shadow duration-300" glowColor="rgba(232, 93, 4, 0.08)">
            <div className="p-6 lg:p-8">
              <div className="absolute left-0 top-8 bottom-8 w-1 bg-saffron-glow rounded-r-full" />

              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-saffron-glow fill-saffron-glow" />
                ))}
              </div>

              <p className="font-quote text-lg text-deep-ink/80 leading-relaxed mb-8 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${t.bgClass} flex items-center justify-center`}>
                  <span className="font-display font-bold text-deep-ink">{t.initials}</span>
                </div>
                <div>
                  <p className="font-headline font-semibold text-deep-ink text-sm">{t.name}</p>
                  <p className="text-deep-ink/40 font-body text-xs">{t.business}</p>
                </div>
              </div>
            </div>
            </TiltCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
