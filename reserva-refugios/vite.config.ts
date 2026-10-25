/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { msw } from 'msw/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // msw() sirve el service worker de MSW con npm run dev y prepara el
  // módulo virtual:msw que usa main.tsx. En el build no hace nada.
  plugins: [react(), msw()],
  test: {
    environment: 'jsdom',
    // Con globals, Testing Library desmonta lo de cada test al terminar (lección 83).
    globals: true,
    setupFiles: './src/pruebas/preparacion.ts',
    // La misma zona horaria en cualquier ordenador: las fechas de los tests no bailan.
    env: { TZ: 'Europe/Madrid' },
  },
})
