// La lógica del estado, en una función pura: recibe el estado actual y
// lo que ha pasado (la acción) y devuelve el estado siguiente.
//
// Sustituye a estado.js de la versión en JavaScript. Aquí no hay
// variables de módulo, ni suscriptores, ni notificar(): el estado lo
// guarda React (con useReducer, en ProveedorTareas.jsx) y es React quien
// vuelve a renderizar a los componentes cuando cambia.
//
// Los tests de src/tareasReducer.test.js comprueban este archivo: ejecuta
// npm test y ponlos en verde.

export const ESTADO_VACIO = { tareas: [], filtro: 'todas' }

/**
 * @param {{ tareas: Array<object>, filtro: 'todas'|'pendientes'|'completadas' }} estado
 * @param {{ type: string }} accion
 */
export function tareasReducer(estado, accion) {
  switch (accion.type) {
    case 'anadida': {
      // TODO (paso 1): recorta accion.texto con trim(). Si queda vacío,
      // devuelve `estado` tal cual. Si no, devuelve un estado NUEVO con
      // esta tarea al final de la lista:
      //   { id: accion.id, texto, completada: false, creadaEn: accion.creadaEn }
      // El id y la fecha vienen en la acción: no llames aquí a
      // crypto.randomUUID() ni a new Date(). Y nada de push: copia con
      // { ...estado, tareas: [...estado.tareas, tarea] }.
      return estado
    }
    case 'alternada': {
      // TODO (paso 1): devuelve un estado nuevo en el que la tarea con
      // id === accion.id tenga `completada` al revés. Usa map y una copia
      // de la tarea ({ ...tarea, completada: ... }): no la modifiques.
      return estado
    }
    case 'borrada': {
      // TODO (paso 1): devuelve un estado nuevo sin la tarea de ese id
      // (filter).
      return estado
    }
    case 'filtro_cambiado': {
      // TODO (paso 1): devuelve un estado nuevo con filtro: accion.filtro
      // y las mismas tareas.
      return estado
    }
    default: {
      throw Error('Acción desconocida: ' + accion.type)
    }
  }
}

/**
 * Las tareas que tocaría mostrar con ese filtro. Es obtenerTareasVisibles()
 * de estado.js, pero recibe lo que necesita en vez de leer una variable
 * de módulo: por eso se puede probar sin preparar nada.
 */
export function filtrarTareas(tareas, filtro) {
  // TODO (paso 1): con 'pendientes', solo las no completadas; con
  // 'completadas', solo las completadas; con cualquier otro, todas.
  return tareas
}
