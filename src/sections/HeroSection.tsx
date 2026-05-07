'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MessageCircle, Check } from 'lucide-react';
import { Button, Container } from '@/design-system/primitives';
import CharacterReveal from '@/components/CharacterReveal';
import dynamic from 'next/dynamic';
const ParticleField = dynamic(() => import('@/components/three/ParticleField'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  'No credit card required',
  'Setup in 5 minutes',
  'Made for India',
  'Free WhatsApp bot included',
];

export default function HeroSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const orb = orbRef.current;
    const phone = phoneRef.current;
    if (!section || !content || !orb || !phone) return;

    const ctx = gsap.context(() => {
      gsap.to(orb, { y: -100, x: 50, scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to(content, { y: -60, opacity: 0.3, scale: 0.95, scrollTrigger: { trigger: section, start: 'center top', end: 'bottom top', scrub: 1 } });
      gsap.to(phone, { y: -120, scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.8 } });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex items-center bg-deep-ink">
      <ParticleField />

      {/* Background orbs */}
      <div ref={orbRef} className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full opacity-20 will-change-transform pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(232,93,4,0.4) 0%, rgba(45,27,78,0.2) 50%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-15 will-change-transform pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.3) 0%, transparent 60%)', filter: 'blur(100px)' }} />

      <Container className="relative z-10 py-20 lg:py-28">
        <div ref={contentRef} className="flex flex-col items-center text-center">
          {/* Social proof stat */}
          <p className="text-sm text-white/50 font-body mb-6 opacity-0 animate-[fadeIn_0.6s_ease_0.2s_forwards]">
            Trusted by <span className="text-white font-semibold">500+</span> Indian businesses
          </p>

          {/* Headline with italic emphasis */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-white leading-[1.1] tracking-tight mb-6 max-w-4xl">
            <CharacterReveal text="Your customers book on" tag="span" className="" delay={0.2} stagger={0.012} />
            <br />
            <CharacterReveal text="WhatsApp." tag="span" className="italic font-quote text-saffron-glow" delay={0.4} stagger={0.015} />
          </h1>

          {/* Subheadline */}
          <p className="text-lg lg:text-xl text-white/60 font-body max-w-2xl mb-8 leading-relaxed opacity-0 animate-[fadeIn_0.8s_ease_0.6s_forwards]">
            BookKar lets salons, clinics, and service businesses take appointments entirely inside WhatsApp. No apps. No websites. Just a message.
          </p>

          {/* Benefit checklist */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10 opacity-0 animate-[fadeIn_0.8s_ease_0.7s_forwards]">
            {benefits.map((b) => (
              <span key={b} className="inline-flex items-center gap-2 text-sm text-white/50 font-body">
                <span className="w-5 h-5 rounded-full bg-muted-gold/20 flex items-center justify-center">
                  <Check size={12} className="text-muted-gold" />
                </span>
                {b}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 opacity-0 animate-[fadeIn_0.8s_ease_0.8s_forwards]">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/login?tab=register')}
              rightIcon={<ArrowRight size={18} />}
              className="rounded-full px-10 shadow-xl shadow-saffron-glow/30 hover:shadow-saffron-glow/50 hover:-translate-y-0.5"
            >
              Start Free Trial
            </Button>
            <button
              onClick={() => router.push('/login')}
              className="text-white/50 hover:text-white font-body text-sm transition-colors duration-200 hover:underline underline-offset-4"
            >
              View Demo Dashboard →
            </button>
          </div>

          {/* Phone mockup */}
          <div ref={phoneRef} className="relative w-full max-w-sm mx-auto will-change-transform">
            <div className="absolute inset-0 bg-gradient-to-br from-saffron-glow/10 to-whatsapp/5 rounded-3xl blur-3xl" />

            <div className="relative z-10 bg-[#1a1a1a] rounded-[40px] p-3 shadow-2xl border border-white/10 mx-auto"
              style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(37,211,102,0.1)', maxWidth: '300px' }}>
              <div className="bg-[#0b141a] rounded-[32px] overflow-hidden w-full aspect-[9/19] relative">
                {/* WhatsApp Header */}
                <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted-gold/30 flex items-center justify-center">
                    <span className="text-xs text-white/80">GS</span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Glow Salon</p>
                    <p className="text-xs text-white/50">online</p>
                  </div>
                </div>

                {/* Chat */}
                <div className="p-3 space-y-3 overflow-hidden">
                  <div className="flex justify-center">
                    <span className="text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded">Today</span>
                  </div>
                  <div className="bg-[#005c4b] text-white text-sm p-3 rounded-lg rounded-tr-sm max-w-[85%] ml-auto">
                    👋 Hi! I&apos;d like to book a haircut for tomorrow
                  </div>
                  <div className="bg-[#202c33] text-white/90 text-sm p-3 rounded-lg rounded-tl-sm max-w-[90%]">
                    <p className="mb-2">Sure! Please pick a time slot:</p>
                    <div className="space-y-1.5">
                      <div className="bg-white/5 rounded px-3 py-2 text-center text-sm">10:00 AM</div>
                      <div className="bg-white/5 rounded px-3 py-2 text-center text-sm">11:30 AM</div>
                      <div className="bg-saffron-glow/80 rounded px-3 py-2 text-center text-sm">2:00 PM ✅</div>
                    </div>
                  </div>
                  <div className="bg-[#005c4b] text-white text-sm p-3 rounded-lg rounded-tr-sm max-w-[85%] ml-auto">
                    2:00 PM works perfectly!
                  </div>
                  <div className="bg-[#202c33] text-white/90 text-sm p-3 rounded-lg rounded-tl-sm max-w-[90%]">
                    ✅ Booked! See you tomorrow at 2:00 PM
                  </div>
                </div>

                {/* Input */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#1f2c34] px-3 py-2 flex items-center gap-2">
                  <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-sm text-white/40">Type a message...</div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-4 -left-8 bg-white rounded-2xl p-4 shadow-xl border border-black/5 animate-float z-30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle size={18} className="text-whatsapp" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-deep-ink">New Booking</p>
                  <p className="text-xs text-deep-ink/50">Priya Sharma • 2:00 PM</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-black/5 animate-float z-30" style={{ animationDelay: '1s' }}>
              <p className="text-2xl font-display font-bold text-saffron-glow">94%</p>
              <p className="text-xs text-deep-ink/50">Fewer no-shows</p>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-paper to-transparent z-20 pointer-events-none" />
    </section>
  );
}
