import { z } from 'zod'
import { IDS_REFUGIOS } from './refugios'

// Un solo esquema para toda la reserva. Los pasos del formulario y el
// servidor recortarán de aquí lo que necesiten.
//
// TODO (paso 1): de momento cada campo solo dice su tipo, y los mensajes
// de error salen en inglés. Añade a cada uno sus reglas y su mensaje:
// - refugio: uno de IDS_REFUGIOS → 'Elige un refugio.'
// - llegada: una fecha (con abort: true) → 'Elige el día de llegada.', y
//   con .refine(), entre primeraLlegada() y ultimaLlegada() (de ./fechas) →
//   `Se reserva desde mañana y hasta ${DIAS_DE_ANTELACION} días vista.`
// - noches: entero de 1 a 3 → 'Elige cuántas noches.', 'Como mínimo, una
//   noche.', 'Como máximo, tres noches seguidas.'
// - personas: entero de 1 a 12 → 'Escribe cuántas personas sois.', 'Tiene
//   que ser un número entero.', 'Como mínimo, una persona.', 'Para más de
//   12 personas, llama al refugio.'
// - nombre: recortado, 2 letras o más → 'Escribe el nombre de quien hace la reserva.'
// - correo: 'Ese correo no parece válido.'
// - telefono: recortado, /^[6789]\d{8}$/ → 'Nueve cifras, sin prefijo ni espacios.'
// - federados: entero, 0 o más → 'Escribe cuántos tenéis licencia (0 si
//   nadie).', 'Tiene que ser un número entero.', 'No puede ser negativo.'
// - observaciones: recortado, 300 caracteres como mucho → 'Como mucho, 300 caracteres.'
// - acepto: 'Para reservar, tienes que aceptar las normas del refugio.'
export const camposReserva = z.object({
  refugio: z.enum(IDS_REFUGIOS),
  llegada: z.iso.date(),
  noches: z.coerce.number(),
  personas: z.coerce.number(),
  nombre: z.string(),
  correo: z.email(),
  telefono: z.string(),
  federados: z.coerce.number(),
  observaciones: z.string().default(''),
  acepto: z.literal('on'),
})

export type CampoReserva = keyof typeof camposReserva.shape

// TODO (paso 1): la regla que cruza dos pasos: no puede haber más federados
// que personas ('No puede haber más federados que personas en el grupo.',
// en el campo federados). Escríbela aparte, como una función y sus opciones,
// para ponerla con .refine() en los esquemas que tengan los dos campos.

// TODO (paso 1): cada paso, recortado de camposReserva con .pick():
// - esquemaPasoRefugio: refugio, llegada, noches y personas.
// - esquemaPasoGrupo: personas, nombre, correo, telefono, federados y
//   observaciones, con la regla de los federados.
// - esquemaConfirmacion: acepto.
// - esquemaReserva: todos los campos, con la regla de los federados.
export const esquemaPasoRefugio = camposReserva
export const esquemaPasoGrupo = camposReserva
export const esquemaConfirmacion = camposReserva
export const esquemaReserva = camposReserva

export type DatosReserva = z.infer<typeof esquemaReserva>
