// Los dos contextos del estado (lección 29) y los hooks para leerlos.
// Los componentes no importan los contextos: piden lo que necesitan con
// estos hooks, que hacen el papel de los obtener...() de estado.js.
// Solo ProveedorTareas.jsx usa los contextos directamente.

// TODO (paso 2): importa createContext y useContext de 'react', y
// filtrarTareas de './tareasReducer'.

// TODO (paso 2): crea y exporta los dos contextos, los dos con null como
// valor por defecto y con su displayName:
//   - TareasContext (displayName 'Tareas'): llevará el estado.
//   - TareasDispatchContext (displayName 'TareasDispatch'): llevará dispatch.

// TODO (paso 2): escribe un hook interno useEstadoTareas() que lea
// TareasContext con useContext y lance un Error si recibe null (eso
// significa que no hay ningún <ProveedorTareas> por encima).

// Los cuatro hooks de abajo devuelven, de momento, un valor fijo para que
// la aplicación arranque. Cámbialos en el paso 2.

/** Todas las tareas, sin filtrar: obtenerTodasLasTareas(). */
export function useTareas() {
  // TODO (paso 2): devuelve useEstadoTareas().tareas.
  return []
}

/** El filtro activo: obtenerFiltroActual(). */
export function useFiltro() {
  // TODO (paso 2): devuelve useEstadoTareas().filtro.
  return 'todas'
}

/** Las tareas que se ven con el filtro activo: obtenerTareasVisibles(). */
export function useTareasVisibles() {
  // TODO (paso 2): lee las tareas y el filtro con useEstadoTareas() y
  // devuelve filtrarTareas(tareas, filtro).
  return []
}

/** La función para cambiar el estado: dispatch({ type: ... }). */
export function useTareasDispatch() {
  // TODO (paso 2): lee TareasDispatchContext con useContext, lanza un
  // Error si es null y devuelve dispatch.
  return () => {}
}
