import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const isAndroid = process.env.CAPACITOR === 'true';

export default defineConfig({
  // GitHub Pages -> /GameZone-frontend/
  // Android (Capacitor) -> ./
  base: isAndroid ? './' : '/GameZone-frontend/',

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},

    // Prevent Vite from watching generated Android files
    fs: {
      deny: ['android/**'],
    },
  },
});