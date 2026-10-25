// Todo lo que las animaciones comparten, en un solo sitio: los tipos de
// transición, las clases de transiciones.css y los nombres de los
// elementos compartidos.

/** Los dos tipos de transición de la app: hacia la derecha o hacia la izquierda. */
export const ADELANTE = 'adelante'
export const ATRAS = 'atras'
export type Direccion = typeof ADELANTE | typeof ATRAS

/** Al entrar, según el tipo; sin tipo, sin animación propia. */
export const ENTRADA = {
  [ADELANTE]: 'entra-por-la-derecha',
  [ATRAS]: 'entra-por-la-izquierda',
  default: 'none',
}

/** Al salir, según el tipo; sin tipo, sin animación propia. */
export const SALIDA = {
  [ADELANTE]: 'sale-por-la-izquierda',
  [ATRAS]: 'sale-por-la-derecha',
  default: 'none',
}

/**
 * Un name por foto: dos ViewTransition con el mismo name montados a la vez
 * son un error, así que cada foto lleva el suyo, con un prefijo propio.
 */
export function nombreFoto(id: string): string {
  return `foto-${id}`
}

/** La raya de la pestaña activa: solo hay una montada a la vez. */
export const NOMBRE_INDICADOR = 'indicador-pestana'
