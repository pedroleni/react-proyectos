import type { DatosReserva } from './esquema'
import type { Errores, Noche, ReservaConfirmada } from './tipos'

// Las dos peticiones de la aplicación. No saben si al otro lado hay un
// servidor de verdad o MSW: piden /api/... y leen la respuesta.

type ConsultaDisponibilidad = Pick<DatosReserva, 'refugio' | 'llegada' | 'noches'>

export async function pedirDisponibilidad({ refugio, llegada, noches }: ConsultaDisponibilidad): Promise<Noche[]> {
  const parametros = new URLSearchParams({ refugio, llegada, noches: String(noches) })
  const respuesta = await fetch(`/api/disponibilidad?${parametros}`)
  if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`)
  const cuerpo: { noches: Noche[] } = await respuesta.json()
  return cuerpo.noches
}

export type RespuestaReserva =
  | { tipo: 'confirmada'; reserva: ReservaConfirmada; noches: Noche[] }
  | { tipo: 'sin-plazas'; mensaje: string; noches: Noche[] }
  | { tipo: 'rechazada'; errores: Errores }
  | { tipo: 'error' }

// Un fallo esperado (sin plazas, datos rechazados, el servidor caído) no se
// lanza: se devuelve como un resultado más, y la acción decide qué enseñar
// (lecciones 58 y 62).
export async function enviarReserva(datos: DatosReserva): Promise<RespuestaReserva> {
  let respuesta: Response
  try {
    respuesta = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
  } catch {
    return { tipo: 'error' }
  }

  if (respuesta.status === 201) {
    const cuerpo: { reserva: ReservaConfirmada; noches: Noche[] } = await respuesta.json()
    return { tipo: 'confirmada', ...cuerpo }
  }
  if (respuesta.status === 409) {
    const cuerpo: { error: string; noches: Noche[] } = await respuesta.json()
    return { tipo: 'sin-plazas', mensaje: cuerpo.error, noches: cuerpo.noches }
  }
  if (respuesta.status === 422) {
    const cuerpo: { errores: Errores } = await respuesta.json()
    return { tipo: 'rechazada', errores: cuerpo.errores }
  }
  return { tipo: 'error' }
}
