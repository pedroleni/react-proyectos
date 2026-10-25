import { z } from 'zod'
import { enviarReserva, pedirDisponibilidad } from './api'
import { esquemaPasoGrupo, esquemaPasoRefugio, esquemaReserva, type CampoReserva } from './esquema'
import { formatearFecha } from './fechas'
import type { EstadoReserva, Noche, PasoConFormulario, Valores } from './tipos'

// Paso 3 de la lección: una sola acción para todo el formulario.
//
// useActionState la llama con el estado anterior y el FormData del paso que
// se acaba de enviar. Según el paso y el botón pulsado, valida con su
// trozo del esquema, pide al servidor lo que haga falta y devuelve el estado
// siguiente. Un fallo esperado nunca se lanza: se devuelve (lección 58).

export const ESTADO_INICIAL: EstadoReserva = {
  paso: 'refugio',
  valores: { noches: '1', personas: '2', federados: '0' },
  datos: {},
  errores: {},
  aviso: null,
  noches: [],
  reserva: null,
}

/** Los campos que tiene el formulario de cada paso. */
export const CAMPOS_DEL_PASO: Record<PasoConFormulario, CampoReserva[]> = {
  refugio: ['refugio', 'llegada', 'noches', 'personas'],
  grupo: ['nombre', 'correo', 'telefono', 'federados', 'observaciones'],
  confirmar: ['acepto'],
}

const PASO_ANTERIOR = { grupo: 'refugio', confirmar: 'grupo' } as const

/** Los campos del paso, como texto. Una casilla sin marcar no viaja en el
 * FormData (lección 57): queda como undefined y borra la marca anterior. */
function leerPaso(paso: PasoConFormulario, formData: FormData): Valores {
  return Object.fromEntries(
    CAMPOS_DEL_PASO[paso].map((campo) => {
      const valor = formData.get(campo)
      return [campo, typeof valor === 'string' ? valor : undefined]
    }),
  )
}

export async function avanzar(estado: EstadoReserva, formData: FormData): Promise<EstadoReserva> {
  // «Hacer otra reserva»: desde el principio
  if (estado.paso === 'hecha') return ESTADO_INICIAL

  // Lo escrito en este paso se guarda siempre, también al volver atrás:
  // si vuelves, lo encontrarás como lo dejaste (lección 61).
  const siguiente: EstadoReserva = {
    ...estado,
    valores: { ...estado.valores, ...leerPaso(estado.paso, formData) },
    errores: {},
    aviso: null,
  }

  if (formData.get('intencion') === 'atras' && estado.paso !== 'refugio') {
    return { ...siguiente, paso: PASO_ANTERIOR[estado.paso] }
  }

  switch (estado.paso) {
    case 'refugio':
      return comprobarPlazas(siguiente)
    case 'grupo':
      return revisarGrupo(siguiente)
    case 'confirmar':
      return confirmar(siguiente)
  }
}

/** El error de «Personas» cuando alguna noche no tiene sitio para todos. */
export function mensajeSinPlazas(noche: Noche) {
  const fecha = formatearFecha(noche.fecha)
  if (noche.libres === 0) return `Está completo la noche del ${fecha}. Prueba con otra fecha o con otro refugio.`
  if (noche.libres === 1) return `La noche del ${fecha} solo queda 1 plaza.`
  return `La noche del ${fecha} solo quedan ${noche.libres} plazas.`
}

async function comprobarPlazas(estado: EstadoReserva): Promise<EstadoReserva> {
  const resultado = esquemaPasoRefugio.safeParse(estado.valores)
  if (!resultado.success) {
    return { ...estado, errores: z.flattenError(resultado.error).fieldErrors }
  }
  const datos = resultado.data

  // Las plazas dependen del servidor: ninguna regla de Zod las sabe.
  let noches: Noche[]
  try {
    noches = await pedirDisponibilidad(datos)
  } catch {
    return { ...estado, aviso: 'No se ha podido consultar la disponibilidad. Inténtalo otra vez en un momento.' }
  }
  const corta = noches.find((noche) => noche.libres < datos.personas)
  if (corta) {
    return { ...estado, errores: { personas: [mensajeSinPlazas(corta)] } }
  }

  return { ...estado, paso: 'grupo', datos: { ...estado.datos, ...datos }, noches }
}

function revisarGrupo(estado: EstadoReserva): EstadoReserva {
  // valores trae también las personas del paso anterior: la regla de los
  // federados las necesita.
  const resultado = esquemaPasoGrupo.safeParse(estado.valores)
  if (!resultado.success) {
    return { ...estado, errores: z.flattenError(resultado.error).fieldErrors }
  }
  return { ...estado, paso: 'confirmar', datos: { ...estado.datos, ...resultado.data } }
}

async function confirmar(estado: EstadoReserva): Promise<EstadoReserva> {
  // La reserva entera, con el mismo esquema que usará el servidor
  const resultado = esquemaReserva.safeParse(estado.valores)
  if (!resultado.success) {
    return { ...estado, errores: z.flattenError(resultado.error).fieldErrors }
  }

  const respuesta = await enviarReserva(resultado.data)
  switch (respuesta.tipo) {
    case 'confirmada':
      return { ...estado, paso: 'hecha', noches: respuesta.noches, reserva: respuesta.reserva }
    case 'sin-plazas':
      // Las plazas de verdad sustituyen a las que se vieron en el paso 1
      return {
        ...estado,
        noches: respuesta.noches,
        aviso: `${respuesta.mensaje} Vuelve atrás para cambiar la fecha, el refugio o el número de personas.`,
      }
    case 'rechazada':
      return {
        ...estado,
        aviso: `El servidor no ha aceptado la reserva: ${Object.values(respuesta.errores).flat().join(' ')}`,
      }
    case 'error':
      return { ...estado, aviso: 'No se ha podido confirmar la reserva y no se ha guardado nada. Inténtalo otra vez.' }
  }
}
