'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

interface CharacterRevealProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  stagger?: number;
}

export default function CharacterReveal({
  text,
  className,
  tag: Tag = 'h1',
  delay = 0,
  stagger = 0.02,
}: CharacterRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = el.querySelectorAll('.char');

    const ctx = gsap.context(() => {
      gsap.from(chars, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger,
        delay,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, [delay, stagger]);

  const words = text.split(' ');

  return (
    <Tag ref={ref as any} className={cn(className)}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block" style={{ whiteSpace: 'nowrap' }}>
          {word.split('').map((char, ci) => (
            <span key={ci} className="char inline-block" style={{ whiteSpace: 'pre' }}>
              {char}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span className="char inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}
