/**
 * ┌─────────────────────────────────────────┐
 * │  CARD — Surface Primitive               │
 * │  Contained content with elevation       │
 * └─────────────────────────────────────────┘
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { RadiusKey, ShadowKey } from '@/design-system/tokens';

interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: RadiusKey;
  shadow?: ShadowKey;
  hover?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const paddingMap = {
  none: 'p-0',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
  xl:   'p-10',
};

const radiusMap: Record<RadiusKey, string> = {
  none:  'rounded-none',
  sm:    'rounded-md',
  md:    'rounded-xl',
  lg:    'rounded-2xl',
  xl:    'rounded-3xl',
  '2xl': 'rounded-[24px]',
  '3xl': 'rounded-[32px]',
  full:  'rounded-full',
};

const shadowMap: Record<ShadowKey, string> = {
  none:  'shadow-none',
  sm:    'shadow-sm',
  md:    'shadow-md',
  lg:    'shadow-lg',
  xl:    'shadow-xl',
  '2xl': 'shadow-2xl',
  glow:  'shadow-[0_8px_24px_rgba(232,93,4,0.25)]',
  'glow-lg': 'shadow-[0_12px_40px_rgba(232,93,4,0.35)]',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(
    { children, padding = 'md', radius = 'lg', shadow = 'sm', hover = false, className, as: Component = 'div' },
    ref
  ) {
    const Comp = Component as any;
    return (
      <Comp
        ref={ref}
        className={cn(
          'bg-white border border-deep-ink/5',
          paddingMap[padding],
          radiusMap[radius],
          shadowMap[shadow],
          hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer',
          className
        )}
      >
        {children}
      </Comp>
    );
  }
);
