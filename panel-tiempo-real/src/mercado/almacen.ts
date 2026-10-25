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

  function publicar(nuevo: Mercado) {
    mercado = nuevo
    for (const avisar of oyentes) avisar()
  }

  function recibir(tickers: readonly Ticker[]) {
    // TODO (paso 1): mezcla el lote con lo que ya hay y publica una instantánea nueva.
    // - Recorre los tickers. Para cada uno, busca el par que ya había con su símbolo.
    // - Si el que había es igual de nuevo o más (anterior.actualizado >= ticker.hora),
    //   sáltalo: la foto puede llegar después que el primer mensaje del WebSocket.
    // - Si no, guarda crearPar(ticker, anterior) en una copia de mercado.pares
    //   (new Map(mercado.pares)), hecha una sola vez y solo si algo cambia.
    //   Nunca modifiques un par ni el Map que ya había.
    // - Si nada ha cambiado, no publiques nada. Si algo ha cambiado, publica
    //   { ...mercado, pares, lista: [...pares.values()], ultimaHora, cambiosUltimoLote },
    //   con la hora más reciente de los tickers y cuántos pares han cambiado.
  }

  function cambiarEstado(estado: EstadoConexion) {
    if (estado !== mercado.estado) publicar({ ...mercado, estado })
  }

  function suscribir(avisar: () => void) {
    // TODO (paso 1): apunta a avisar en oyentes y devuelve la función que lo da de baja.
    // - Si la fuente no está abierta, ábrela al suscribirse:
    //   abrir({ alRecibir: recibir, alCambiarEstado: cambiarEstado }) devuelve
    //   la función que la cierra; guárdala.
    // - Al dar de baja al último oyente, no cierres en el acto: programa el
    //   cierre con setTimeout para ESPERA_CIERRE milisegundos después, y vuelve
    //   a dejar mercado = MERCADO_VACIO al cerrar. Si alguien se suscribe antes,
    //   cancela ese cierre (clearTimeout).
    return () => {}
  }

  return {
    suscribir,
    leer: () => mercado,
  }
}
