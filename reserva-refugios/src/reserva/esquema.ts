import { z } from 'zod'
import { DIAS_DE_ANTELACION, primeraLlegada, ultimaLlegada } from './fechas'
import { IDS_REFUGIOS } from './refugios'

// Paso 1 de la lección: un solo esquema para toda la reserva.
//
// Cada campo, con sus reglas y sus mensajes, una sola vez. Los pasos del
// formulario y el servidor recortan de aquí lo que necesitan, así que no
// pueden contradecirse: si cambias una regla, cambia en todos los sitios.
export const camposReserva = z.object({
  // Paso «Refugio y fechas»
  refugio: z.enum(IDS_REFUGIOS, 'Elige un refugio.'),
  // abort: si no es una fecha, no tiene sentido mirar si está en plazo
  llegada: z.iso
    .date({ error: 'Elige el día de llegada.', abort: true })
    .refine(
      (fecha) => fecha >= primeraLlegada() && fecha <= ultimaLlegada(),
      `Se reserva desde mañana y hasta ${DIAS_DE_ANTELACION} días vista.`,
    ),
  noches: z.coerce
    .number({ error: 'Elige cuántas noches.' })
    .int()
    .min(1, 'Como mínimo, una noche.')
    .max(3, 'Como máximo, tres noches seguidas.'),
  personas: z.coerce
    .number({ error: 'Escribe cuántas personas sois.' })
    .int('Tiene que ser un número entero.')
    .min(1, 'Como mínimo, una persona.')
    .max(12, 'Para más de 12 personas, llama al refugio.'),

  // Paso «Quién viene»
  nombre: z.string().trim().min(2, 'Escribe el nombre de quien hace la reserva.'),
  correo: z.email('Ese correo no parece válido.'),
  telefono: z
    .string()
    .trim()
    .regex(/^[6789]\d{8}$/, 'Nueve cifras, sin prefijo ni espacios.'),
  federados: z.coerce
    .number({ error: 'Escribe cuántos tenéis licencia (0 si nadie).' })
    .int('Tiene que ser un número entero.')
    .min(0, 'No puede ser negativo.'),
  observaciones: z.string().trim().max(300, 'Como mucho, 300 caracteres.').default(''),

  // Paso «Revisar y confirmar»: una casilla marcada llega como 'on' (lección 57)
  acepto: z.literal('on', 'Para reservar, tienes que aceptar las normas del refugio.'),
})

export type CampoReserva = keyof typeof camposReserva.shape

// Una regla que cruza dos campos de pasos distintos: las personas se
// eligen en el primer paso y los federados en el segundo. Va aparte porque
// .pick() no funciona sobre un esquema que ya lleva un .refine().
function federadosCaben(datos: { personas: number; federados: number }) {
  return datos.federados <= datos.personas
}
const errorFederados = {
  message: 'No puede haber más federados que personas en el grupo.',
  path: ['federados'],
}

/** Lo que se comprueba al pulsar «Ver plazas y seguir». */
export const esquemaPasoRefugio = camposReserva.pick({
  refugio: true,
  llegada: true,
  noches: true,
  personas: true,
})

/** Lo que se comprueba al pulsar «Seguir» en «Quién viene». Lleva las
 * personas del paso anterior para poder comparar con los federados. */
export const esquemaPasoGrupo = camposReserva
  .pick({
    personas: true,
    nombre: true,
    correo: true,
    telefono: true,
    federados: true,
    observaciones: true,
  })
  .refine(federadosCaben, errorFederados)

/** La casilla del último paso. */
export const esquemaConfirmacion = camposReserva.pick({ acepto: true })

/** La reserva entera: la comprueba la acción antes de enviarla y el
 * servidor al recibirla. */
export const esquemaReserva = camposReserva.refine(federadosCaben, errorFederados)

export type DatosReserva = z.infer<typeof esquemaReserva>
