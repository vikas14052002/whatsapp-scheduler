/**
 * ┌─────────────────────────────────────────┐
 * │  CONTAINER — Max-width Wrapper          │
 * │  Responsive content boundaries          │
 * └─────────────────────────────────────────┘
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  center?: boolean;
  className?: string;
}

const sizeMap = {
  sm:  'max-w-xl',
  md:  'max-w-3xl',
  lg:  'max-w-5xl',
  xl:  'max-w-7xl',
  full: 'max-w-full',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ children, size = 'xl', center = true, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full px-4 sm:px-6 lg:px-8',
          sizeMap[size],
          center && 'mx-auto',
          className
        )}
      >
        {children}
      </div>
    );
  }
);
