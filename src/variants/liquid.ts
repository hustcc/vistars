import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateLiquid({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const cx = S / 2, cy = S / 2, R = 30;

  const level = 0.3 + (getUnit(num, 55, 0) + 55) / 100 * 0.55;
  const color = colors[num % range];
  const color2 = colors[(num + 2) % range];
  const waterY = cy + R - level * R * 2;
  const waveAmp = 2 + (num % 3);
  const waveFreq = 2 + num % 2;

  let inner = '';
  inner += `<circle cx="${cx}" cy="${cy}" r="${R + 2}" fill="none" stroke="rgba(${foreground},0.1)" stroke-width="1"/>`;

  const clipId = `lc${num % 9999}`;
  inner += `<defs><clipPath id="${clipId}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs>`;
  inner += `<g clip-path="url(#${clipId})">`;

  let wave1 = `M${cx - R},${waterY.toFixed(1)}`;
  for (let x = -R; x <= R; x++) {
    const wy = waterY + Math.sin((x / R) * Math.PI * waveFreq + num * 0.1) * waveAmp;
    wave1 += ` L${(cx + x).toFixed(1)},${wy.toFixed(1)}`;
  }
  wave1 += ` L${(cx + R).toFixed(1)},${cy + R} L${(cx - R).toFixed(1)},${cy + R} Z`;
  inner += `<path d="${wave1}" fill="${color}" opacity="0.5"/>`;

  let wave2 = `M${cx - R},${(waterY + 1).toFixed(1)}`;
  for (let x = -R; x <= R; x++) {
    const wy = waterY + 1 + Math.sin((x / R) * Math.PI * (waveFreq + 1) + num * 0.3 + 2) * (waveAmp * 0.7);
    wave2 += ` L${(cx + x).toFixed(1)},${wy.toFixed(1)}`;
  }
  wave2 += ` L${(cx + R).toFixed(1)},${cy + R} L${(cx - R).toFixed(1)},${cy + R} Z`;
  inner += `<path d="${wave2}" fill="${color2}" opacity="0.3"/>`;

  inner += `</g>`;
  inner += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="rgba(${foreground},0.15)" stroke-width="1"/>`;

  const pct = Math.round(level * 100);
  inner += `<text x="${cx}" y="${cy + 2}" text-anchor="middle" dominant-baseline="middle" fill="rgba(${foreground},0.6)" font-size="12" font-weight="700" font-family="ui-monospace,monospace">${pct}%</text>`;

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
