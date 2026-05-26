import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  // BASE_URL env var can be set to override the default base path
  // Default is '/vistars/' for GitHub Pages deployment
  base: process.env.BASE_URL || '/vistars/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      'vistars': resolve(__dirname, '../src/index.ts'),
    },
  },
});
