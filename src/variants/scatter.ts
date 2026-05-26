import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateScatter({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const pad = 10;
  const dotCount = 12 + num % 8;

  let inner = '';
  for (let i = 0; i <= 3; i++) {
    const v = pad + ((S - pad * 2) / 3) * i;
    inner += `<line x1="${pad}" y1="${v.toFixed(1)}" x2="${S - pad}" y2="${v.toFixed(1)}" stroke="rgba(${foreground},0.05)" stroke-width="0.5"/>`;
    inner += `<line x1="${v.toFixed(1)}" y1="${pad}" x2="${v.toFixed(1)}" y2="${S - pad}" stroke="rgba(${foreground},0.05)" stroke-width="0.5"/>`;
  }

  for (let i = 0; i < dotCount; i++) {
    const xR = Math.min(Math.max(0.05 + (getUnit(num + i * 17, 90, i) + 90) / 100 * 0.9, 0), 1);
    const yR = Math.min(Math.max(0.05 + (getUnit(num + i * 23, 90, (i + 3) % 10) + 90) / 100 * 0.9, 0), 1);
    const x = pad + xR * (S - pad * 2);
    const y = S - pad - yR * (S - pad * 2);
    const color = colors[(num + i * 7) % range];
    const r = 1.5 + (getUnit(num + i * 11, 30, i) + 30) / 100 * 2;
    const opacity = (0.4 + (getUnit(num + i * 13, 50, i) + 50) / 100 * 0.5).toFixed(2);
    inner += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="${opacity}"/>`;
  }

  const trendColor = colors[num % range];
  const slope = ((getUnit(num + 500, 80, 0) + 80) / 100 * 1.2 - 0.6);
  const intercept = 0.3 + (getUnit(num + 600, 40, 1) + 40) / 100 * 0.4;
  const y0 = S - pad - intercept * (S - pad * 2);
  const y1 = S - pad - (intercept + slope) * (S - pad * 2);
  inner += `<line x1="${pad}" y1="${y0.toFixed(1)}" x2="${S - pad}" y2="${y1.toFixed(1)}" stroke="${trendColor}" stroke-width="1" stroke-dasharray="4,3" opacity="0.35"/>`;

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
