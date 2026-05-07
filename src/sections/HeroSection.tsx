'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button, Container } from '@/design-system/primitives';
import { heroContent } from '@/content/landing-page';
import CharacterReveal from '@/components/CharacterReveal';
import dynamic from 'next/dynamic';
const ParticleField = dynamic(() => import('@/components/three/ParticleField'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const image = imageRef.current;
    const orb = orbRef.current;
    const phone = phoneRef.current;
    if (!section || !content || !image || !orb || !phone) return;

    const ctx = gsap.context(() => {
      gsap.to(orb, { y: -100, x: 50, scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to(content, { y: -60, opacity: 0.3, scale: 0.95, scrollTrigger: { trigger: section, start: 'center top', end: 'bottom top', scrub: 1 } });
      gsap.to(image, { scale: 1.05, scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1 } });
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

      <Container className="relative z-10 py-24 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[100dvh]">
          {/* Left: Content */}
          <div ref={contentRef} className="pt-16 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-whatsapp animate-pulse" />
              <span className="text-sm text-white/70 font-body">{heroContent.badge.text}</span>
            </div>

            <CharacterReveal text={heroContent.headline} tag="h1"
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-white leading-[1.1] tracking-tight mb-6"
              delay={0.2} stagger={0.012} />

            <p className="text-lg lg:text-xl text-white/60 font-body max-w-lg mb-10 leading-relaxed opacity-0 animate-[fadeIn_0.8s_ease_0.6s_forwards]">
              {heroContent.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-[fadeIn_0.8s_ease_0.8s_forwards]">
              <Button variant="primary" size="lg" onClick={() => router.push(heroContent.primaryCta.href)} rightIcon={<ArrowRight size={18} />}>
                {heroContent.primaryCta.label}
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/30"
                onClick={() => router.push(heroContent.secondaryCta.href)}>
                {heroContent.secondaryCta.label}
              </Button>
            </div>

            <p className="text-sm text-white/40 mt-6 font-body opacity-0 animate-[fadeIn_0.8s_ease_1s_forwards]">
              {heroContent.footnote}
            </p>
          </div>

          {/* Right: Phone Mockup */}
          <div ref={imageRef} className="relative hidden lg:flex items-center justify-center will-change-transform">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-saffron-glow/10 to-whatsapp/5 rounded-3xl blur-3xl" />

              <div ref={phoneRef} className="relative z-10 bg-[#1a1a1a] rounded-[40px] p-3 shadow-2xl border border-white/10 will-change-transform mx-auto"
                style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(37,211,102,0.1)', maxWidth: '320px' }}>
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
              <div className="absolute -bottom-2 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-black/5 animate-float z-30">
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

              <div className="absolute -top-2 -right-2 bg-white rounded-2xl p-4 shadow-xl border border-black/5 animate-float z-30" style={{ animationDelay: '1s' }}>
                <p className="text-2xl font-display font-bold text-saffron-glow">94%</p>
                <p className="text-xs text-deep-ink/50">Fewer no-shows</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-paper to-transparent z-20 pointer-events-none" />
    </section>
  );
}
