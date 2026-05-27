import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateLine({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const pad = 12, n = 10;
  const plotW = S - pad * 2, plotH = S - pad * 2;

  const data: number[] = [];
  for (let i = 0; i < n; i++) {
    const v = 0.1 + (getUnit(num + i * 29, 80, i) + 80) / 100 * 0.8;
    data.push(Math.min(Math.max(v, 0.08), 0.95));
  }
  const color1 = colors[num % range];
  const color2 = colors[(num + 2) % range];

  let inner = '';
  for (let i = 0; i <= 3; i++) {
    const y = pad + (plotH / 3) * i;
    inner += `<line x1="${pad}" y1="${y.toFixed(1)}" x2="${S - pad}" y2="${y.toFixed(1)}" stroke="rgba(${foreground},0.05)" stroke-width="0.5"/>`;
  }
  inner += `<line x1="${pad}" y1="${S - pad}" x2="${S - pad}" y2="${S - pad}" stroke="rgba(${foreground},0.1)" stroke-width="0.5"/>`;

  const stepX = plotW / (n - 1);
  const points: { x: number; y: number }[] = [];
  let line1 = '';
  for (let i = 0; i < n; i++) {
    const x = pad + stepX * i;
    const y = S - pad - data[i] * plotH;
    points.push({ x, y });
    line1 += (i === 0 ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)} `;
  }
  inner += `<path d="${line1}" fill="none" stroke="${color1}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

  let area = `M${pad},${S - pad} `;
  for (const p of points) {
    area += `L${p.x.toFixed(1)},${p.y.toFixed(1)} `;
  }
  area += `L${S - pad},${S - pad} Z`;
  inner += `<path d="${area}" fill="${color1}" opacity="0.15"/>`;

  let line2D = '';
  for (let i = 0; i < n; i++) {
    const x = pad + stepX * i;
    const d = (getUnit(num + i * 13 + 999, 20, i) + 20) / 100 * 0.08;
    const y = S - pad - Math.min(0.98, data[i] * 0.78 + d) * plotH;
    line2D += (i === 0 ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)} `;
  }
  inner += `<path d="${line2D}" fill="none" stroke="${color2}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.35" stroke-dasharray="3,3"/>`;

  const last = points[n - 1];
  inner += `<circle cx="${last.x.toFixed(1)}" cy="${last.y.toFixed(1)}" r="4" fill="${color1}" opacity="0.2"/>`;
  inner += `<circle cx="${last.x.toFixed(1)}" cy="${last.y.toFixed(1)}" r="2" fill="${background}"/>`;
  inner += `<circle cx="${last.x.toFixed(1)}" cy="${last.y.toFixed(1)}" r="1.5" fill="${color1}"/>`;

  inner += `<circle cx="${points[0].x.toFixed(1)}" cy="${points[0].y.toFixed(1)}" r="1" fill="${color1}" opacity="0.5"/>`;

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
