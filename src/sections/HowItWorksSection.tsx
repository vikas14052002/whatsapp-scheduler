'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/design-system/primitives';
import { SectionHeader } from '@/components/SectionHeader';
import { steps } from '@/content/landing-page';
import { Icon } from '@/components/Icon';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksSection() {
  const lineRef = useRef<SVGPathElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const length = line.getTotalLength();
    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: line.parentElement, start: 'top 70%', end: 'bottom 50%', scrub: 1 },
      });

      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        gsap.fromTo(step,
          { y: 30 },
          {
            y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 88%', toggleActions: 'play none none none' },
            delay: i * 0.08,
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-warm-paper relative overflow-hidden">
      <Container>
        <SectionHeader
          overline="How it works"
          headline="Booking in 4 simple messages"
        />

        <div className="relative max-w-3xl mx-auto mt-16 lg:mt-20">
          <svg className="absolute left-8 lg:left-1/2 lg:-translate-x-px top-0 h-full w-2 hidden md:block" preserveAspectRatio="none">
            <path ref={lineRef} d="M1 0 V 1000" stroke="url(#lineGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E85D04" />
                <stop offset="100%" stopColor="#25D366" />
              </linearGradient>
            </defs>
          </svg>

          <div className="space-y-14 lg:space-y-20">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={step.number}
                  ref={(el) => { stepsRef.current[i] = el; }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-8 lg:left-1/2 lg:-translate-x-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-deep-ink text-white flex items-center justify-center font-display font-bold text-sm z-10 hidden md:flex">
                    {step.number}
                  </div>

                  <div className={`flex-1 ${isEven ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${step.color} mb-4`}>
                      <Icon name={step.icon} size={18} />
                      <span className="text-sm font-body font-medium md:hidden">Step {step.number}</span>
                    </div>
                    <h3 className="font-headline text-2xl lg:text-3xl font-semibold text-deep-ink mb-3">{step.title}</h3>
                    <p className="text-deep-ink/60 font-body leading-relaxed max-w-md">{step.description}</p>
                  </div>

                  <div className="flex-1 w-full">
                    <div className="bg-white rounded-2xl p-6 border border-deep-ink/5 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon name={step.icon} size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="bg-sage-whisper rounded-lg p-3 mb-2">
                            <p className="text-sm text-deep-ink/70 font-body">{step.previewMessage}</p>
                          </div>
                          <p className="text-xs text-deep-ink/40 font-body">{step.previewCaption}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
