export type AvatarVariant =
  | 'bar'
  | 'donut'
  | 'radar'
  | 'line'
  | 'heatmap'
  | 'treemap'
  | 'boxplot'
  | 'pie'
  | 'area'
  | 'column'
  | 'scatter'
  | 'funnel'
  | 'liquid'
  | 'venn';

export interface AvatarProps {
  /** The name to generate the avatar from */
  name?: string;
  /** Array of colors to use in the avatar */
  colors?: string[];
  /** Size of the avatar in pixels */
  size?: number | string;
  /** Make the avatar square instead of round */
  square?: boolean;
  /** Chart variant style */
  variant?: AvatarVariant;
  /** Use light background (default: dark) */
  light?: boolean;
}
