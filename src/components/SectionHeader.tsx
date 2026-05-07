/**
 * ┌─────────────────────────────────────────┐
 * │  SECTION HEADER — Reusable Section Title│
 * │  Overline + Headline + Subheadline      │
 * └─────────────────────────────────────────┘
 */

import { Text } from '@/design-system/primitives';
import { useScrollReveal } from '@/design-system/hooks/useScrollReveal';

interface SectionHeaderProps {
  overline: string;
  headline: string;
  subheadline?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ overline, headline, subheadline, align = 'center', className }: SectionHeaderProps) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });

  const alignClass = align === 'center' ? 'text-center mx-auto' : '';
  const maxWidth = align === 'center' ? 'max-w-2xl' : 'max-w-xl';

  return (
    <div ref={ref} className={`${alignClass} ${maxWidth} ${className || ''}`}>
      <Text
        size="sm"
        weight="medium"
        className="text-saffron-glow uppercase tracking-wider mb-3"
      >
        {overline}
      </Text>
      <Text
        as="h2"
        family="headline"
        size="4xl"
        weight="semibold"
        className="text-deep-ink mb-4 sm:text-5xl"
      >
        {headline}
      </Text>
      {subheadline && (
        <Text size="lg" className="text-deep-ink/50">
          {subheadline}
        </Text>
      )}
    </div>
  );
}
