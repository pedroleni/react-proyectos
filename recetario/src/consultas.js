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

// Todas las claves en un solo sitio, de lo general a lo concreto.
// Cada clave lleva todo lo que su función usa para pedir los datos.
export const claves = {
  destacadas: ['recetas', 'destacadas'],
  busqueda: (texto) => ['recetas', 'busqueda', texto],
  receta: (id) => ['recetas', 'detalle', id],
  categorias: ['categorias'],
  recetasDeCategoria: (nombre) => ['categorias', nombre, 'recetas'],
}

export function useRecetasDestacadas() {
  return useQuery({
    queryKey: claves.destacadas,
    queryFn: ({ signal }) => obtenerDestacadas(signal),
    // Son al azar: si se volvieran a pedir (al volver a esta pestaña cuando ya
    // están viejas, por ejemplo), cambiarían delante de ti. Nunca caducan; si
    // nadie las usa durante cinco minutos (gcTime), la caché las borra.
    staleTime: Infinity,
  })
}

export function useBusquedaRecetas(texto) {
  return useQuery({
    queryKey: claves.busqueda(texto),
    queryFn: ({ signal }) => buscarPorNombre(texto, signal),
    // Sin texto no hay nada que pedir.
    enabled: texto !== '',
    // Mientras llega la búsqueda nueva, se ven los resultados de la anterior.
    placeholderData: keepPreviousData,
  })
}

export function useReceta(id) {
  return useQuery({
    queryKey: claves.receta(id),
    queryFn: ({ signal }) => obtenerReceta(id, signal),
  })
}

export function useCategorias() {
  return useQuery({
    queryKey: claves.categorias,
    queryFn: ({ signal }) => obtenerCategorias(signal),
  })
}

export function useRecetasDeCategoria(nombre) {
  return useQuery({
    queryKey: claves.recetasDeCategoria(nombre),
    queryFn: ({ signal }) => filtrarPorCategoria(nombre, signal),
  })
}
