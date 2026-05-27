import { hashCode, getUnit, bg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generatePie({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const cx = S / 2, cy = S / 2 - 1, R = 28;
  const depth = 2.5;
  const slices = 3 + num % 3;
  const explodedSlice = num % slices;
  const explodedOffset = 1.8;

  const raw: number[] = [];
  let total = 0;
  for (let i = 0; i < slices; i++) {
    const v = 15 + (getUnit(num + i * 43, 80, i) + 80);
    raw.push(v); total += v;
  }

  const sliceSegments: {
    start: number;
    end: number;
    color: string;
    offsetX: number;
    offsetY: number;
  }[] = [];
  let angle = -90;
  for (let i = 0; i < slices; i++) {
    const sweep = (raw[i] / total) * 360;
    const end = angle + sweep;
    const midAngleRad = (angle + sweep / 2) * Math.PI / 180;
    const offset = i === explodedSlice ? explodedOffset : 0;
    sliceSegments.push({
      start: angle,
      end,
      color: colors[(num + i * 3) % range],
      offsetX: Math.cos(midAngleRad) * offset,
      offsetY: Math.sin(midAngleRad) * offset,
    });
    angle = end;
  }

  let inner = '';

  // 3D side rim
  for (const segment of sliceSegments) {
    const { start, end, color, offsetX, offsetY } = segment;
    const step = 3;
    if (end > start) {
      for (let a = start; a < end; a += step) {
        const aRad = a * Math.PI / 180;
        const nextRad = Math.min(a + step, end) * Math.PI / 180;
        if (Math.sin(aRad) > 0.05 || Math.sin(nextRad) > 0.05) {
          const x0 = cx + Math.cos(aRad) * R + offsetX, y0 = cy + Math.sin(aRad) * R + offsetY;
          const x1 = cx + Math.cos(nextRad) * R + offsetX, y1 = cy + Math.sin(nextRad) * R + offsetY;
          inner += `<polygon points="${x0.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${(y1 + depth).toFixed(1)} ${x0.toFixed(1)},${(y0 + depth).toFixed(1)}" fill="${color}" opacity="0.4"/>`;
        }
      }
    }
  }

  // Top face
  for (const segment of sliceSegments) {
    const { start, end, color, offsetX, offsetY } = segment;
    const sweep = end - start;
    const rad0 = start * Math.PI / 180, rad1 = end * Math.PI / 180;
    const x0 = cx + Math.cos(rad0) * R + offsetX, y0 = cy + Math.sin(rad0) * R + offsetY;
    const x1 = cx + Math.cos(rad1) * R + offsetX, y1 = cy + Math.sin(rad1) * R + offsetY;
    const centerX = +(cx + offsetX).toFixed(1);
    const centerY = +(cy + offsetY).toFixed(1);
    const largeArc = sweep > 180 ? 1 : 0;
    inner += `<path d="M${centerX},${centerY} L${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 ${largeArc} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${color}" opacity="0.9"/>`;
  }

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
