import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js', 
    coverage: {
      provider: 'v8', // Or 'v8' if you prefer
      reporter: ['text', 'lcov'], // Generates a text report + an HTML file
      reportsDirectory: 'coverage', // Ensures the directory is created
    },
  }
})