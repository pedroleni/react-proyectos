export const SECCIONES = [
  { id: 'galeria', nombre: 'Galería', ruta: '/' },
  { id: 'participa', nombre: 'Participa', ruta: '/participa' },
  { id: 'visita', nombre: 'Visita', ruta: '/visita' },
] as const

export type Seccion = (typeof SECCIONES)[number]['id']

/** La sección (la pestaña) a la que pertenece una dirección. */
export function seccionDe(pathname: string): Seccion {
  const ruta = pathname.replace(/\/+$/, '') || '/'
  if (ruta === '/participa') return 'participa'
  if (ruta === '/visita') return 'visita'
  // La portada, las fotos y cualquier dirección desconocida (la 404)
  // son de la galería.
  return 'galeria'
}

export function posicionDe(seccion: Seccion): number {
  return SECCIONES.findIndex((s) => s.id === seccion)
}
