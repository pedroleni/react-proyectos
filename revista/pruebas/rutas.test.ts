import { describe, expect, it } from 'vitest'
import rutas from '~/routes'

describe('Paso 1: las rutas', () => {
  it('la portada está en / y cada artículo en /articulos/:slug', () => {
    expect(rutas).toContainEqual(expect.objectContaining({ index: true, file: 'routes/portada.tsx' }))
    expect(rutas).toContainEqual(expect.objectContaining({ path: 'articulos/:slug', file: 'routes/articulo.tsx' }))
  })

  it('cualquier otra dirección va a la página «no encontrada»', () => {
    expect(rutas).toContainEqual(expect.objectContaining({ path: '*', file: 'routes/no-encontrada.tsx' }))
  })
})
