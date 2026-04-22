import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/trpc': {
        target: 'http://localhost:6060',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:6060',
        changeOrigin: true,
      },
    },
  },
})
