import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateLine({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const pad = 12, n = 8;
  const plotW = S - pad * 2, plotH = S - pad * 2;

  const data: number[] = [];
  for (let i = 0; i < n; i++) {
    const v = 0.15 + (getUnit(num + i * 29, 70, i) + 70) / 100 * 0.7;
    data.push(Math.min(Math.max(v, 0.1), 0.95));
  }
  const stepX = plotW / (n - 1);
  const color = colors[num % range];

  let inner = '';
  for (let i = 0; i <= 3; i++) {
    const y = pad + (plotH / 3) * i;
    inner += `<line x1="${pad}" y1="${y.toFixed(1)}" x2="${S - pad}" y2="${y.toFixed(1)}" stroke="rgba(${foreground},0.06)" stroke-width="0.5"/>`;
  }

  let d = '';
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = pad + stepX * i;
    const y = S - pad - data[i] * plotH;
    pts.push({ x, y });
    d += (i === 0 ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)} `;
  }
  inner += `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;

  for (let i = 0; i < n; i++) {
    inner += `<circle cx="${pts[i].x.toFixed(1)}" cy="${pts[i].y.toFixed(1)}" r="2.5" fill="${background}"/>`;
    inner += `<circle cx="${pts[i].x.toFixed(1)}" cy="${pts[i].y.toFixed(1)}" r="1.5" fill="${color}" opacity="0.9"/>`;
  }

  const color2 = colors[(num + 2) % range];
  let d2 = '';
  for (let i = 0; i < n; i++) {
    const x = pad + stepX * i;
    const off = (getUnit(num + i * 19 + 200, 25, i) + 25) / 100 * 0.25;
    const y = S - pad - (data[i] * 0.7 + off) * plotH;
    d2 += (i === 0 ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)} `;
  }
  inner += `<path d="${d2}" fill="none" stroke="${color2}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.4" stroke-dasharray="3,3"/>`;

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
