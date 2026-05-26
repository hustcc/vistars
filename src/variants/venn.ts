import { hashCode, bg, fg } from '../utilities.js';
import type { AvatarProps } from '../types.js';

export function generateVenn({ name = '', colors = [], size = 40, light = false }: AvatarProps): string {
  const num = hashCode(name);
  const range = colors.length;
  const S = 80;
  const background = bg(light);
  const foreground = fg(light);
  const cx = S / 2, cy = S / 2;
  const circleCount = 2 + num % 2;
  const R = circleCount === 2 ? 22 : 18;
  const spread = circleCount === 2 ? 10 : 8;

  let inner = '';

  if (circleCount === 2) {
    const c1x = cx - spread, c1y = cy - 2;
    const c2x = cx + spread, c2y = cy + 2;
    const color1 = colors[num % range];
    const color2 = colors[(num + 2) % range];
    inner += `<circle cx="${c1x}" cy="${c1y}" r="${R}" fill="${color1}" opacity="0.35"/>`;
    inner += `<circle cx="${c2x}" cy="${c2y}" r="${R}" fill="${color2}" opacity="0.35"/>`;
    inner += `<circle cx="${c1x}" cy="${c1y}" r="${R}" fill="none" stroke="${color1}" stroke-width="1" opacity="0.5"/>`;
    inner += `<circle cx="${c2x}" cy="${c2y}" r="${R}" fill="none" stroke="${color2}" stroke-width="1" opacity="0.5"/>`;
  } else {
    const angles = [-90, 30, 150];
    for (let i = 0; i < 3; i++) {
      const a = angles[i] * Math.PI / 180;
      const ccx = cx + Math.cos(a) * spread;
      const ccy = cy + Math.sin(a) * spread;
      const color = colors[(num + i) % range];
      inner += `<circle cx="${ccx.toFixed(1)}" cy="${ccy.toFixed(1)}" r="${R}" fill="${color}" opacity="0.3"/>`;
      inner += `<circle cx="${ccx.toFixed(1)}" cy="${ccy.toFixed(1)}" r="${R}" fill="none" stroke="${color}" stroke-width="1" opacity="0.45"/>`;
    }
  }

  inner += `<circle cx="${cx}" cy="${cy}" r="2" fill="rgba(${foreground},0.3)"/>`;

  return `<svg viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${S}" height="${S}" fill="${background}"/>${inner}</svg>`;
}
