import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // './' makes the built site work from any folder, including GitHub Pages project URLs
  // (https://USERNAME.github.io/REPO/). Without it, assets load from "/assets/..." and break there.
  base: './',
  build: { outDir: 'dist' },
  server: {
    port: 3000,
    host: true
  }
});
