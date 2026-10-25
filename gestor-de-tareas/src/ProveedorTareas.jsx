// El componente que guarda el estado y lo reparte (lección 29). Hace lo
// que en la versión en JavaScript hacían estado.js (guardar las tareas)
// y main.js (cargarlas al arrancar y guardarlas en cada cambio).

import { useReducer } from 'react'
import { cargarTareas } from './almacenamiento'
import { TareasContext, TareasDispatchContext } from './TareasContext'
import { tareasReducer } from './tareasReducer'
import { useGuardadoAutomatico } from './useGuardadoAutomatico'

// React la llama una sola vez, al montar el proveedor: es el
// inicializarEstado(cargarTareas()) de main.js.
function crearEstadoInicial() {
  return { tareas: cargarTareas(), filtro: 'todas' }
}

export function ProveedorTareas({ children }) {
  const [estado, dispatch] = useReducer(tareasReducer, null, crearEstadoInicial)
  useGuardadoAutomatico(estado.tareas)

  return (
    <TareasContext value={estado}>
      <TareasDispatchContext value={dispatch}>{children}</TareasDispatchContext>
    </TareasContext>
  )
}
