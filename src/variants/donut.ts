import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateDonut({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const cx = S / 2, cy = S / 2;
  const R = 30, strokeW = 9;
  const segments = 4;

  const raw: number[] = [];
  let total = 0;
  for (let i = 0; i < segments; i++) {
    const v = 15 + (getUnit(num + i * 53, 85, i) + 85);
    raw.push(v); total += v;
  }

  const C = 2 * Math.PI * R;
  const gap = C * 0.12 / segments;
  const available = C - segments * gap;
  let offset = 0;
  let inner = '';

  inner += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="rgba(${foreground},0.06)" stroke-width="${strokeW}"/>`;

  for (let i = 0; i < segments; i++) {
    const frac = raw[i] / total;
    const dash = available * frac;
    const color = colors[(num + i * 7) % range];
    inner += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${color}" stroke-width="${strokeW}" stroke-dasharray="${dash.toFixed(1)} ${(C - dash).toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})" opacity="0.85"/>`;
    offset += dash + gap;
  }

  inner += `<circle cx="${cx}" cy="${cy}" r="${R - strokeW / 2 - 3}" fill="none" stroke="rgba(${foreground},0.05)" stroke-width="0.5"/>`;
  const pct = Math.round((raw[0] / total) * 100);
  inner += `<text x="${cx}" y="${cy + 1.5}" text-anchor="middle" dominant-baseline="middle" fill="rgba(${foreground},0.5)" font-size="9" font-weight="600" font-family="ui-monospace,monospace">${pct}%</text>`;

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const dx = cx + Math.cos(a) * (R + strokeW / 2 + 3);
    const dy = cy + Math.sin(a) * (R + strokeW / 2 + 3);
    inner += `<circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="0.8" fill="rgba(${foreground},0.15)"/>`;
  }

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
