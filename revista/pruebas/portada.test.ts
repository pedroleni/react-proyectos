import { describe, expect, it } from 'vitest'
import { loader } from '~/routes/portada'
import { argumentos } from './peticion'

type Args = Parameters<typeof loader>[0]

describe('Paso 2: la portada, con datos del servidor', () => {
  it('el loader da los seis artículos, del más reciente al más antiguo', async () => {
    const { articulos } = await loader(argumentos<Args>('/'))
    expect(articulos.map((a) => a.slug)).toEqual([
      'caja-alta-y-caja-baja',
      'un-punto-no-es-un-pixel',
      'componer-una-linea-a-mano',
      'las-comillas-que-pide-la-ortografia',
      'joaquin-ibarra-el-impresor-de-zaragoza',
      'la-raya-no-es-un-guion',
    ])
  })

  it('la portada no recibe el cuerpo de los artículos: lo que devuelve el loader viaja entero al navegador', async () => {
    const { articulos } = await loader(argumentos<Args>('/'))
    expect(articulos.length).toBeGreaterThan(0)
    for (const articulo of articulos) expect(articulo).not.toHaveProperty('cuerpo')
  })
})
