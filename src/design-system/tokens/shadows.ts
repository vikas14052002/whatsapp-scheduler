/**
 * ┌─────────────────────────────────────────┐
 * │  SHADOW & RADIUS TOKENS                 │
 * │  Depth system for elevation             │
 * └─────────────────────────────────────────┘
 */

export const shadows = {
  none:  'none',
  sm:    '0 1px 3px rgba(0, 0, 0, 0.04)',
  md:    '0 4px 12px rgba(0, 0, 0, 0.05)',
  lg:    '0 8px 24px rgba(0, 0, 0, 0.06)',
  xl:    '0 12px 40px rgba(0, 0, 0, 0.08)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow:  '0 8px 24px rgba(232, 93, 4, 0.25)',
  'glow-lg': '0 12px 40px rgba(232, 93, 4, 0.35)',
} as const;

export const radii = {
  none:  '0',
  sm:    '6px',
  md:    '12px',
  lg:    '16px',
  xl:    '20px',
  '2xl': '24px',
  '3xl': '32px',
  full:  '9999px',
} as const;

export type ShadowKey = keyof typeof shadows;
export type RadiusKey = keyof typeof radii;

export function getShadow(token: ShadowKey): string {
  return shadows[token];
}

export function getRadius(token: RadiusKey): string {
  return radii[token];
}
