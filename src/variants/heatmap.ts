import { hashCode, getUnit, getBoolean, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateHeatmap({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const cols = 7, rows = 7;
  const gap = 2.5;
  const cellSize = (S - gap * (cols + 1)) / cols;
  const baseColor = colors[num % range];
  const altColor = colors[(num + 2) % range];

  let inner = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const val = (getUnit(num + idx * 23, 100, idx) + 100) / 200;
      const x = gap + c * (cellSize + gap);
      const y = gap + r * (cellSize + gap);
      const color = getBoolean(num + idx, idx % 5) ? altColor : baseColor;
      const opacity = (0.12 + val * 0.78).toFixed(2);
      inner += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" rx="2" fill="${color}" opacity="${opacity}"/>`;
    }
  }

  const hIdx = num % (rows * cols);
  const hR = Math.floor(hIdx / cols), hC = hIdx % cols;
  const hx = gap + hC * (cellSize + gap);
  const hy = gap + hR * (cellSize + gap);
  inner += `<rect x="${hx.toFixed(1)}" y="${hy.toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" rx="2" fill="none" stroke="rgba(${foreground},0.25)" stroke-width="0.8"/>`;

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
