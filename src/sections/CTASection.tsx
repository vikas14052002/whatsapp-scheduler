'use client';

import { useRef, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Container, Button } from '@/design-system/primitives';
import dynamic from 'next/dynamic';
const FloatingGeometry = dynamic(() => import('@/components/three/FloatingGeometry'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const shapes = shapesRef.current;
    if (!section || !shapes) return;

    const ctx = gsap.context(() => {
      const shapeEls = shapes.querySelectorAll('.floating-shape');
      shapeEls.forEach((shape, i) => {
        gsap.fromTo(shape,
          { y: 40, rotation: i % 2 === 0 ? -5 : 5 },
          {
            y: -80 * (i % 2 === 0 ? 1 : -1),
            rotation: i % 2 === 0 ? 15 : -15,
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          }
        );
      });

      const content = section.querySelector('.cta-content');
      if (content) {
        gsap.fromTo(content,
          { y: 30 },
          {
            y: 0,
            scrollTrigger: { trigger: section, start: 'top 75%', end: 'center center', scrub: 1 },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-deep-ink relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(232,93,4,0.3) 0%, transparent 70%)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(45,27,78,0.4) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      <Suspense fallback={null}>
        <FloatingGeometry />
      </Suspense>

      <Container className="relative z-10">
        <div className="cta-content text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <MessageCircle size={16} className="text-whatsapp" />
            <span className="text-sm text-white/60 font-body">Join 500+ Indian businesses</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-white leading-tight mb-6">
            Stop losing appointments to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-saffron-glow to-coral-blush">
              WhatsApp chaos.
            </span>
          </h2>

          <p className="text-lg text-white/50 font-body max-w-xl mx-auto mb-10 leading-relaxed">
            Your customers are already on WhatsApp. Your booking system should be too.
            Set up in 5 minutes. Start taking appointments today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" className="text-lg px-10 py-5" rightIcon={<ArrowRight size={20} />}
              onClick={() => router.push('/login?tab=register')}>
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => router.push('/login')}>
              View Demo
            </Button>
          </div>

          <p className="text-sm text-white/30 mt-8 font-body">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </Container>
    </section>
  );
}
