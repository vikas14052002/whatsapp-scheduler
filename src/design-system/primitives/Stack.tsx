/**
 * ┌─────────────────────────────────────────┐
 * │  STACK — Flex Layout Primitive          │
 * │  Vertical/horizontal spacing utility    │
 * └─────────────────────────────────────────┘
 */

import { forwardRef, ElementType, ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { SpaceKey } from '@/design-system/tokens';

interface StackOwnProps {
  as?: ElementType;
  direction?: 'row' | 'column';
  gap?: SpaceKey;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  className?: string;
}

type StackProps<T extends ElementType = 'div'> = StackOwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof StackOwnProps>;

const gapMap: Record<SpaceKey, string> = {
  none: 'gap-0',
  xs:   'gap-1',
  sm:   'gap-2',
  md:   'gap-4',
  lg:   'gap-6',
  xl:   'gap-8',
  '2xl': 'gap-12',
  '3xl': 'gap-16',
  '4xl': 'gap-24',
  '5xl': 'gap-32',
};

const alignMap = {
  start:    'items-start',
  center:   'items-center',
  end:      'items-end',
  stretch:  'items-stretch',
};

const justifyMap = {
  start:   'justify-start',
  center:  'justify-center',
  end:     'justify-end',
  between: 'justify-between',
  around:  'justify-around',
};

export const Stack = forwardRef(function Stack<T extends ElementType = 'div'>(
  { as, direction = 'column', gap = 'md', align, justify, wrap, className, ...rest }: StackProps<T>,
  ref: React.Ref<any>
) {
  const Component = as || 'div';

  const classes = cn(
    'flex',
    direction === 'column' ? 'flex-col' : 'flex-row',
    gapMap[gap],
    align && alignMap[align],
    justify && justifyMap[justify],
    wrap && 'flex-wrap',
    className
  );

  const Comp = Component as any;
  return <Comp ref={ref} className={classes} {...rest} />;
}) as <T extends ElementType = 'div'>(
  props: StackProps<T> & { ref?: React.Ref<any> }
) => JSX.Element;

/** Horizontal stack shorthand */
export const Row = forwardRef(function Row<T extends ElementType = 'div'>(
  props: Omit<StackProps<T>, 'direction'>,
  ref: React.Ref<any>
) {
  return Stack({ ...props, direction: 'row', ref } as any);
}) as <T extends ElementType = 'div'>(
  props: Omit<StackProps<T>, 'direction'> & { ref?: React.Ref<any> }
) => JSX.Element;

/** Vertical stack shorthand */
export const Column = forwardRef(function Column<T extends ElementType = 'div'>(
  props: Omit<StackProps<T>, 'direction'>,
  ref: React.Ref<any>
) {
  return Stack({ ...props, direction: 'column', ref } as any);
}) as <T extends ElementType = 'div'>(
  props: Omit<StackProps<T>, 'direction'> & { ref?: React.Ref<any> }
) => JSX.Element;
