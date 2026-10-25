// La lógica del estado, en una función pura: recibe el estado actual y
// lo que ha pasado (la acción) y devuelve el estado siguiente.
//
// Sustituye a estado.js de la versión en JavaScript. Aquí no hay
// variables de módulo, ni suscriptores, ni notificar(): el estado lo
// guarda React (con useReducer, en TareasContext.jsx) y es React quien
// vuelve a renderizar a los componentes cuando cambia.

export const ESTADO_VACIO = { tareas: [], filtro: 'todas' }

/**
 * @param {{ tareas: Array<object>, filtro: 'todas'|'pendientes'|'completadas' }} estado
 * @param {{ type: string }} accion
 */
export function tareasReducer(estado, accion) {
  switch (accion.type) {
    case 'anadida': {
      const texto = accion.texto.trim()
      if (texto === '') return estado

      // El id y la fecha llegan en la acción: crypto.randomUUID() y
      // new Date() dan un valor distinto en cada llamada, y un reductor
      // tiene que devolver siempre lo mismo para el mismo estado y la
      // misma acción.
      const tarea = { id: accion.id, texto, completada: false, creadaEn: accion.creadaEn }
      return { ...estado, tareas: [...estado.tareas, tarea] }
    }
    case 'alternada': {
      return {
        ...estado,
        tareas: estado.tareas.map((tarea) =>
          tarea.id === accion.id ? { ...tarea, completada: !tarea.completada } : tarea,
        ),
      }
    }
    case 'borrada': {
      return { ...estado, tareas: estado.tareas.filter((tarea) => tarea.id !== accion.id) }
    }
    case 'filtro_cambiado': {
      return { ...estado, filtro: accion.filtro }
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
  if (filtro === 'pendientes') return tareas.filter((tarea) => !tarea.completada)
  if (filtro === 'completadas') return tareas.filter((tarea) => tarea.completada)
  return tareas
}
