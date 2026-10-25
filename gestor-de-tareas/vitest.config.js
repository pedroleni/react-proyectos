import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// La misma configuración de la lección 83: un DOM simulado (jsdom), las
// funciones de Vitest como globales (así Testing Library desmonta lo que
// monta cada test) y un archivo de preparación que se ejecuta antes de
// cada archivo de tests.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setup.js',
  },
})
