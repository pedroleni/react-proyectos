// Los tipos del mercado: lo que llega de la fuente (Ticker), lo que pinta la
// tabla (Par) y la instantánea que guarda el almacén (Mercado).

/** Un par tal como llega de la fuente, ya convertido a números. */
export interface Ticker {
  simbolo: string // 'BTCUSDT'
  precio: number // el último precio
  apertura: number // el precio de hace 24 horas
  maximo: number // el máximo de las últimas 24 horas
  minimo: number // el mínimo de las últimas 24 horas
  volumen: number // lo negociado en 24 horas, en USDT
  hora: number // cuándo lo calculó Binance, en milisegundos
}

export type Tendencia = 'sube' | 'baja' | 'igual'

/** Una fila de la tabla. Nunca se modifica: si algo cambia, es otro objeto. */
export interface Par {
  readonly simbolo: string
  readonly base: string // 'BTC'
  readonly precio: number
  readonly maximo: number
  readonly minimo: number
  readonly volumen: number
  readonly variacion: number // % respecto a hace 24 horas
  readonly historial: readonly number[] // los últimos precios recibidos
  readonly tendencia: Tendencia // respecto al precio anterior
  readonly actualizado: number
}

export type EstadoConexion = 'conectando' | 'en-directo' | 'reconectando'

/** La instantánea que devuelve el almacén. Tampoco se modifica nunca. */
export interface Mercado {
  readonly pares: ReadonlyMap<string, Par>
  readonly lista: readonly Par[] // los mismos pares, en un array estable
  readonly estado: EstadoConexion
  readonly ultimaHora: number | null // la hora del último lote recibido
  readonly cambiosUltimoLote: number
}

/** Lo que una fuente le cuenta al almacén. */
export interface Avisos {
  alRecibir(tickers: readonly Ticker[]): void
  alCambiarEstado(estado: EstadoConexion): void
}

/** Abre una fuente de datos y devuelve la función que la cierra. */
export type AbrirFuente = (avisos: Avisos) => () => void
