'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/design-system/primitives';
import { SectionHeader } from '@/components/SectionHeader';
import { businessTypes } from '@/content/landing-page';
import { Icon } from '@/components/Icon';
import TiltCard from '@/components/three/TiltCard';

gsap.registerPlugin(ScrollTrigger);

export default function BusinessTypesSection() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 30, rotation: i % 2 === 0 ? -1 : 1 },
          {
            y: 0, rotation: 0,
            duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
            delay: i * 0.06,
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="businesses" className="py-20 lg:py-28 bg-sage-whisper/50 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-saffron-glow/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-muted-gold/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeader
          overline="For every business"
          headline="One tool. Every profession."
          subheadline="Whether you run a salon or a clinic, BookKar adapts to your workflow."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mt-14 lg:mt-16">
          {businessTypes.map((biz, i) => (
            <TiltCard key={biz.id} className="group relative bg-white rounded-2xl border border-deep-ink/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden" glowColor="rgba(232, 93, 4, 0.12)">
            <div ref={(el) => { cardsRef.current[i] = el; }} className="p-6 lg:p-8">
              <div className={`absolute inset-0 bg-gradient-to-br ${biz.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-xl ${biz.accentColor} bg-opacity-10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={biz.icon} size={28} className={biz.accentColor === 'bg-deep-ink' ? 'text-deep-ink' : undefined} />
                </div>
                <h3 className="font-headline text-xl font-semibold text-deep-ink mb-2">{biz.title}</h3>
                <p className="text-deep-ink/50 font-body text-sm leading-relaxed mb-4">{biz.description}</p>
                <div className="flex items-center gap-2 text-saffron-glow font-body text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span><span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${biz.accentColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </div>
            </TiltCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
