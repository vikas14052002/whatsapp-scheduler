/**
 * ┌─────────────────────────────────────────┐
 * │  BUTTON — Action Primitive              │
 * │  Variants: primary, secondary, ghost    │
 * └─────────────────────────────────────────┘
 */

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantMap: Record<ButtonVariant, string> = {
  primary:
    'bg-saffron-glow text-white hover:bg-saffron-dark shadow-lg shadow-saffron-glow/20',
  secondary:
    'bg-deep-ink text-white hover:bg-deep-ink/90',
  ghost:
    'bg-transparent text-deep-ink hover:bg-deep-ink/5',
  outline:
    'bg-transparent border-[1.5px] border-deep-ink/20 text-deep-ink hover:bg-deep-ink hover:text-white hover:border-deep-ink',
};

const sizeMap: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, className, disabled, ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-body font-semibold',
          'transition-all duration-200',
          'active:scale-[0.98]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          variantMap[variant],
          sizeMap[size],
          className
        )}
        {...rest}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
