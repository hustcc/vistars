import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateTreemap({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const pad = 5, gap = 2.5;

  const rectCount = 5 + num % 3;
  const areas: number[] = [];
  let total = 0;
  for (let i = 0; i < rectCount; i++) {
    const a = 20 + (getUnit(num + i * 59, 80, i) + 80);
    areas.push(a); total += a;
  }

  const mid = Math.ceil(rectCount / 2);
  const row1A = areas.slice(0, mid).reduce((s, v) => s + v, 0);
  const row2A = areas.slice(mid).reduce((s, v) => s + v, 0);
  const totalW = S - pad * 2, totalH = S - pad * 2;
  const row1H = totalH * (row1A / (row1A + row2A)) - gap / 2;
  const row2H = totalH - row1H - gap;

  interface Rect { x: number; y: number; w: number; h: number; color: string; i: number }
  const rects: Rect[] = [];
  let x = pad;
  for (let i = 0; i < mid; i++) {
    const w = (areas[i] / row1A) * totalW - (i < mid - 1 ? gap : 0);
    rects.push({ x, y: pad, w, h: row1H, color: colors[(num + i * 3) % range], i });
    x += w + gap;
  }
  x = pad;
  for (let i = mid; i < rectCount; i++) {
    const w = (areas[i] / row2A) * totalW - (i < rectCount - 1 ? gap : 0);
    rects.push({ x, y: pad + row1H + gap, w, h: row2H, color: colors[(num + i * 3) % range], i });
    x += w + gap;
  }

  let inner = '';
  for (const r of rects) {
    const opacity = (0.5 + (r.i / rectCount) * 0.45).toFixed(2);
    inner += `<rect x="${r.x.toFixed(1)}" y="${r.y.toFixed(1)}" width="${Math.max(r.w, 1).toFixed(1)}" height="${Math.max(r.h, 1).toFixed(1)}" rx="3" fill="${r.color}" opacity="${opacity}"/>`;
    if (r.w > 14 && r.h > 10) {
      const lw = Math.min(r.w * 0.4, 16);
      inner += `<rect x="${(r.x + 4).toFixed(1)}" y="${(r.y + 5).toFixed(1)}" width="${lw.toFixed(1)}" height="2" rx="1" fill="rgba(${foreground},0.2)"/>`;
      if (r.h > 18) {
        inner += `<rect x="${(r.x + 4).toFixed(1)}" y="${(r.y + 10).toFixed(1)}" width="${(lw * 0.6).toFixed(1)}" height="1.5" rx="0.75" fill="rgba(${foreground},0.1)"/>`;
      }
    }
  }
  inner += `<rect x="${pad - 1}" y="${pad - 1}" width="${(totalW + 2).toFixed(1)}" height="${(totalH + 2).toFixed(1)}" rx="4" fill="none" stroke="rgba(${foreground},0.08)" stroke-width="0.5"/>`;

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
