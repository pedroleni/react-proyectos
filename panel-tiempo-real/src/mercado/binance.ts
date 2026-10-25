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
    // TODO (paso 2): abre el WebSocket de URL_STREAM y guárdalo en socket.
    // - onopen: pon intentos a 0 y avisa con alCambiarEstado('en-directo').
    // - onmessage: evento.data es un texto JSON con un array de MiniTickerStream.
    //   Quédate con los que acaban en MONEDA, conviértelos con desdeStream y
    //   pásalos a alRecibir de una vez.
    // - onclose: si la has cerrado tú (cerrada), no hagas nada. Si no, avisa
    //   con 'reconectando' y vuelve a llamar a conectar con setTimeout, tras
    //   1 s, 2 s, 4 s... (1000 * 2 ** intentos, como mucho ESPERA_MAXIMA).
    //   Guarda el temporizador en reintento.
  }

  conectar()

  return () => {
    cerrada = true
    clearTimeout(reintento)
    controlador.abort()
    socket?.close()
  }
}
