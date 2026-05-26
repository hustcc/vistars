import { hashCode, getUnit, getBoolean, getDigit, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateBoxplot({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const pad = 12;
  const boxCount = 3 + num % 3;
  const plotH = S - pad * 2, plotW = S - pad * 2;
  const boxGap = 4;
  const boxW = (plotW - boxGap * (boxCount + 1)) / boxCount;

  let inner = '';
  for (let i = 0; i <= 4; i++) {
    const y = pad + (plotH / 4) * i;
    inner += `<line x1="${pad}" y1="${y.toFixed(1)}" x2="${S - pad}" y2="${y.toFixed(1)}" stroke="rgba(${foreground},0.06)" stroke-width="0.5"/>`;
  }

  for (let i = 0; i < boxCount; i++) {
    const x = pad + boxGap + i * (boxW + boxGap);
    const color = colors[(num + i * 3) % range];
    const seed = num + i * 47;

    const spread = 0.3 + (getUnit(seed + 1, 70, 0) + 70) / 100 * 0.55;
    const center = 0.25 + (getUnit(seed + 10, 50, 5) + 50) / 100 * 0.5;
    const halfSpread = spread / 2;
    const iqrRatio = 0.2 + (getUnit(seed + 2, 60, 1) + 60) / 100 * 0.5;
    const medOffset = (getUnit(seed + 3, 80, 2) + 80) / 100 * 0.6 - 0.3;

    let minR = center - halfSpread, maxR = center + halfSpread;
    if (minR < 0.03) { minR = 0.03; maxR = Math.min(minR + spread, 0.97); }
    if (maxR > 0.97) { maxR = 0.97; minR = Math.max(maxR - spread, 0.03); }

    let q1R = center - halfSpread * iqrRatio;
    let q3R = center + halfSpread * iqrRatio;
    let medianR = (q1R + q3R) / 2 + medOffset * (q3R - q1R);
    medianR = Math.max(q1R + 0.02, Math.min(q3R - 0.02, medianR));

    const minY = pad + plotH * (1 - maxR);
    const q1Y  = pad + plotH * (1 - q3R);
    const medY = pad + plotH * (1 - medianR);
    const q3Y  = pad + plotH * (1 - q1R);
    const maxY = pad + plotH * (1 - minR);
    const cx   = x + boxW / 2;

    inner += `<line x1="${cx.toFixed(1)}" y1="${minY.toFixed(1)}" x2="${cx.toFixed(1)}" y2="${q1Y.toFixed(1)}" stroke="${color}" stroke-width="1" opacity="0.5"/>`;
    inner += `<line x1="${(cx - boxW * 0.3).toFixed(1)}" y1="${minY.toFixed(1)}" x2="${(cx + boxW * 0.3).toFixed(1)}" y2="${minY.toFixed(1)}" stroke="${color}" stroke-width="1" opacity="0.5"/>`;
    inner += `<line x1="${cx.toFixed(1)}" y1="${q3Y.toFixed(1)}" x2="${cx.toFixed(1)}" y2="${maxY.toFixed(1)}" stroke="${color}" stroke-width="1" opacity="0.5"/>`;
    inner += `<line x1="${(cx - boxW * 0.3).toFixed(1)}" y1="${maxY.toFixed(1)}" x2="${(cx + boxW * 0.3).toFixed(1)}" y2="${maxY.toFixed(1)}" stroke="${color}" stroke-width="1" opacity="0.5"/>`;

    const boxH = q3Y - q1Y;
    inner += `<rect x="${x.toFixed(1)}" y="${q1Y.toFixed(1)}" width="${boxW.toFixed(1)}" height="${Math.max(boxH, 2).toFixed(1)}" rx="2" fill="${color}" opacity="0.3" stroke="${color}" stroke-width="1" stroke-opacity="0.7"/>`;
    inner += `<line x1="${(x + 2).toFixed(1)}" y1="${medY.toFixed(1)}" x2="${(x + boxW - 2).toFixed(1)}" y2="${medY.toFixed(1)}" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.9"/>`;

    const outCount = getDigit(seed, 4) % 3;
    for (let o = 0; o < outCount; o++) {
      const outAbove = getBoolean(seed + o, 6 + o);
      const outDist = 0.04 + (getUnit(seed + o * 11 + 7, 15, 5 + o) + 15) / 100 * 0.08;
      const outR = outAbove ? maxR + outDist : minR - outDist;
      if (outR > 0.02 && outR < 0.98) {
        const outY = pad + plotH * (1 - outR);
        const outX = cx + (getUnit(seed + o * 13, 6, 3 + o) - 3) * 1.5;
        inner += `<circle cx="${outX.toFixed(1)}" cy="${outY.toFixed(1)}" r="1.5" fill="${color}" opacity="0.6"/>`;
      }
    }
  }
  inner += `<line x1="${pad}" y1="${(S - pad).toFixed(1)}" x2="${(S - pad).toFixed(1)}" y2="${(S - pad).toFixed(1)}" stroke="rgba(${foreground},0.1)" stroke-width="0.5"/>`;

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
