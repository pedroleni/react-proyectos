// Cuánto tarda cada petición en el servidor, con un middleware. El middleware
// solo se ejecuta en el servidor, y nada de esto tiene que llegar al navegador.
import { createContext, type MiddlewareFunction } from 'react-router'

/** Lo que tarda cada parte de una petición, en milisegundos: «cartas», «total»... */
export type Tiempos = Map<string, number>

// El sitio del context donde el middleware deja los tiempos de cada petición.
// Vale null si no hay middleware: por ejemplo, en un test que llama a un loader.
export const tiemposContext = createContext<Tiempos | null>(null)

/** Ejecuta una tarea y apunta lo que ha tardado, con su nombre. */
export async function medir<T>(tiempos: Tiempos | null, nombre: string, tarea: () => Promise<T>): Promise<T> {
  const inicio = performance.now()
  try {
    return await tarea()
  } finally {
    tiempos?.set(nombre, performance.now() - inicio)
  }
}

/**
 * Envuelve cada petición que llega a React Router, de documento o de datos.
 * TODO (paso 10): antes de next(), apunta cuándo empieza y deja en el context
 * un Map vacío para los tiempos (context.set(tiemposContext, …)). Después,
 * con la respuesta que devuelve next(): apunta el total, pon la cabecera
 * Server-Timing con un decimal ('cartas;dur=0.4, total;dur=6.2'), escribe una
 * línea en la terminal ('GET /articulos/… → 200 · cartas;dur=0.4, total;dur=6.2')
 * y devuelve la respuesta.
 */
export const registrarTiempos: MiddlewareFunction<Response> = (_, next) => next()
