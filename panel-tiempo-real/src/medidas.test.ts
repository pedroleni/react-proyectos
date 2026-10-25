import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { leerResumen, registrarRender, suscribirCadaSegundo } from './medidas'

describe('las medidas del Profiler (paso 5)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'performance'] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('no cuenta el montaje y resume cada segundo los commits de los últimos 10 segundos', () => {
    const avisar = vi.fn()
    const darDeBaja = suscribirCadaSegundo(avisar)

    // Los mismos seis argumentos que React le pasa a onRender.
    registrarRender('Tabla', 'mount', 40, 40, 0, performance.now())
    registrarRender('Tabla', 'update', 4, 9, 0, performance.now())
    registrarRender('Tabla', 'update', 6, 9, 0, performance.now())
    vi.advanceTimersByTime(1000)

    expect(avisar).toHaveBeenCalledTimes(1)
    expect(leerResumen()).toEqual({ commits: 2, mediaReal: 5, maximaReal: 6, mediaBase: 9 })

    // Pasados diez segundos sin commits, ya no queda nada que resumir.
    vi.advanceTimersByTime(11_000)
    expect(leerResumen()).toBeNull()
    darDeBaja()
  })
})
