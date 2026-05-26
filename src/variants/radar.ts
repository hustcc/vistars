import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateRadar({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const cx = S / 2, cy = S / 2;
  const maxR = 28, axes = 5;

  const pts: number[] = [];
  for (let i = 0; i < axes; i++) {
    const r = 0.3 + (getUnit(num + i * 41, 70, i) + 70) / 100 * 0.7;
    pts.push(Math.min(Math.max(r, 0.25), 1));
  }

  let inner = '';

  for (let ring = 1; ring <= 3; ring++) {
    const r = (maxR / 3) * ring;
    let d = '';
    for (let i = 0; i < axes; i++) {
      const a = (i / axes) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      d += (i === 0 ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)} `;
    }
    inner += `<path d="${d}Z" stroke="rgba(${foreground},0.07)" stroke-width="0.5" fill="none"/>`;
  }

  for (let i = 0; i < axes; i++) {
    const a = (i / axes) * Math.PI * 2 - Math.PI / 2;
    inner += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * maxR).toFixed(1)}" y2="${(cy + Math.sin(a) * maxR).toFixed(1)}" stroke="rgba(${foreground},0.06)" stroke-width="0.5"/>`;
  }

  const fillColor = colors[num % range];
  const strokeColor = colors[(num + 2) % range];
  let d = '';
  for (let i = 0; i < axes; i++) {
    const a = (i / axes) * Math.PI * 2 - Math.PI / 2;
    const r = maxR * pts[i];
    d += (i === 0 ? 'M' : 'L') + `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)} `;
  }
  inner += `<path d="${d}Z" fill="${fillColor}" fill-opacity="0.2" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round"/>`;

  for (let i = 0; i < axes; i++) {
    const a = (i / axes) * Math.PI * 2 - Math.PI / 2;
    const r = maxR * pts[i];
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    inner += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="${background}"/>`;
    inner += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="${strokeColor}" opacity="0.9"/>`;
  }

  for (let i = 0; i < axes; i++) {
    const a = (i / axes) * Math.PI * 2 - Math.PI / 2;
    inner += `<circle cx="${(cx + Math.cos(a) * maxR).toFixed(1)}" cy="${(cy + Math.sin(a) * maxR).toFixed(1)}" r="1" fill="rgba(${foreground},0.15)"/>`;
  }

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
