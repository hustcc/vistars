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
import { hashCode } from './utilities.js';
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

  if (!square) {
    const num = hashCode(name);
    const clipId = `vc${num}`;
    const tagEnd = svg.indexOf('>') + 1;
    const inner = svg.slice(tagEnd, svg.lastIndexOf('</svg>'));
    svg = svg.slice(0, tagEnd) +
      `<defs><clipPath id="${clipId}"><circle cx="40" cy="40" r="40"/></clipPath></defs>` +
      `<g clip-path="url(#${clipId})">${inner}</g></svg>`;
  }

  return svg;
}

export { vistars };
export default vistars;
