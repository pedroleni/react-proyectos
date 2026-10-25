import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { abrirBinance } from './binance'

// Un WebSocket de mentira: guarda cada conexión que se abre para que el test
// pueda abrirla, mandarle mensajes o cortarla.
class WebSocketFalso {
  static abiertos: WebSocketFalso[] = []
  onopen: (() => void) | null = null
  onmessage: ((evento: { data: string }) => void) | null = null
  onclose: (() => void) | null = null
  cerrado = false
  url: string

  constructor(url: string) {
    this.url = url
    WebSocketFalso.abiertos.push(this)
  }

  close() {
    this.cerrado = true
    this.onclose?.()
  }

  // Lo que haría el servidor:
  abrir() {
    this.onopen?.()
  }
  mandar(datos: unknown) {
    this.onmessage?.({ data: JSON.stringify(datos) })
  }
  cortar() {
    this.onclose?.()
  }
}

function miniTicker(s: string, c: string, E = 1000) {
  return { e: '24hrMiniTicker', E, s, c, o: '100', h: '120', l: '90', v: '5', q: '123456.78' }
}

describe('la fuente de Binance (paso 2)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    WebSocketFalso.abiertos = []
    vi.stubGlobal('WebSocket', WebSocketFalso)
    // La foto inicial no llega nunca: aquí solo se prueba el WebSocket.
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('se conecta al stream de todos los pares y avisa al abrirse', () => {
    const alCambiarEstado = vi.fn()
    abrirBinance({ alRecibir: vi.fn(), alCambiarEstado })

    expect(WebSocketFalso.abiertos).toHaveLength(1)
    expect(WebSocketFalso.abiertos[0].url).toBe('wss://data-stream.binance.vision/ws/!miniTicker@arr')
    WebSocketFalso.abiertos[0].abrir()
    expect(alCambiarEstado).toHaveBeenCalledWith('en-directo')
  })

  it('se queda con los pares en USDT y convierte los textos en números', () => {
    const alRecibir = vi.fn()
    abrirBinance({ alRecibir, alCambiarEstado: vi.fn() })

    WebSocketFalso.abiertos[0].mandar([miniTicker('BTCUSDT', '81616.5'), miniTicker('ETHBTC', '0.029')])

    expect(alRecibir).toHaveBeenCalledWith([
      { simbolo: 'BTCUSDT', precio: 81616.5, apertura: 100, maximo: 120, minimo: 90, volumen: 123456.78, hora: 1000 },
    ])
  })

  it('si se corta la conexión, vuelve a conectarse esperando cada vez más', () => {
    const alCambiarEstado = vi.fn()
    abrirBinance({ alRecibir: vi.fn(), alCambiarEstado })

    WebSocketFalso.abiertos[0].cortar()
    expect(alCambiarEstado).toHaveBeenLastCalledWith('reconectando')
    vi.advanceTimersByTime(999)
    expect(WebSocketFalso.abiertos).toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(WebSocketFalso.abiertos).toHaveLength(2) // al segundo

    WebSocketFalso.abiertos[1].cortar()
    vi.advanceTimersByTime(1999)
    expect(WebSocketFalso.abiertos).toHaveLength(2)
    vi.advanceTimersByTime(1)
    expect(WebSocketFalso.abiertos).toHaveLength(3) // a los dos segundos

    // Una conexión que llega a abrirse pone la espera otra vez a cero.
    WebSocketFalso.abiertos[2].abrir()
    WebSocketFalso.abiertos[2].cortar()
    vi.advanceTimersByTime(1000)
    expect(WebSocketFalso.abiertos).toHaveLength(4)
  })

  it('al cerrarla, cierra el WebSocket y no vuelve a conectarse', () => {
    const alCambiarEstado = vi.fn()
    const cerrar = abrirBinance({ alRecibir: vi.fn(), alCambiarEstado })

    cerrar()
    vi.advanceTimersByTime(60_000)

    expect(WebSocketFalso.abiertos[0].cerrado).toBe(true)
    expect(WebSocketFalso.abiertos).toHaveLength(1)
    expect(alCambiarEstado).not.toHaveBeenCalledWith('reconectando')
  })
})
