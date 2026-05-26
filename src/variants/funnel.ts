import { hashCode, getUnit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateFunnel({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const pad = 8, cx = S / 2;
  const stages = 3 + num % 3;
  const maxW = S - pad * 2;

  const stageRatios = [1.0];
  const stageHeights: number[] = [];
  let totalH = 0;
  for (let i = 0; i < stages; i++) {
    const prev = stageRatios[stageRatios.length - 1];
    const narrow = 0.5 + (getUnit(num + i * 31, 40, i) + 40) / 100 * 0.4;
    stageRatios.push(Math.max(prev * narrow, 0.08));
    const hw = 0.6 + (getUnit(num + i * 23, 50, i + 3) + 50) / 100 * 0.8;
    stageHeights.push(hw); totalH += hw;
  }

  const plotH = S - pad * 2;
  const leanPerStage = (getUnit(num + 77, 20, 0) - 10) / 100 * 6;
  let y = pad;
  let inner = '';

  for (let i = 0; i < stages; i++) {
    const topW = maxW * stageRatios[i];
    const botW = maxW * stageRatios[i + 1];
    const sh = (stageHeights[i] / totalH) * plotH;
    const color = colors[(num + i * 2) % range];
    const opacity = (0.85 - i * 0.08).toFixed(2);
    const to = leanPerStage * i, bo = leanPerStage * (i + 1);
    inner += `<polygon points="${(cx - topW / 2 + to).toFixed(1)},${y.toFixed(1)} ${(cx + topW / 2 + to).toFixed(1)},${y.toFixed(1)} ${(cx + botW / 2 + bo).toFixed(1)},${(y + sh).toFixed(1)} ${(cx - botW / 2 + bo).toFixed(1)},${(y + sh).toFixed(1)}" fill="${color}" opacity="${opacity}"/>`;
    if (i > 0) {
      inner += `<line x1="${(cx - topW / 2 + to).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(cx + topW / 2 + to).toFixed(1)}" y2="${y.toFixed(1)}" stroke="${background}" stroke-width="1.5"/>`;
    }
    y += sh;
  }

  inner += `<line x1="${pad}" y1="${pad}" x2="${pad}" y2="${(S - pad).toFixed(1)}" stroke="rgba(${foreground},0.04)" stroke-width="0.5"/>`;
  inner += `<line x1="${S - pad}" y1="${pad}" x2="${S - pad}" y2="${(S - pad).toFixed(1)}" stroke="rgba(${foreground},0.04)" stroke-width="0.5"/>`;

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
