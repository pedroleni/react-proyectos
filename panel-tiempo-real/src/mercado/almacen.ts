// El almacén del mercado: guarda la última instantánea, avisa a quien se
// suscribe y abre la fuente solo mientras alguien escucha. Es el estado.js
// del proyecto de JavaScript con las dos reglas de useSyncExternalStore:
// subscribe devuelve la función que da de baja, y leer() devuelve siempre
// el mismo objeto mientras nada cambie (lección 46).

import type { AbrirFuente, EstadoConexion, Mercado, Par, Ticker } from './tipos'

export const PUNTOS_HISTORIAL = 60
// Cuánto se espera, con nadie escuchando, antes de cerrar la conexión.
export const ESPERA_CIERRE = 1000

export interface AlmacenMercado {
  suscribir(avisar: () => void): () => void
  leer(): Mercado
}

const MERCADO_VACIO: Mercado = {
  pares: new Map(),
  lista: [],
  estado: 'conectando',
  ultimaHora: null,
  cambiosUltimoLote: 0,
}

export function crearPar(ticker: Ticker, anterior?: Par): Par {
  const { simbolo, precio, apertura } = ticker
  let historial: readonly number[] = [precio]
  let tendencia: Par['tendencia'] = 'igual'

  if (anterior) {
    // Un precio repetido no añade nada al gráfico ni cambia la tendencia.
    historial =
      precio === anterior.precio ? anterior.historial : [...anterior.historial, precio].slice(-PUNTOS_HISTORIAL)
    tendencia = precio > anterior.precio ? 'sube' : precio < anterior.precio ? 'baja' : anterior.tendencia
  }

  return {
    simbolo,
    base: simbolo.slice(0, -4),
    precio,
    maximo: ticker.maximo,
    minimo: ticker.minimo,
    volumen: ticker.volumen,
    variacion: apertura === 0 ? 0 : ((precio - apertura) / apertura) * 100,
    historial,
    tendencia,
    actualizado: ticker.hora,
  }
}

export function crearAlmacenMercado(abrir: AbrirFuente): AlmacenMercado {
  let mercado = MERCADO_VACIO
  const oyentes = new Set<() => void>()
  let cerrar: (() => void) | null = null
  let cierrePendiente: ReturnType<typeof setTimeout> | undefined

  function publicar(nuevo: Mercado) {
    mercado = nuevo
    for (const avisar of oyentes) avisar()
  }

  function recibir(tickers: readonly Ticker[]) {
    // Un Map nuevo solo si algo cambia. Los pares que no llegan en el lote
    // conservan su objeto, y su historial, tal cual: así se puede saber, sin
    // mirar dentro, que su fila no ha cambiado.
    let pares: Map<string, Par> | null = null
    let cambios = 0
    let ultimaHora = mercado.ultimaHora

    for (const ticker of tickers) {
      const anterior = (pares ?? mercado.pares).get(ticker.simbolo)
      // La foto puede llegar después que el primer mensaje del WebSocket:
      // un dato más viejo que el que ya tenemos no pisa nada.
      if (anterior && anterior.actualizado >= ticker.hora) continue
      pares ??= new Map(mercado.pares)
      pares.set(ticker.simbolo, crearPar(ticker, anterior))
      cambios++
      ultimaHora = Math.max(ultimaHora ?? 0, ticker.hora)
    }

    if (pares === null) return
    publicar({ ...mercado, pares, lista: [...pares.values()], ultimaHora, cambiosUltimoLote: cambios })
  }

  function cambiarEstado(estado: EstadoConexion) {
    if (estado !== mercado.estado) publicar({ ...mercado, estado })
  }

  function suscribir(avisar: () => void) {
    oyentes.add(avisar)
    clearTimeout(cierrePendiente)
    cerrar ??= abrir({ alRecibir: recibir, alCambiarEstado: cambiarEstado })

    return () => {
      oyentes.delete(avisar)
      if (oyentes.size > 0) return
      // No se cierra en el acto: StrictMode da de baja y vuelve a suscribir
      // enseguida (lección 63), y cerrar un WebSocket que aún se está abriendo
      // deja un error en la consola. Si en un segundo nadie vuelve, se cierra.
      cierrePendiente = setTimeout(() => {
        cerrar?.()
        cerrar = null
        mercado = MERCADO_VACIO
      }, ESPERA_CIERRE)
    }
  }

  return {
    suscribir,
    leer: () => mercado,
  }
}
