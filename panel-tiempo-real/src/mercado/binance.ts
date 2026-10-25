// La fuente real: los datos públicos de mercado de Binance, sin clave.
// Una petición con la foto de todos los pares y un WebSocket que, cada
// segundo, manda los que han cambiado. No sabe nada de React.

import type { AbrirFuente, Ticker } from './tipos'

const URL_FOTO = 'https://data-api.binance.vision/api/v3/ticker/24hr?type=MINI&symbolStatus=TRADING'
const URL_STREAM = 'wss://data-stream.binance.vision/ws/!miniTicker@arr'
const MONEDA = 'USDT'
const ESPERA_MAXIMA = 30_000

// Así llega cada par en la foto (GET /api/v3/ticker/24hr?type=MINI)...
interface MiniTickerRest {
  symbol: string
  openPrice: string
  highPrice: string
  lowPrice: string
  lastPrice: string
  quoteVolume: string
  closeTime: number
}

// ...y así en cada mensaje del stream !miniTicker@arr.
interface MiniTickerStream {
  E: number // hora del evento
  s: string // símbolo
  c: string // último precio
  o: string // precio de hace 24 horas
  h: string
  l: string
  q: string // volumen en la moneda de cotización (USDT)
}

export function desdeFoto(t: MiniTickerRest): Ticker {
  return {
    simbolo: t.symbol,
    precio: Number(t.lastPrice),
    apertura: Number(t.openPrice),
    maximo: Number(t.highPrice),
    minimo: Number(t.lowPrice),
    volumen: Number(t.quoteVolume),
    hora: t.closeTime,
  }
}

export function desdeStream(t: MiniTickerStream): Ticker {
  return {
    simbolo: t.s,
    precio: Number(t.c),
    apertura: Number(t.o),
    maximo: Number(t.h),
    minimo: Number(t.l),
    volumen: Number(t.q),
    hora: t.E,
  }
}

export const abrirBinance: AbrirFuente = ({ alRecibir, alCambiarEstado }) => {
  let socket = null as WebSocket | null
  let cerrada = false
  let intentos = 0
  let reintento: ReturnType<typeof setTimeout> | undefined
  const controlador = new AbortController()

  // 1. La foto: todos los pares de golpe, una sola vez.
  fetch(URL_FOTO, { signal: controlador.signal })
    .then((respuesta) => {
      if (!respuesta.ok) throw new Error(`Binance respondió con el estado ${respuesta.status}`)
      return respuesta.json() as Promise<MiniTickerRest[]>
    })
    .then((datos) => alRecibir(datos.filter((t) => t.symbol.endsWith(MONEDA)).map(desdeFoto)))
    .catch(() => {
      // Sin foto no se rompe nada: los pares van llegando por el WebSocket.
    })

  // 2. Los cambios: un mensaje por segundo con los pares que se han movido.
  function conectar() {
    socket = new WebSocket(URL_STREAM)

    socket.onopen = () => {
      intentos = 0
      alCambiarEstado('en-directo')
    }

    socket.onmessage = (evento: MessageEvent<string>) => {
      const lote = JSON.parse(evento.data) as MiniTickerStream[]
      alRecibir(lote.filter((t) => t.s.endsWith(MONEDA)).map(desdeStream))
    }

    // Binance corta cada conexión a las 24 horas, y la red se cae a veces:
    // si no la hemos cerrado nosotros, se vuelve a abrir esperando cada vez más.
    socket.onclose = () => {
      if (cerrada) return
      alCambiarEstado('reconectando')
      const espera = Math.min(1000 * 2 ** intentos, ESPERA_MAXIMA)
      intentos++
      reintento = setTimeout(conectar, espera)
    }
  }

  conectar()

  return () => {
    cerrada = true
    clearTimeout(reintento)
    controlador.abort()
    socket?.close()
  }
}
