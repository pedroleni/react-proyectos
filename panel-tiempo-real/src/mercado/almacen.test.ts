import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { crearFuenteFalsa, ticker } from '../pruebas/fuenteFalsa'
import { ESPERA_CIERRE, PUNTOS_HISTORIAL, crearAlmacenMercado, crearPar } from './almacen'

describe('crearPar', () => {
  it('calcula la variación respecto a hace 24 horas y el nombre de la moneda', () => {
    const par = crearPar(ticker('BTCUSDT', 110, { apertura: 100 }))
    expect(par.base).toBe('BTC')
    expect(par.variacion).toBeCloseTo(10)
    expect(par.historial).toEqual([110])
    expect(par.tendencia).toBe('igual')
  })

  it('añade el precio nuevo al historial y dice hacia dónde se ha movido', () => {
    const antes = crearPar(ticker('BTCUSDT', 100, { hora: 1 }))
    const despues = crearPar(ticker('BTCUSDT', 99, { hora: 2 }), antes)
    expect(despues.historial).toEqual([100, 99])
    expect(despues.tendencia).toBe('baja')
    expect(antes.historial).toEqual([100]) // el par anterior no se ha tocado
  })

  it(`guarda como mucho ${PUNTOS_HISTORIAL} precios`, () => {
    let par = crearPar(ticker('BTCUSDT', 0, { hora: 0 }))
    for (let i = 1; i <= 100; i++) par = crearPar(ticker('BTCUSDT', i, { hora: i }), par)
    expect(par.historial).toHaveLength(PUNTOS_HISTORIAL)
    expect(par.historial.at(-1)).toBe(100)
  })
})

describe('almacén del mercado (paso 1)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('no abre la fuente hasta que alguien se suscribe', () => {
    const fuente = crearFuenteFalsa()
    const almacen = crearAlmacenMercado(fuente.abrir)
    expect(fuente.registro.aperturas).toBe(0)

    almacen.suscribir(() => {})
    expect(fuente.registro.aperturas).toBe(1)
  })

  it('avisa a los suscritos con cada lote y les da una instantánea nueva', () => {
    const fuente = crearFuenteFalsa()
    const almacen = crearAlmacenMercado(fuente.abrir)
    const avisar = vi.fn()
    almacen.suscribir(avisar)
    const antes = almacen.leer()

    fuente.enviar([ticker('BTCUSDT', 81000), ticker('ETHUSDT', 2400)])

    expect(avisar).toHaveBeenCalledTimes(1)
    expect(almacen.leer()).not.toBe(antes)
    expect(almacen.leer().lista.map((par) => par.simbolo)).toEqual(['BTCUSDT', 'ETHUSDT'])
    expect(almacen.leer().cambiosUltimoLote).toBe(2)
  })

  it('devuelve el mismo objeto mientras no llega nada', () => {
    const fuente = crearFuenteFalsa()
    const almacen = crearAlmacenMercado(fuente.abrir)
    almacen.suscribir(() => {})
    fuente.enviar([ticker('BTCUSDT', 81000)])

    // Es lo que useSyncExternalStore comprueba con Object.is (lección 46).
    expect(almacen.leer()).toBe(almacen.leer())
  })

  it('conserva el mismo objeto para los pares que no cambian', () => {
    const fuente = crearFuenteFalsa()
    const almacen = crearAlmacenMercado(fuente.abrir)
    almacen.suscribir(() => {})
    fuente.enviar([ticker('BTCUSDT', 81000), ticker('ETHUSDT', 2400)])
    const btcAntes = almacen.leer().pares.get('BTCUSDT')
    const ethAntes = almacen.leer().pares.get('ETHUSDT')

    fuente.enviar([ticker('ETHUSDT', 2410, { hora: 2 })])

    // El mismo objeto, y el mismo historial: así la fila de BTC se puede saltar.
    expect(almacen.leer().pares.get('BTCUSDT')).toBe(btcAntes)
    expect(almacen.leer().pares.get('ETHUSDT')).not.toBe(ethAntes)
    expect(almacen.leer().pares.get('ETHUSDT')?.precio).toBe(2410)
    expect(ethAntes?.precio).toBe(2400) // nada se modifica en su sitio
  })

  it('no deja que un dato más viejo pise uno más nuevo', () => {
    const fuente = crearFuenteFalsa()
    const almacen = crearAlmacenMercado(fuente.abrir)
    almacen.suscribir(() => {})
    fuente.enviar([ticker('BTCUSDT', 81000, { hora: 2000 })]) // el primer mensaje del WebSocket

    fuente.enviar([ticker('BTCUSDT', 80000, { hora: 1500 }), ticker('ETHUSDT', 2400, { hora: 1500 })]) // la foto, que llega tarde

    expect(almacen.leer().pares.get('BTCUSDT')?.precio).toBe(81000)
    expect(almacen.leer().pares.get('ETHUSDT')?.precio).toBe(2400)
  })

  it('cuenta el estado de la conexión y solo avisa si cambia', () => {
    const fuente = crearFuenteFalsa()
    const almacen = crearAlmacenMercado(fuente.abrir)
    const avisar = vi.fn()
    almacen.suscribir(avisar)
    expect(almacen.leer().estado).toBe('conectando')

    fuente.cambiarEstado('en-directo')
    fuente.cambiarEstado('en-directo')

    expect(almacen.leer().estado).toBe('en-directo')
    expect(avisar).toHaveBeenCalledTimes(1)
  })

  it('da de baja al oyente y cierra la fuente un segundo después de que se vaya el último', () => {
    const fuente = crearFuenteFalsa()
    const almacen = crearAlmacenMercado(fuente.abrir)
    const avisar = vi.fn()
    const darDeBaja = almacen.suscribir(avisar)

    darDeBaja()
    expect(fuente.registro.cierres).toBe(0)
    vi.advanceTimersByTime(ESPERA_CIERRE)
    expect(fuente.registro.cierres).toBe(1)
    expect(avisar).not.toHaveBeenCalled()
  })

  it('no cierra la conexión si alguien vuelve a suscribirse enseguida, como hace StrictMode', () => {
    const fuente = crearFuenteFalsa()
    const almacen = crearAlmacenMercado(fuente.abrir)

    const darDeBaja = almacen.suscribir(() => {})
    darDeBaja()
    almacen.suscribir(() => {})
    vi.advanceTimersByTime(ESPERA_CIERRE * 5)

    expect(fuente.registro.aperturas).toBe(1)
    expect(fuente.registro.cierres).toBe(0)
  })
})
