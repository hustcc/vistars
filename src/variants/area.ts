import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateArea({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const pad = 10, n = 7, layers = 2;
  const plotW = S - pad * 2, plotH = S - pad * 2;

  let inner = '';
  for (let i = 0; i <= 3; i++) {
    const y = pad + (plotH / 3) * i;
    inner += `<line x1="${pad}" y1="${y.toFixed(1)}" x2="${S - pad}" y2="${y.toFixed(1)}" stroke="rgba(${foreground},0.05)" stroke-width="0.5"/>`;
  }

  const stepX = plotW / (n - 1);
  for (let l = layers - 1; l >= 0; l--) {
    const color = colors[(num + l * 2) % range];
    const pts: number[] = [];
    for (let i = 0; i < n; i++) {
      const base = 0.15 + (getUnit(num + l * 100 + i * 31, 60, i + l) + 60) / 100 * 0.6;
      pts.push(Math.min(Math.max(base + l * 0.12, 0.1), 0.95));
    }

    let areaD = `M${pad},${S - pad}`;
    let lineD = '';
    for (let i = 0; i < n; i++) {
      const x = pad + stepX * i;
      const y = S - pad - pts[i] * plotH;
      areaD += ` L${x.toFixed(1)},${y.toFixed(1)}`;
      lineD += (i === 0 ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)} `;
    }
    areaD += ` L${(pad + stepX * (n - 1)).toFixed(1)},${S - pad} Z`;

    inner += `<path d="${areaD}" fill="${color}" fill-opacity="${l === 0 ? 0.3 : 0.15}"/>`;
    inner += `<path d="${lineD}" fill="none" stroke="${color}" stroke-width="${1.5 - l * 0.3}" stroke-linecap="round" stroke-linejoin="round" opacity="${0.9 - l * 0.3}"/>`;
  }

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
