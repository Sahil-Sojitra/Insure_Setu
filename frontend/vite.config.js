import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://insure-setu-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  esbuild: {
    target: 'es2020'
  }
})
