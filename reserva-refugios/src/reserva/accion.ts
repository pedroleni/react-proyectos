import type { CampoReserva } from './esquema'
import { formatearFecha } from './fechas'
import type { EstadoReserva, Noche, PasoConFormulario, Valores } from './tipos'

// Una sola acción para todo el formulario.
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
  // TODO (paso 3): «Ver plazas y seguir».
  // 1. Valida estado.valores con esquemaPasoRefugio (safeParse). Si no pasa,
  //    devuelve el estado con errores: z.flattenError(error).fieldErrors.
  // 2. Pide las noches con pedirDisponibilidad(datos) (de ./api). Si lanza,
  //    devuelve un aviso: 'No se ha podido consultar la disponibilidad.
  //    Inténtalo otra vez en un momento.'
  // 3. Si alguna noche tiene menos plazas libres que personas, devuelve el
  //    error en personas con mensajeSinPlazas(noche).
  // 4. Si todo va bien: paso 'grupo', los datos validados añadidos a
  //    estado.datos y las noches.
  return estado
}

function revisarGrupo(estado: EstadoReserva): EstadoReserva {
  // TODO (paso 3): «Seguir». Valida estado.valores con esquemaPasoGrupo
  // (fíjate en que valores trae también las personas del paso 1). Con
  // errores, devuélvelos; si no, paso 'confirmar' y los datos añadidos.
  return estado
}

async function confirmar(estado: EstadoReserva): Promise<EstadoReserva> {
  // TODO (paso 3): «Confirmar reserva».
  // 1. Valida la reserva entera con esquemaReserva. Con errores, devuélvelos.
  // 2. Envíala con enviarReserva(resultado.data) (de ./api) y, según el tipo
  //    de la respuesta:
  //    - 'confirmada': paso 'hecha', con sus noches y su reserva.
  //    - 'sin-plazas': las noches de la respuesta (las de verdad) y el aviso
  //      `${respuesta.mensaje} Vuelve atrás para cambiar la fecha, el
  //      refugio o el número de personas.`
  //    - 'rechazada': el aviso `El servidor no ha aceptado la reserva: ` con
  //      todos los mensajes de respuesta.errores detrás, separados por espacios.
  //    - 'error': el aviso 'No se ha podido confirmar la reserva y no se ha
  //      guardado nada. Inténtalo otra vez.'
  return estado
}
