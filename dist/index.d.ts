import { AvatarProps, AvatarVariant } from './types.js';
export type { AvatarProps, AvatarVariant };
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
declare function vistars(props?: AvatarProps): string;
export { vistars };
export default vistars;
