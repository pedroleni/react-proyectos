import type { CampoReserva, DatosReserva } from './esquema'

export type PasoConFormulario = 'refugio' | 'grupo' | 'confirmar'
export type Paso = PasoConFormulario | 'hecha'

/** Lo escrito en los campos, tal cual llega del formulario: siempre texto. */
export type Valores = Partial<Record<CampoReserva, string>>

/** Los mensajes de error de cada campo, como los da z.flattenError(). */
export type Errores = Partial<Record<CampoReserva, string[]>>

/** Una noche en un refugio, según el servidor. */
export type Noche = {
  fecha: string
  plazas: number
  libres: number
  /** Solo en la vista optimista: las plazas que se están reservando. */
  retenidas?: number
}

export type ReservaConfirmada = DatosReserva & {
  localizador: string
  importe: number
}

export type EstadoReserva = {
  paso: Paso
  /** Lo que se ha escrito en todos los pasos, para devolvérselo a los campos. */
  valores: Valores
  /** Lo ya validado, con sus tipos (números, fechas...). */
  datos: Partial<DatosReserva>
  /** Los errores del último envío. */
  errores: Errores
  /** Un problema que no es de ningún campo: el servidor ha fallado, por ejemplo. */
  aviso: string | null
  /** Las plazas de verdad, las que ha dicho el servidor. */
  noches: Noche[]
  reserva: ReservaConfirmada | null
}
