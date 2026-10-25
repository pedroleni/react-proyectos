/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      // La app y los tests importan el kit de '@kit'. Con --mode radix
      // (paso 7), '@kit' pasa a ser la versión hecha con Radix.
      '@kit': fileURLToPath(new URL(mode === 'radix' ? './src/radix' : './src/kit', import.meta.url)),
    },
  },
  build: {
    outDir: mode === 'radix' ? 'dist-radix' : 'dist',
  },
  test: {
    environment: 'jsdom',
    // Con globals, Testing Library desmonta lo de cada test al terminar (lección 83).
    globals: true,
    setupFiles: './src/pruebas/preparacion.ts',
  },
}))
