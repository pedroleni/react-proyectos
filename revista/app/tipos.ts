// Los tipos que comparten el servidor y el navegador. Un archivo sin datos ni
// código: importarlo desde un componente no arrastra nada al navegador.

export type Seccion = 'Oficio' | 'Historia' | 'Ortotipografía' | 'Pantalla'

export type Articulo = {
  slug: string
  titulo: string
  /** El resumen de la portada, y la descripción para buscadores y tarjetas. */
  entradilla: string
  seccion: Seccion
  autoria: string
  /** Fecha y hora de publicación, en ISO 8601 con su desfase horario. */
  publicado: string
  cuerpo: string[]
}

/** Lo que necesita la portada de cada artículo: todo menos el cuerpo. */
export type ResumenArticulo = Omit<Articulo, 'cuerpo'> & { minutos: number }

/** Una carta tal como se publica: sin el correo de quien la escribe. */
export type CartaPublica = {
  id: string
  nombre: string
  texto: string
  fecha: string
}

export type CamposCarta = 'nombre' | 'correo' | 'texto'
