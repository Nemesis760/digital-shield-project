import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'



export default defineConfig(({ mode }) => ({
  plugins: [react()],
  root: './client',

  // GitHub Pages prod'da gerekli
  base: mode === 'production' ? '/digital-detective-academy/' : '/',

  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
}))
