// Los dos contextos del estado (lección 29) y los hooks para leerlos.
// Los componentes no importan los contextos: piden lo que necesitan con
// estos hooks, que hacen el papel de los obtener...() de estado.js.
// Solo ProveedorTareas.jsx usa los contextos directamente.

import { createContext, useContext } from 'react'
import { filtrarTareas } from './tareasReducer'

export const TareasContext = createContext(null)
TareasContext.displayName = 'Tareas'

export const TareasDispatchContext = createContext(null)
TareasDispatchContext.displayName = 'TareasDispatch'

function useEstadoTareas() {
  const estado = useContext(TareasContext)
  if (estado === null) {
    throw new Error('Los hooks de las tareas tienen que usarse dentro de <ProveedorTareas>')
  }
  return estado
}

/** Todas las tareas, sin filtrar: obtenerTodasLasTareas(). */
export function useTareas() {
  return useEstadoTareas().tareas
}

/** El filtro activo: obtenerFiltroActual(). */
export function useFiltro() {
  return useEstadoTareas().filtro
}

/** Las tareas que se ven con el filtro activo: obtenerTareasVisibles(). */
export function useTareasVisibles() {
  const { tareas, filtro } = useEstadoTareas()
  return filtrarTareas(tareas, filtro)
}

/** La función para cambiar el estado: dispatch({ type: ... }). */
export function useTareasDispatch() {
  const dispatch = useContext(TareasDispatchContext)
  if (dispatch === null) {
    throw new Error('useTareasDispatch() tiene que usarse dentro de <ProveedorTareas>')
  }
  return dispatch
}
