import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generatePie({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const cx = S / 2, cy = S / 2 - 1, R = 28;
  const depth = 2.5;
  const slices = 3 + num % 3;

  const raw: number[] = [];
  let total = 0;
  for (let i = 0; i < slices; i++) {
    const v = 15 + (getUnit(num + i * 43, 80, i) + 80);
    raw.push(v); total += v;
  }

  let inner = '';
  let angle = -90;

  // 3D side rim
  for (let i = 0; i < slices; i++) {
    const sweep = (raw[i] / total) * 360;
    const endAngle = angle + sweep;
    const color = colors[(num + i * 3) % range];
    const step = 3;
    for (let a = Math.ceil(angle / step) * step; a < endAngle; a += step) {
      const aRad = a * Math.PI / 180;
      const nextRad = Math.min(a + step, endAngle) * Math.PI / 180;
      if (Math.sin(aRad) > 0.05 || Math.sin(nextRad) > 0.05) {
        const x0 = cx + Math.cos(aRad) * R, y0 = cy + Math.sin(aRad) * R;
        const x1 = cx + Math.cos(nextRad) * R, y1 = cy + Math.sin(nextRad) * R;
        inner += `<polygon points="${x0.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${(y1 + depth).toFixed(1)} ${x0.toFixed(1)},${(y0 + depth).toFixed(1)}" fill="${color}" opacity="0.4"/>`;
      }
    }
    angle = endAngle;
  }

  // Top face
  angle = -90;
  for (let i = 0; i < slices; i++) {
    const sweep = (raw[i] / total) * 360;
    const endAngle = angle + sweep;
    const color = colors[(num + i * 3) % range];
    const rad0 = angle * Math.PI / 180, rad1 = endAngle * Math.PI / 180;
    const x0 = cx + Math.cos(rad0) * R, y0 = cy + Math.sin(rad0) * R;
    const x1 = cx + Math.cos(rad1) * R, y1 = cy + Math.sin(rad1) * R;
    const largeArc = sweep > 180 ? 1 : 0;
    inner += `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 ${largeArc} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${color}" opacity="0.9"/>`;
    inner += `<line x1="${cx}" y1="${cy}" x2="${x0.toFixed(1)}" y2="${y0.toFixed(1)}" stroke="${background}" stroke-width="1.2"/>`;
    angle = endAngle;
  }

  inner += `<ellipse cx="${cx}" cy="${cy + depth + 1.5}" rx="${R * 0.85}" ry="2" fill="rgba(${foreground},0.05)"/>`;

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
