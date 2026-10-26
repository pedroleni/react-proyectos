import { RouterContextProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { middleware } from '~/root'
import { loader } from '~/routes/articulo'
import { registrarTiempos, tiemposContext, type Tiempos } from '~/tiempos.server'
import { argumentos } from './peticion'

type ArgsMiddleware = Parameters<typeof registrarTiempos>[0]
type ArgsLoader = Parameters<typeof loader>[0]
const SLUG = 'la-raya-no-es-un-guion'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Paso 10: cuánto tarda cada petición, con un middleware', () => {
  it('root.tsx exporta el middleware, que así envuelve todas las rutas', () => {
    expect(middleware).toContain(registrarTiempos)
  })

  it('lo que apuntan los loader en el context sale en la cabecera Server-Timing, con el total', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const context = new RouterContextProvider()
    // next() hace de React Router: ejecuta el loader (que apunta sus tiempos) y da la respuesta.
    const respuesta = await registrarTiempos(argumentos<ArgsMiddleware>(`/articulos/${SLUG}`, {}, undefined, context), async () => {
      context.get(tiemposContext)?.set('cartas', 2.5)
      return new Response('<!DOCTYPE html>…', { status: 200 })
    })

    expect(respuesta?.status).toBe(200)
    expect(respuesta?.headers.get('Server-Timing')).toMatch(/^cartas;dur=2\.5, total;dur=\d+\.\d$/)
    expect(log).toHaveBeenCalledWith(expect.stringMatching(`^GET /articulos/${SLUG} → 200 · cartas;dur=2.5, total;dur=`))
  })

  it('el loader del artículo apunta lo que tarda en leer las cartas', async () => {
    const tiempos: Tiempos = new Map()
    const context = new RouterContextProvider()
    context.set(tiemposContext, tiempos)
    await loader(argumentos<ArgsLoader>(`/articulos/${SLUG}`, { slug: SLUG }, undefined, context))
    expect(tiempos.get('cartas')).toBeTypeOf('number')
  })
})
