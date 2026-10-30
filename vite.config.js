import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// The production build is ONE self-contained index.html (JS, CSS and fonts inlined).
// That is what lets the app hand out per-family offline invitation files.
// base './' keeps GitHub Pages sub-paths and Vercel working.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
});
