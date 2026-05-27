import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import vistars from '../src/index.js';

const TEST_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'];
const SNAPSHOT_DIR = path.join(__dirname, 'snapshots');

/**
 * Compare or create SVG snapshot
 */
function matchSnapshot(name: string, svg: string): boolean {
  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  }

  const snapshotPath = path.join(SNAPSHOT_DIR, `${name}.svg`);

  if (!fs.existsSync(snapshotPath)) {
    fs.writeFileSync(snapshotPath, svg, 'utf-8');
    console.log(`  📸 Created snapshot: ${name}.svg`);
    return true;
  }

  const existing = fs.readFileSync(snapshotPath, 'utf-8');

  if (existing !== svg) {
    const failedPath = path.join(SNAPSHOT_DIR, `${name}.failed.svg`);
    fs.writeFileSync(failedPath, svg, 'utf-8');
    throw new Error(
      `Snapshot mismatch for "${name}.svg"\n` +
      `  Expected: ${snapshotPath}\n` +
      `  Received: ${failedPath}\n` +
      `  Delete the snapshot file to regenerate it`
    );
  }

  return true;
}

describe('vistars', () => {
  describe('main API - snapshots', () => {
    it('should generate default avatar (bar)', () => {
      const svg = vistars();
      expect(matchSnapshot('default', svg)).toBe(true);
    });

    it('should generate avatar with custom name', () => {
      const svg = vistars({ name: 'Alice Johnson' });
      expect(matchSnapshot('alice-johnson', svg)).toBe(true);
    });

    it('should handle number size', () => {
      const svg = vistars({ size: 100 });
      expect(matchSnapshot('size-100', svg)).toBe(true);
    });

    it('should handle string size', () => {
      const svg = vistars({ size: '5rem' });
      expect(matchSnapshot('size-5rem', svg)).toBe(true);
    });

    it('should generate bar variant', () => {
      const svg = vistars({ variant: 'bar', colors: TEST_COLORS });
      expect(matchSnapshot('variant-bar', svg)).toBe(true);
    });

    it('should generate donut variant', () => {
      const svg = vistars({ variant: 'donut', colors: TEST_COLORS });
      expect(matchSnapshot('variant-donut', svg)).toBe(true);
    });

    it('should generate radar variant', () => {
      const svg = vistars({ variant: 'radar', colors: TEST_COLORS });
      expect(matchSnapshot('variant-radar', svg)).toBe(true);
    });

    it('should generate sparkline variant', () => {
      const svg = vistars({ variant: 'sparkline', colors: TEST_COLORS });
      expect(matchSnapshot('variant-sparkline', svg)).toBe(true);
    });

    it('should generate heatmap variant', () => {
      const svg = vistars({ variant: 'heatmap', colors: TEST_COLORS });
      expect(matchSnapshot('variant-heatmap', svg)).toBe(true);
    });

    it('should generate treemap variant', () => {
      const svg = vistars({ variant: 'treemap', colors: TEST_COLORS });
      expect(matchSnapshot('variant-treemap', svg)).toBe(true);
    });

    it('should generate boxplot variant', () => {
      const svg = vistars({ variant: 'boxplot', colors: TEST_COLORS });
      expect(matchSnapshot('variant-boxplot', svg)).toBe(true);
    });

    it('should generate line variant', () => {
      const svg = vistars({ variant: 'line', colors: TEST_COLORS });
      expect(matchSnapshot('variant-line', svg)).toBe(true);
    });

    it('should generate pie variant', () => {
      const svg = vistars({ variant: 'pie', colors: TEST_COLORS });
      expect(matchSnapshot('variant-pie', svg)).toBe(true);
    });

    it('should not render center ellipse in pie variant', () => {
      const svg = vistars({ variant: 'pie', colors: TEST_COLORS });
      expect(svg).not.toContain('<ellipse');
    });

    it('should use path stroke separators for consistent pie gaps', () => {
      const svg = vistars({ variant: 'pie', colors: TEST_COLORS });
      expect(svg).not.toContain('<line');
      expect(svg).toContain('stroke-linejoin="round"');
    });

    it('should generate area variant', () => {
      const svg = vistars({ variant: 'area', colors: TEST_COLORS });
      expect(matchSnapshot('variant-area', svg)).toBe(true);
    });

    it('should generate hbar variant', () => {
      const svg = vistars({ variant: 'hbar', colors: TEST_COLORS });
      expect(matchSnapshot('variant-hbar', svg)).toBe(true);
    });

    it('should generate scatter variant', () => {
      const svg = vistars({ variant: 'scatter', colors: TEST_COLORS });
      expect(matchSnapshot('variant-scatter', svg)).toBe(true);
    });

    it('should generate funnel variant', () => {
      const svg = vistars({ variant: 'funnel', colors: TEST_COLORS });
      expect(matchSnapshot('variant-funnel', svg)).toBe(true);
    });

    it('should generate liquid variant', () => {
      const svg = vistars({ variant: 'liquid', colors: TEST_COLORS });
      expect(matchSnapshot('variant-liquid', svg)).toBe(true);
    });

    it('should generate venn variant', () => {
      const svg = vistars({ variant: 'venn', colors: TEST_COLORS });
      expect(matchSnapshot('variant-venn', svg)).toBe(true);
    });

    it('should apply square mask', () => {
      const svg = vistars({ square: true });
      expect(matchSnapshot('square', svg)).toBe(true);
    });

    it('should apply light mode', () => {
      const svg = vistars({ light: true });
      expect(matchSnapshot('light', svg)).toBe(true);
    });

    it('should generate with all options', () => {
      const svg = vistars({
        name: 'Grace Hopper',
        colors: TEST_COLORS,
        size: 80,
        square: false,
        light: false,
        variant: 'bar',
      });
      expect(matchSnapshot('full-options', svg)).toBe(true);
    });
  });

  describe('deterministic generation', () => {
    it('should generate identical SVGs for same name and colors', () => {
      const svg1 = vistars({ name: 'Alice', colors: TEST_COLORS, variant: 'bar' });
      const svg2 = vistars({ name: 'Alice', colors: TEST_COLORS, variant: 'bar' });
      expect(svg1).toBe(svg2);
    });

    it('should generate different SVGs for different names', () => {
      const svg1 = vistars({ name: 'Alice', colors: TEST_COLORS, variant: 'bar' });
      const svg2 = vistars({ name: 'Bob', colors: TEST_COLORS, variant: 'bar' });
      expect(svg1).not.toBe(svg2);
    });
  });

  describe('SVG structure validation', () => {
    it('should generate valid SVG structure', () => {
      const svg = vistars();
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('viewBox');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('should respect size option', () => {
      const svg = vistars({ size: 128 });
      expect(svg).toContain('128');
    });

    it('should return a non-empty string', () => {
      const svg = vistars({ name: 'Test' });
      expect(typeof svg).toBe('string');
      expect(svg.length).toBeGreaterThan(0);
    });
  });
});
