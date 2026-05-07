/**
 * ┌─────────────────────────────────────────┐
 * │  ANIMATION TOKENS                       │
 * │  Timing, easing, durations              │
 * └─────────────────────────────────────────┘
 */

export const durations = {
  instant: 0,
  fast:    0.15,
  normal:  0.2,
  slow:    0.3,
  slower:  0.5,
  slowest: 0.8,
} as const;

export const easings = {
  easeOut:     'cubic-bezier(0.4, 0, 0.2, 1)',
  easeInOut:   'cubic-bezier(0.4, 0, 0.2, 1)',
  spring:      'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce:      'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  power2Out:   'power2.out',
  power3Out:   'power3.out',
  power4Out:   'power4.out',
} as const;

export const delays = {
  none:   0,
  xs:     0.05,
  sm:     0.1,
  md:     0.2,
  lg:     0.3,
  xl:     0.5,
} as const;

export type DurationKey = keyof typeof durations;
export type EasingKey = keyof typeof easings;
export type DelayKey = keyof typeof delays;

export function getDuration(token: DurationKey): number {
  return durations[token];
}

export function getEasing(token: EasingKey): string {
  return easings[token];
}

export function getDelay(token: DelayKey): number {
  return delays[token];
}

/** Standard scroll reveal config */
export const scrollRevealDefaults = {
  y: 40,
  duration: 0.8,
  ease: 'power3.out',
  start: 'top 85%',
} as const;

/** Parallax speed multipliers */
export const parallaxSpeeds = {
  slow:   0.2,
  normal: 0.5,
  fast:   0.8,
  faster: 1.2,
} as const;
