import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  root: './client',

  // GitHub Pages prod'da lazım, dev'de zararlı
  base: mode === 'production' ? '/digital-shield-project/' : '/',

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
