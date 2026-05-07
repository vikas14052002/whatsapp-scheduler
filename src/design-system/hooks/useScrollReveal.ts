/**
 * ┌─────────────────────────────────────────┐
 * │  useScrollReveal — Animation Hook       │
 * │  Subtle upward slide on scroll          │
 * └─────────────────────────────────────────┘
 */

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 24,
      duration = 0.6,
      delay = 0,
      ease = 'power3.out',
      start = 'top 90%',
      once = true,
    } = options;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { y },
        {
          y: 0,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [options.y, options.duration, options.delay, options.ease, options.start, options.once]);

  return ref;
}

/** Hook for staggered children reveal */
export function useStaggerReveal<T extends HTMLElement>(
  childSelector: string,
  options: ScrollRevealOptions & { childDelay?: number } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll(childSelector);
    if (!children.length) return;

    const {
      y = 24,
      duration = 0.6,
      ease = 'power3.out',
      start = 'top 90%',
      childDelay = 0.06,
      once = true,
    } = options;

    const ctx = gsap.context(() => {
      gsap.fromTo(children,
        { y },
        {
          y: 0,
          duration,
          ease,
          stagger: childDelay,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [childSelector, options.y, options.duration, options.ease, options.start, options.childDelay, options.once]);

  return ref;
}
