import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateHBar({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const pad = 10, barCount = 5, gap = 3;
  const barH = (S - pad * 2 - gap * (barCount - 1)) / barCount;
  const maxW = S - pad * 2 - 8;

  let inner = '';
  for (let i = 1; i <= 3; i++) {
    const x = pad + 8 + (maxW / 3) * i;
    inner += `<line x1="${x.toFixed(1)}" y1="${pad}" x2="${x.toFixed(1)}" y2="${S - pad}" stroke="rgba(${foreground},0.05)" stroke-width="0.5"/>`;
  }

  for (let i = 0; i < barCount; i++) {
    const ratio = 0.2 + (getUnit(num + i * 37, 80, i) + 80) / 100 * 0.7;
    const w = maxW * Math.min(Math.max(ratio, 0.15), 1);
    const y = pad + i * (barH + gap);
    const color = colors[(num + i * 3) % range];
    const opacity = (0.55 + (i / barCount) * 0.4).toFixed(2);
    inner += `<rect x="${(pad + 8).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${barH.toFixed(1)}" rx="${Math.min(barH / 2, 2.5)}" fill="${color}" opacity="${opacity}"/>`;
    inner += `<rect x="${(pad + 8).toFixed(1)}" y="${y.toFixed(1)}" width="3" height="${barH.toFixed(1)}" rx="${Math.min(barH / 2, 2.5)}" fill="${color}" opacity="0.9"/>`;
  }

  inner += `<line x1="${pad + 8}" y1="${pad}" x2="${pad + 8}" y2="${S - pad}" stroke="rgba(${foreground},0.1)" stroke-width="0.5"/>`;

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
