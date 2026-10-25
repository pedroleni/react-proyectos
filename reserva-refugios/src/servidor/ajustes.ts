// Los mandos del servidor simulado: cuánto tarda en contestar y qué le pasa
// a la próxima reserva. Los cambia el panel «Servidor simulado» (con
// npm run dev) y los tests. Es un almacén externo mínimo, como el de la
// lección 46, para que el panel se entere de los cambios.

export type ProximaReserva = 'normal' | 'error-servidor' | 'sin-plazas'

export type Ajustes = {
  /** Milisegundos que tarda cada respuesta. */
  latencia: number
  /** Qué le pasa a la siguiente reserva. Después vuelve a 'normal'. */
  proximaReserva: ProximaReserva
}

const INICIALES: Ajustes = { latencia: 1000, proximaReserva: 'normal' }

let ajustes = INICIALES
const oyentes = new Set<() => void>()

export function leerAjustes(): Ajustes {
  return ajustes
}

export function cambiarAjustes(cambios: Partial<Ajustes>) {
  ajustes = { ...ajustes, ...cambios }
  oyentes.forEach((oyente) => oyente())
}

export function suscribirseAAjustes(oyente: () => void) {
  oyentes.add(oyente)
  return () => {
    oyentes.delete(oyente)
  }
}

/** Lee qué le pasa a esta reserva y deja la siguiente en 'normal'. */
export function gastarProximaReserva(): ProximaReserva {
  const proxima = ajustes.proximaReserva
  if (proxima !== 'normal') cambiarAjustes({ proximaReserva: 'normal' })
  return proxima
}
