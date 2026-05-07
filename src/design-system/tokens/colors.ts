/**
 * ┌─────────────────────────────────────────┐
 * │  COLOR TOKENS — "Saffron Ink" Palette   │
 * │  Single source of truth for all colors  │
 * └─────────────────────────────────────────┘
 */

export const colors = {
  // ─── Brand ───
  deepInk:      '#0F0F12',
  warmPaper:    '#F5F0E8',
  sageWhisper:  '#E8EDE6',

  // ─── Accent ───
  saffronGlow:  '#E85D04',
  saffronDark:  '#D14E00',
  mutedGold:    '#D4A574',
  coralBlush:   '#F4A261',

  // ─── WhatsApp ───
  whatsapp:     '#25D366',
  whatsappDark: '#128C7E',

  // ─── Neutral ───
  white:        '#FFFFFF',
  black:        '#000000',
  transparent:  'transparent',

  // ─── Semantic Aliases ───
  bgPrimary:    '#F5F0E8',
  bgSecondary:  '#E8EDE6',
  bgDark:       '#0F0F12',
  textPrimary:  '#0F0F12',
  textMuted:    'rgba(15, 15, 18, 0.5)',
  textInverse:  '#FFFFFF',
} as const;

export type ColorKey = keyof typeof colors;

/** Get a color value by token name */
export function getColor(token: ColorKey): string {
  return colors[token];
}

/** Get a color with opacity */
export function getColorAlpha(token: ColorKey, alpha: number): string {
  const hex = colors[token];
  if (hex.startsWith('#')) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
}
