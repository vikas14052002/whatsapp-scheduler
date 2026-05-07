/**
 * ┌─────────────────────────────────────────┐
 * │  SPACING TOKENS — 8px Base Grid         │
 * │  Consistent rhythm across the product   │
 * └─────────────────────────────────────────┘
 */

export const spacing = {
  none:  '0',
  xs:    '4px',
  sm:    '8px',
  md:    '16px',
  lg:    '24px',
  xl:    '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '128px',
} as const;

export type SpaceKey = keyof typeof spacing;

/** Get a spacing value by token */
export function getSpace(token: SpaceKey): string {
  return spacing[token];
}

/** Section vertical padding */
export const sectionPadding = {
  sm: 'py-16',
  md: 'py-20',
  lg: 'py-24',
  xl: 'py-32',
} as const;

/** Container max widths */
export const container = {
  sm:  'max-w-xl',
  md:  'max-w-3xl',
  lg:  'max-w-5xl',
  xl:  'max-w-7xl',
  full: 'max-w-full',
} as const;
