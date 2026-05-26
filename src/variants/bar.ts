import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateBar({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const barCount = 7, pad = 10, gap = 3;
  const barW = (S - pad * 2 - gap * (barCount - 1)) / barCount;
  const maxH = S - pad * 2 - 8;
  const baseY = S - pad - 2;

  let inner = '';
  for (let i = 0; i <= 3; i++) {
    const y = pad + 4 + (maxH / 3) * i;
    inner += `<line x1="${pad}" y1="${y}" x2="${S - pad}" y2="${y}" stroke="rgba(${foreground},0.06)" stroke-width="0.5"/>`;
  }
  inner += `<line x1="${pad}" y1="${baseY}" x2="${S - pad}" y2="${baseY}" stroke="rgba(${foreground},0.12)" stroke-width="0.5"/>`;

  for (let i = 0; i < barCount; i++) {
    const ratio = 0.2 + (getUnit(num + i * 37, 80, i) + 80) / 100 * 0.7;
    const h = maxH * Math.min(Math.max(ratio, 0.12), 1);
    const x = pad + i * (barW + gap);
    const y = baseY - h;
    const color = colors[(num + i * 3) % range];
    const opacity = (0.55 + (i / barCount) * 0.4).toFixed(2);
    inner += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(barW / 2, 2.5)}" fill="${color}" opacity="${opacity}"/>`;
    inner += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="3" rx="${Math.min(barW / 2, 2.5)}" fill="${color}" opacity="0.9"/>`;
  }
  inner += `<line x1="${pad}" y1="${baseY}" x2="${pad}" y2="${baseY - 3}" stroke="rgba(${foreground},0.2)" stroke-width="0.5"/>`;
  inner += `<line x1="${S - pad}" y1="${baseY}" x2="${S - pad}" y2="${baseY - 3}" stroke="rgba(${foreground},0.2)" stroke-width="0.5"/>`;

  return svg(S, size, background, inner);
}

function svg(S: number, size: number | string | undefined, background: string, inner: string): string {
  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
