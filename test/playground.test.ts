import { describe, expect, it } from 'vitest';
import { avatarVariants, defaultPlaygroundVariant, getThemeName, resolveAvatarVariant } from '../site/src/playground.js';

describe('site playground helpers', () => {
  it('keeps explicit variants unchanged', () => {
    expect(resolveAvatarVariant('bar', 'Alice', 0)).toBe('bar');
  });

  it('defaults the site playground to the random variant', () => {
    expect(defaultPlaygroundVariant).toBe('random');
  });

  it('maps light mode to the matching site theme', () => {
    expect(getThemeName(true)).toBe('light');
    expect(getThemeName(false)).toBe('dark');
  });

  it('resolves random variants deterministically to known chart types', () => {
    const names = ['Alice', 'Bob', 'Charlie', 'Delta'];
    const variants = names.map((name, index) => resolveAvatarVariant('random', name, index));

    variants.forEach((variant) => {
      expect(avatarVariants).toContain(variant);
    });
    expect(new Set(variants).size).toBeGreaterThan(1);
    expect(resolveAvatarVariant('random', 'Alice', 0)).toBe(resolveAvatarVariant('random', 'Alice', 0));
  });
});
