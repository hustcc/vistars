import { hashCode, getUnit, bg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generatePie({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const cx = S / 2, cy = S / 2 - 1, R = 28;
  const depth = 2.5;
  const separatorGapDegrees = 1.2;
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
    // Clamp to 60% of slice sweep so very small slices still retain visible area.
    const gap = Math.min(separatorGapDegrees, sweep * 0.6);
    const startAngle = angle + gap / 2;
    const visibleEndAngle = endAngle - gap / 2;
    const color = colors[(num + i * 3) % range];
    const step = 3;
    if (visibleEndAngle > startAngle) {
      for (let a = startAngle; a < visibleEndAngle; a += step) {
        const aRad = a * Math.PI / 180;
        const nextRad = Math.min(a + step, visibleEndAngle) * Math.PI / 180;
        if (Math.sin(aRad) > 0.05 || Math.sin(nextRad) > 0.05) {
          const x0 = cx + Math.cos(aRad) * R, y0 = cy + Math.sin(aRad) * R;
          const x1 = cx + Math.cos(nextRad) * R, y1 = cy + Math.sin(nextRad) * R;
          inner += `<polygon points="${x0.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${(y1 + depth).toFixed(1)} ${x0.toFixed(1)},${(y0 + depth).toFixed(1)}" fill="${color}" opacity="0.4"/>`;
        }
      }
    }
    angle = endAngle;
  }

  // Top face
  angle = -90;
  for (let i = 0; i < slices; i++) {
    const sweep = (raw[i] / total) * 360;
    const endAngle = angle + sweep;
    // Keep top-face geometry in sync with side rim gap clamping.
    const gap = Math.min(separatorGapDegrees, sweep * 0.6);
    const startAngle = angle + gap / 2;
    const visibleEndAngle = endAngle - gap / 2;
    const color = colors[(num + i * 3) % range];
    const rad0 = startAngle * Math.PI / 180, rad1 = visibleEndAngle * Math.PI / 180;
    const x0 = cx + Math.cos(rad0) * R, y0 = cy + Math.sin(rad0) * R;
    const x1 = cx + Math.cos(rad1) * R, y1 = cy + Math.sin(rad1) * R;
    const largeArc = (visibleEndAngle - startAngle) > 180 ? 1 : 0;
    inner += `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 ${largeArc} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${color}" opacity="0.9"/>`;
    angle = endAngle;
  }

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
