import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  // BASE_URL env var can be set to override the default base path
  // Default is '/' for custom domain deployment
  base: process.env.BASE_URL || '/',
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
