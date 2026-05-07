/**
 * ┌─────────────────────────────────────────┐
 * │  TEXT — Typography Primitive            │
 * │  Token-aware text with all variants     │
 * └─────────────────────────────────────────┘
 */

import { forwardRef, ElementType, ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { FontSizeKey, FontWeightKey, fonts, fontWeights } from '@/design-system/tokens';

interface TextOwnProps {
  as?: ElementType;
  size?: FontSizeKey;
  weight?: FontWeightKey;
  family?: keyof typeof fonts;
  color?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

type TextProps<T extends ElementType = 'p'> = TextOwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps>;

const sizeMap: Record<FontSizeKey, string> = {
  xs:    'text-xs',
  sm:    'text-sm',
  base:  'text-base',
  lg:    'text-lg',
  xl:    'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
};

const weightMap: Record<FontWeightKey, string> = {
  normal:   'font-normal',
  medium:   'font-medium',
  semibold: 'font-semibold',
  bold:     'font-bold',
};

const familyMap: Record<string, string> = {
  display:  'font-display',
  headline: 'font-headline',
  body:     'font-body',
  quote:    'font-quote',
  mono:     'font-mono',
};

export const Text = forwardRef(function Text<T extends ElementType = 'p'>(
  { as, size = 'base', weight = 'normal', family = 'body', color, align, className, style, ...rest }: TextProps<T>,
  ref: React.Ref<any>
) {
  const Component = as || 'p';

  const classes = cn(
    familyMap[family],
    sizeMap[size],
    weightMap[weight],
    align && `text-${align}`,
    className
  );

  const styles = color ? { ...style, color } : style;

  const Comp = Component as any;
  return <Comp ref={ref} className={classes} style={styles} {...rest} />;
}) as <T extends ElementType = 'p'>(
  props: TextProps<T> & { ref?: React.Ref<any> }
) => JSX.Element;
