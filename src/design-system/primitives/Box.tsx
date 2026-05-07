/**
 * ┌─────────────────────────────────────────┐
 * │  BOX — Layout Primitive                 │
 * │  Polymorphic, token-aware layout box    │
 * └─────────────────────────────────────────┘
 */

import { forwardRef, ElementType, ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { SpaceKey } from '@/design-system/tokens';

interface BoxOwnProps {
  as?: ElementType;
  p?: SpaceKey;
  px?: SpaceKey;
  py?: SpaceKey;
  pt?: SpaceKey;
  pr?: SpaceKey;
  pb?: SpaceKey;
  pl?: SpaceKey;
  m?: SpaceKey;
  mx?: SpaceKey;
  my?: SpaceKey;
  mt?: SpaceKey;
  mr?: SpaceKey;
  mb?: SpaceKey;
  ml?: SpaceKey;
  className?: string;
}

type BoxProps<T extends ElementType = 'div'> = BoxOwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof BoxOwnProps>;

const spaceMap: Record<SpaceKey, string> = {
  none: '0',
  xs: '1',
  sm: '2',
  md: '4',
  lg: '6',
  xl: '8',
  '2xl': '12',
  '3xl': '16',
  '4xl': '24',
  '5xl': '32',
};

function getSpaceClass(prefix: string, token?: SpaceKey): string | undefined {
  if (!token || token === 'none') return undefined;
  return `${prefix}-${spaceMap[token]}`;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  function Box({ as: Component = 'div', p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml, className, ...rest }, ref) {
    const classes = cn(
      getSpaceClass('p', p),
      getSpaceClass('px', px),
      getSpaceClass('py', py),
      getSpaceClass('pt', pt),
      getSpaceClass('pr', pr),
      getSpaceClass('pb', pb),
      getSpaceClass('pl', pl),
      getSpaceClass('m', m),
      getSpaceClass('mx', mx),
      getSpaceClass('my', my),
      getSpaceClass('mt', mt),
      getSpaceClass('mr', mr),
      getSpaceClass('mb', mb),
      getSpaceClass('ml', ml),
      className
    );

    const Comp = Component as any;
    return <Comp ref={ref} className={classes || undefined} {...rest} />;
  }
) as <T extends ElementType = 'div'>(
  props: BoxProps<T> & { ref?: React.Ref<any> }
) => JSX.Element;
