import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/AITI/',
  plugins: [react()],
  build: {
    target: ['safari15', 'chrome100', 'edge100'],
    cssTarget: ['safari15', 'chrome100', 'edge100'],
    assetsInlineLimit: 0,
    manifest: true,
  },
})
