// Qué pares se ven y en qué orden: funciones puras, sin React, como
// obtenerMonedasVisibles() en el estado.js del proyecto de JavaScript.

import type { Par } from './tipos'

export const ORDENES = {
  volumen: 'Volumen: mayor primero',
  'variacion-desc': 'Variación: mayor primero',
  'variacion-asc': 'Variación: menor primero',
  precio: 'Precio: mayor primero',
  nombre: 'Nombre',
} as const

export type Orden = keyof typeof ORDENES

// Un Intl.Collator creado una vez: localeCompare buscaría las reglas del
// idioma en cada una de las miles de comparaciones de una ordenación.
const alfabetico = new Intl.Collator('es')

const comparadores: Record<Orden, (a: Par, b: Par) => number> = {
  volumen: (a, b) => b.volumen - a.volumen,
  'variacion-desc': (a, b) => b.variacion - a.variacion,
  'variacion-asc': (a, b) => a.variacion - b.variacion,
  precio: (a, b) => b.precio - a.precio,
  nombre: (a, b) => alfabetico.compare(a.base, b.base),
}

export interface Filtros {
  busqueda: string
  orden: Orden
  soloFavoritos: boolean
  favoritos: ReadonlySet<string>
}

export function filtrarYOrdenar(lista: readonly Par[], { busqueda, orden, soloFavoritos, favoritos }: Filtros): Par[] {
  const texto = busqueda.trim().toLocaleUpperCase('es')
  return lista
    .filter((par) => (!texto || par.base.includes(texto)) && (!soloFavoritos || favoritos.has(par.simbolo)))
    .sort(comparadores[orden])
}
