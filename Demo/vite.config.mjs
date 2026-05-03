import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const frameworkSrc = fileURLToPath(
  new URL('../Framework/src', import.meta.url)
);

export default defineConfig({
  server: {
    port: 5000
  },
  root: './',
  base: '/',
  publicDir: './public',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@framework': frameworkSrc
    }
  }
});
