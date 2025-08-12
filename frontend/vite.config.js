import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all interfaces for external access
    port: 3000,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'd3312o90ut997k.cloudfront.net', // VS Code CloudFront host
      '.cloudfront.net', // Allow all CloudFront hosts
      '.amazonaws.com' // Allow AWS hosts
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  }
})
