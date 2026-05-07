/**
 * ┌─────────────────────────────────────────┐
 * │  useParallax — Parallax Hook            │
 * │  Speed-controlled scroll offset         │
 * └─────────────────────────────────────────┘
 */

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxOptions {
  speed?: number;      // 0.2 = slow, 1.0 = normal, 1.5 = fast
  direction?: 'y' | 'x';
  scrub?: boolean | number;
  start?: string;
  end?: string;
}

export function useParallax<T extends HTMLElement>(options: ParallaxOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      speed = 0.5,
      direction = 'y',
      scrub = 1,
      start = 'top bottom',
      end = 'bottom top',
    } = options;

    const distance = 100 * speed;
    const from = direction === 'y' ? { y: distance } : { x: distance };
    const to = direction === 'y' ? { y: -distance } : { x: -distance };

    const ctx = gsap.context(() => {
      gsap.fromTo(el, from, {
        ...to,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub,
        },
      });
    });

    return () => ctx.revert();
  }, [options.speed, options.direction, options.scrub, options.start, options.end]);

  return ref;
}
