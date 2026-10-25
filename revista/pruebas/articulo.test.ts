import { describe, expect, it } from 'vitest'
import { loader } from '~/routes/articulo'
import { argumentos } from './peticion'

type Args = Parameters<typeof loader>[0]
const SLUG = 'componer-una-linea-a-mano'

describe('Paso 3: cada artículo, y un 404 de verdad', () => {
  it('el loader da el artículo entero, con su cuerpo', async () => {
    const datos = await loader(argumentos<Args>(`/articulos/${SLUG}`, { slug: SLUG }))
    expect(datos.articulo.titulo).toBe('Componer una línea a mano, letra a letra')
    expect(datos.articulo.cuerpo.length).toBeGreaterThan(0)
  })

  it('un artículo que no existe lanza un data() con estado 404', async () => {
    await expect(loader(argumentos<Args>('/articulos/no-existe', { slug: 'no-existe' }))).rejects.toMatchObject({
      init: { status: 404 },
    })
  })
})

describe('Paso 4: título, descripción y Open Graph', () => {
  it('el loader calcula la URL absoluta de la página y de su imagen', async () => {
    const datos = await loader(argumentos<Args>(`/articulos/${SLUG}`, { slug: SLUG }))
    expect(datos.url).toBe(`http://localhost:5173/articulos/${SLUG}`)
    expect(datos.imagen).toBe(`http://localhost:5173/og/${SLUG}.png`)
  })
})
