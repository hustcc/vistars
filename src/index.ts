import {
  generateBar,
  generateDonut,
  generateRadar,
  generateSparkline,
  generateHeatmap,
  generateTreemap,
  generateBoxplot,
  generateLine,
  generatePie,
  generateArea,
  generateHBar,
  generateScatter,
  generateFunnel,
  generateLiquid,
  generateVenn,
} from './variants/index.js';
import { hashCode, getUnit, fg } from './utilities.js';
import type { AvatarProps, AvatarVariant } from './types.js';

export type { AvatarProps, AvatarVariant };

const DEFAULT_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'];

const VARIANT_GENERATORS: Record<AvatarVariant, (props: AvatarProps) => string> = {
  bar:       generateBar,
  donut:     generateDonut,
  radar:     generateRadar,
  sparkline: generateSparkline,
  heatmap:   generateHeatmap,
  treemap:   generateTreemap,
  boxplot:   generateBoxplot,
  line:      generateLine,
  pie:       generatePie,
  area:      generateArea,
  hbar:      generateHBar,
  scatter:   generateScatter,
  funnel:    generateFunnel,
  liquid:    generateLiquid,
  venn:      generateVenn,
};

function generateFaceOverlay(num: number, light: boolean): string {
  const foreground = fg(light);
  const eyeY = 31 + getUnit(num, 3, 1) * 0.5;
  const eyeOffsetX = 11 + (num % 2);
  const eyeR = 1.7 + (num % 2) * 0.2;
  const mouthY = 47 + getUnit(num, 3, 2) * 0.5;
  const mouthCurve = 4 + (num % 2) * 0.8;
  const mouthWidth = 6 + (num % 3);

  return `<g opacity="0.85"><circle cx="40" cy="40" r="16" fill="rgba(${foreground},0.06)"/><circle cx="${(40 - eyeOffsetX).toFixed(1)}" cy="${eyeY.toFixed(1)}" r="${eyeR.toFixed(1)}" fill="rgba(${foreground},0.45)"/><circle cx="${(40 + eyeOffsetX).toFixed(1)}" cy="${eyeY.toFixed(1)}" r="${eyeR.toFixed(1)}" fill="rgba(${foreground},0.45)"/><path d="M${(40 - mouthWidth).toFixed(1)} ${mouthY.toFixed(1)} Q40 ${(mouthY + mouthCurve).toFixed(1)} ${(40 + mouthWidth).toFixed(1)} ${mouthY.toFixed(1)}" fill="none" stroke="rgba(${foreground},0.45)" stroke-width="1.5" stroke-linecap="round"/></g>`;
}

/**
 * Generate a data visualization style SVG avatar
 * @param props - Avatar configuration options
 * @returns SVG string
 *
 * @example
 * ```ts
 * import vistars from 'vistars';
 *
 * const svg = vistars({ name: 'Alice Johnson', variant: 'bar' });
 *
 * // Use in browser
 * document.getElementById('avatar').innerHTML = svg;
 *
 * // Use in Node.js server-side rendering
 * fs.writeFileSync('avatar.svg', svg);
 * ```
 */
function vistars(props: AvatarProps = {}): string {
  const {
    name = 'Clara Barton',
    colors = DEFAULT_COLORS,
    size = 40,
    square = false,
    light = false,
    variant = 'bar',
  } = props;

  const safeColors = colors.length > 0 ? colors : DEFAULT_COLORS;

  const generator = VARIANT_GENERATORS[variant] ?? generateBar;
  let svg = generator({ name, colors: safeColors, size, square, light });
  const num = hashCode(name);
  const tagEnd = svg.indexOf('>') + 1;
  const inner = svg.slice(tagEnd, svg.lastIndexOf('</svg>'));
  const faceOverlay = generateFaceOverlay(num, light);

  if (!square) {
    const clipId = `vc${num}`;
    svg = svg.slice(0, tagEnd) +
      `<defs><clipPath id="${clipId}"><circle cx="40" cy="40" r="40"/></clipPath></defs>` +
      `<g clip-path="url(#${clipId})">${inner}${faceOverlay}</g></svg>`;
  } else {
    svg = svg.slice(0, tagEnd) + inner + faceOverlay + '</svg>';
  }

  return svg;
}

export { vistars };
export default vistars;
