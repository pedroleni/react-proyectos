/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // Con globals, Testing Library desmonta lo de cada test al terminar (lección 83).
    globals: true,
    setupFiles: './src/pruebas/preparacion.ts',
  },
})
