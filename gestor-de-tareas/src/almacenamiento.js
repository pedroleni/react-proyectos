// Persistencia en localStorage. Es el almacenamiento.js de la versión en
// JavaScript: no sabe nada de React ni del DOM, así que pasarse a React
// no le cambia nada.

const CLAVE = 'gestor-de-tareas:v1'

/**
 * Lee las tareas guardadas. Si no hay nada, o el JSON está corrupto,
 * devuelve un array vacío en vez de romper la aplicación.
 * @returns {Array<object>}
 */
export function cargarTareas() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : []
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
