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
 * Antes de next(), deja en el context dónde apuntar los tiempos; después, con
 * la respuesta ya hecha, añade el total, la cabecera Server-Timing y una línea
 * en la terminal.
 */
export const registrarTiempos: MiddlewareFunction<Response> = async ({ request, context }, next) => {
  const inicio = performance.now()
  const tiempos: Tiempos = new Map()
  context.set(tiemposContext, tiempos)

  const respuesta = await next()

  tiempos.set('total', performance.now() - inicio)
  const cabecera = [...tiempos].map(([nombre, ms]) => `${nombre};dur=${ms.toFixed(1)}`).join(', ')
  respuesta.headers.set('Server-Timing', cabecera)
  console.log(`${request.method} ${new URL(request.url).pathname} → ${respuesta.status} · ${cabecera}`)
  return respuesta
}
