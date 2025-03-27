import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Make sure to build assets to 'dist' folder (this is standard for Vite)
  build: {
    outDir: 'dist',
  },
  // Configure proxy for development
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})