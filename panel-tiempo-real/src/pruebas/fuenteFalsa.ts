// Una fuente de mentira para los tests: no abre ninguna conexión y deja que
// el test decida qué llega y cuándo.

import type { AbrirFuente, Avisos, EstadoConexion, Ticker } from '../mercado/tipos'

export function crearFuenteFalsa() {
  let avisos: Avisos | null = null
  const registro = { aperturas: 0, cierres: 0 }

  const abrir: AbrirFuente = (nuevosAvisos) => {
    avisos = nuevosAvisos
    registro.aperturas++
    return () => {
      registro.cierres++
      avisos = null
    }
  }

  return {
    abrir,
    registro,
    enviar(tickers: Ticker[]) {
      if (!avisos) throw new Error('La fuente no está abierta: nadie se ha suscrito al almacén')
      avisos.alRecibir(tickers)
    },
    cambiarEstado(estado: EstadoConexion) {
      if (!avisos) throw new Error('La fuente no está abierta: nadie se ha suscrito al almacén')
      avisos.alCambiarEstado(estado)
    },
  }
}

// Un ticker con valores por defecto razonables: cada test escribe solo lo que le importa.
export function ticker(simbolo: string, precio: number, otros: Partial<Ticker> = {}): Ticker {
  return {
    simbolo,
    precio,
    apertura: precio,
    maximo: precio,
    minimo: precio,
    volumen: 1_000_000,
    hora: 1,
    ...otros,
  }
}
