import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import HaceCuanto from '~/componentes/HaceCuanto'

const FECHA = '2026-10-21T09:30:00+02:00'

function Firma() {
  return (
    <p>
      Inés Lasheras
      <HaceCuanto fecha={FECHA} />
    </p>
  )
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] })
})
afterEach(() => {
  vi.useRealTimers()
})

/** Genera el HTML «en el servidor» en un instante y lo hidrata en otro. */
async function hidratarDespues(generado: string, leido: string) {
  vi.setSystemTime(new Date(generado))
  const html = renderToString(<Firma />)

  vi.setSystemTime(new Date(leido))
  const contenedor = document.createElement('div')
  contenedor.innerHTML = html
  document.body.append(contenedor)
  const errores: string[] = []
  await act(async () => {
    hydrateRoot(contenedor, <Firma />, { onRecoverableError: (error) => errores.push(String(error)) })
  })
  return { html, contenedor, errores }
}

describe('Paso 9: «hace dos días», solo en el navegador', () => {
  it('el servidor no escribe cuánto hace: no sabe cuándo se va a leer la página', () => {
    vi.setSystemTime(new Date('2026-10-21T12:30:00+02:00'))
    expect(renderToString(<HaceCuanto fecha={FECHA} />)).toBe('')
  })

  it('un HTML generado hace dos días se hidrata sin errores, y después dice «anteayer»', async () => {
    const { contenedor, errores } = await hidratarDespues('2026-10-21T12:30:00+02:00', '2026-10-23T10:00:00+02:00')
    expect(errores).toEqual([])
    expect(contenedor.textContent).toBe('Inés Lasheras · anteayer')
    contenedor.remove()
  })

  it('cada minuto se pone al día', async () => {
    const { contenedor } = await hidratarDespues('2026-10-21T10:00:00+02:00', '2026-10-21T10:29:10+02:00')
    expect(contenedor.textContent).toBe('Inés Lasheras · hace 59 minutos')
    await act(async () => {
      vi.advanceTimersByTime(60_000)
    })
    expect(contenedor.textContent).toBe('Inés Lasheras · hace 1 hora')
    contenedor.remove()
  })
})
