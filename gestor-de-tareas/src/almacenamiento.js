// Persistencia en localStorage. Es el almacenamiento.js de la versión en
// JavaScript, con una comprobación más: no sabe nada de React ni del DOM,
// así que pasarse a React no le cambia nada.

const CLAVE = 'gestor-de-tareas:v1'

/**
 * Lee las tareas guardadas. Si no hay nada, el JSON está corrupto o lo
 * guardado no es una lista, devuelve un array vacío en vez de romper la
 * aplicación.
 * @returns {Array<object>}
 */
export function cargarTareas() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    const datos = guardado ? JSON.parse(guardado) : []
    // JSON.parse('{}') no lanza, pero un objeto no se puede recorrer con
    // filter ni map: sin esta línea, la aplicación se rompería al pintar.
    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('No se pudieron leer las tareas guardadas:', error)
    return []
  }
}

/**
 * Guarda el array de tareas completo.
 * @param {Array<object>} tareas
 */
export function guardarTareas(tareas) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(tareas))
  } catch (error) {
    console.error('No se pudieron guardar las tareas:', error)
  }
}
