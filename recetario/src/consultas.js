// Un Hook por cada dato del servidor. Las páginas piden «la receta 52772» o
// «la búsqueda pasta»; cómo se pide, dónde se guarda y cuándo se repite es
// cosa de este archivo y de TanStack Query.

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  buscarPorNombre,
  filtrarPorCategoria,
  obtenerCategorias,
  obtenerDestacadas,
  obtenerReceta,
} from './api.js'

// TODO (paso 4): todas las claves en un solo sitio, de lo general a lo concreto.
// Cada clave lleva todo lo que su función usa para pedir los datos.
export const claves = {
  destacadas: ['recetas', 'destacadas'],
  // busqueda: (texto) => …
  // receta: (id) => …
  // categorias: …
  // recetasDeCategoria: (nombre) => …
}

export function useRecetasDestacadas() {
  // TODO (paso 4): useQuery con la clave de las destacadas y una queryFn que
  // pase la signal a obtenerDestacadas. Son al azar: que no caduquen nunca
  // (staleTime: Infinity), o un refresco en segundo plano las cambiaría delante de ti.
}

export function useBusquedaRecetas(texto) {
  // TODO (paso 4): la búsqueda de texto. Sin texto no se pide nada (enabled), y
  // mientras llega una búsqueda nueva se ven los resultados de la anterior
  // (placeholderData: keepPreviousData).
}

export function useReceta(id) {
  // TODO (paso 4): la receta con ese id.
}

export function useCategorias() {
  // TODO (paso 4): la lista de categorías.
}

export function useRecetasDeCategoria(nombre) {
  // TODO (paso 4): las recetas de una categoría.
}
