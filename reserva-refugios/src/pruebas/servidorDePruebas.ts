import { setupServer } from 'msw/node'
import { manejadores } from '../servidor/manejadores'

// Los mismos manejadores que responden en el navegador con npm run dev,
// ahora dentro de Node para los tests (lección 84).
export const servidor = setupServer(...manejadores)
