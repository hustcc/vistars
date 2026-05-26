export const hashCode = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const getDigit = (number: number, ntn: number): number =>
  Math.floor((number / Math.pow(10, ntn)) % 10);

export const getUnit = (number: number, range: number, index?: number): number => {
  const value = number % range;
  if (index !== undefined && getDigit(number, index) % 2 === 0) return -value;
  return value;
};

export const getBoolean = (number: number, ntn: number): boolean =>
  getDigit(number, ntn) % 2 === 0;

export const getRandomColor = (number: number, colors: string[], range: number): string =>
  colors[number % range];

export const normalizeSize = (size: number | string | undefined): string => {
  if (size === undefined) return '40px';
  if (typeof size === 'number') return `${size}px`;
  return size;
};

export const bg = (light: boolean): string => light ? '#f1f5f9' : '#141824';
export const fg = (light: boolean): string => light ? '0,0,0' : '255,255,255';
