import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateSparkline({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const pad = 12, n = 10;

  const data: number[] = [];
  for (let i = 0; i < n; i++) {
    const v = 0.1 + (getUnit(num + i * 29, 80, i) + 80) / 100 * 0.8;
    data.push(Math.min(Math.max(v, 0.08), 0.95));
  }

  let inner = '';
  for (let i = 0; i <= 3; i++) {
    const y = pad + ((S - pad * 2) / 3) * i;
    inner += `<line x1="${pad}" y1="${y.toFixed(1)}" x2="${S - pad}" y2="${y.toFixed(1)}" stroke="rgba(${foreground},0.05)" stroke-width="0.5"/>`;
  }

  const stepX = (S - pad * 2) / (n - 1);
  const color1 = colors[num % range];
  const color2 = colors[(num + 2) % range];

  let areaD = `M${pad},${S - pad}`;
  let lineD = '';
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = pad + stepX * i;
    const y = S - pad - data[i] * (S - pad * 2);
    points.push({ x, y });
    areaD += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    lineD += (i === 0 ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)} `;
  }
  areaD += ` L${(S - pad).toFixed(1)},${S - pad} Z`;

  const gid = `sg${num % 999}`;
  inner += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color1}" stop-opacity="0.25"/><stop offset="100%" stop-color="${color1}" stop-opacity="0.02"/></linearGradient></defs>`;
  inner += `<path d="${areaD}" fill="url(#${gid})"/>`;
  inner += `<path d="${lineD}" fill="none" stroke="${color1}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;

  let line2D = '';
  for (let i = 0; i < n; i++) {
    const x = pad + stepX * i;
    const offset = (getUnit(num + i * 19 + 100, 30, i) + 30) / 100 * 0.3;
    const y = S - pad - (data[i] * 0.6 + offset) * (S - pad * 2);
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
