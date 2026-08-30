import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  // Inline all JS/CSS into a single self-contained index.html so it can be
  // opened by double-clicking the file (file://) as well as served on the web.
  plugins: [react(), viteSingleFile()],
  // Relative base: assets resolve correctly whether opened via file:// or
  // served from a subpath (e.g. GitHub Pages /diet-dashboard/).
  base: './',
  build: { minify: false }
})
