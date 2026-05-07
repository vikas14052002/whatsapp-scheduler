/**
 * ┌─────────────────────────────────────────┐
 * │  BADGE — Label Primitive                │
 * │  Small status/label indicators          │
 * └─────────────────────────────────────────┘
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'premium';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  default:  'bg-deep-ink/5 text-deep-ink/70 border-deep-ink/10',
  success:  'bg-whatsapp/10 text-whatsapp border-whatsapp/20',
  warning:  'bg-saffron-glow/10 text-saffron-glow border-saffron-glow/20',
  info:     'bg-coral-blush/10 text-coral-blush border-coral-blush/20',
  premium:  'bg-saffron-glow text-white border-saffron-glow shadow-lg shadow-saffron-glow/20',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge({ children, variant = 'default', className }, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-medium border',
          variantMap[variant],
          className
        )}
      >
        {children}
      </span>
    );
  }
);
