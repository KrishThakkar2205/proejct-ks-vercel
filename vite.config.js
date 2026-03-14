import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Required for Capacitor: assets must use relative paths (file:// WebView)
  base: './',
  build: {
    outDir: 'dist',
  },
})
