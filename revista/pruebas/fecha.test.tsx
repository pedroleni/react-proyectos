import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'
import FechaPublicacion from '~/componentes/FechaPublicacion'

const FECHA = '2026-10-21T09:30:00+02:00'
const zonaOriginal = process.env.TZ

afterEach(() => {
  process.env.TZ = zonaOriginal
})

describe('Paso 7: la hora de publicación, igual en los dos lados', () => {
  it('el servidor en UTC y un lector en Madrid pintan la misma fecha, y la hidratación no encuentra diferencias', async () => {
    // El servidor de producción, en UTC, genera el HTML...
    process.env.TZ = 'UTC'
    const html = renderToString(<FechaPublicacion fecha={FECHA} />)

    // ...y un navegador en Madrid lo hidrata.
    process.env.TZ = 'Europe/Madrid'
    const contenedor = document.createElement('div')
    contenedor.innerHTML = html
    document.body.append(contenedor)
    const errores: string[] = []
    await act(async () => {
      hydrateRoot(contenedor, <FechaPublicacion fecha={FECHA} />, {
        onRecoverableError: (error) => errores.push(String(error)),
      })
    })

    expect(errores).toEqual([])
    expect(contenedor.textContent).toBe('21 de octubre de 2026 a las 9:30')
    contenedor.remove()
  })
})
