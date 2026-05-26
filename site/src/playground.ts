import type { AvatarVariant } from 'vistars';

export const avatarVariants: AvatarVariant[] = [
  'bar',
  'donut',
  'radar',
  'sparkline',
  'heatmap',
  'treemap',
  'boxplot',
  'line',
  'pie',
  'area',
  'hbar',
  'scatter',
  'funnel',
  'liquid',
  'venn',
];

export type PlaygroundVariant = AvatarVariant | 'random';

export function resolveAvatarVariant(variant: PlaygroundVariant, name: string, index: number): AvatarVariant {
  if (variant !== 'random') return variant;

  let hash = index;
  const seed = `${index}:${name}`;

  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }

  return avatarVariants[Math.abs(hash) % avatarVariants.length];
}
