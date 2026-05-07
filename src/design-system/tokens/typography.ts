/**
 * ┌─────────────────────────────────────────┐
 * │  TYPOGRAPHY TOKENS                      │
 * │  Font families, sizes, weights, leads   │
 * └─────────────────────────────────────────┘
 */

export const fonts = {
  display:  'var(--font-space-grotesk)',
  headline: 'var(--font-outfit)',
  body:     'var(--font-inter)',
  quote:    'var(--font-playfair)',
  mono:     'var(--font-jetbrains-mono), monospace',
} as const;

export const fontSizes = {
  xs:    { size: '12px',  lineHeight: 1.5,  letterSpacing: '0.01em' },
  sm:    { size: '14px',  lineHeight: 1.5,  letterSpacing: '0' },
  base:  { size: '16px',  lineHeight: 1.6,  letterSpacing: '0' },
  lg:    { size: '18px',  lineHeight: 1.6,  letterSpacing: '0' },
  xl:    { size: '20px',  lineHeight: 1.5,  letterSpacing: '0' },
  '2xl': { size: '24px',  lineHeight: 1.4,  letterSpacing: '0' },
  '3xl': { size: '30px',  lineHeight: 1.3,  letterSpacing: '-0.01em' },
  '4xl': { size: '36px',  lineHeight: 1.2,  letterSpacing: '-0.01em' },
  '5xl': { size: '48px',  lineHeight: 1.15, letterSpacing: '-0.02em' },
  '6xl': { size: '60px',  lineHeight: 1.1,  letterSpacing: '-0.02em' },
  '7xl': { size: '72px',  lineHeight: 1.05, letterSpacing: '-0.02em' },
} as const;

export const fontWeights = {
  normal:   400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

export type FontSizeKey = keyof typeof fontSizes;
export type FontWeightKey = keyof typeof fontWeights;

/** Generate tailwind classes for a text style */
export function getTextStyle(
  size: FontSizeKey,
  weight: FontWeightKey = 'normal',
  family: keyof typeof fonts = 'body'
): string {
  const config = fontSizes[size];
  const weightValue = fontWeights[weight];

  // Map to tailwind classes
  const sizeMap: Record<FontSizeKey, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
  };

  const weightMap: Record<FontWeightKey, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const familyMap: Record<keyof typeof fonts, string> = {
    display:  'font-display',
    headline: 'font-headline',
    body:     'font-body',
    quote:    'font-quote',
    mono:     'font-mono',
  };

  return `${familyMap[family]} ${sizeMap[size]} ${weightMap[weight]}`;
}
