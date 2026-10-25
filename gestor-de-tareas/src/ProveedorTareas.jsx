// El componente que guarda el estado y lo reparte (lección 29). Hace lo
// que en la versión en JavaScript hacían estado.js (guardar las tareas)
// y main.js (cargarlas al arrancar y guardarlas en cada cambio).

// TODO (paso 2): importa useReducer de 'react', los dos contextos de
// './TareasContext' y tareasReducer y ESTADO_VACIO de './tareasReducer'.

// TODO (paso 4): escribe aquí una función crearEstadoInicial() que
// devuelva { tareas: cargarTareas(), filtro: 'todas' } (cargarTareas está
// en './almacenamiento').

export function ProveedorTareas({ children }) {
  // TODO (paso 2): guarda el estado con
  //   const [estado, dispatch] = useReducer(tareasReducer, ESTADO_VACIO)
  // y devuelve children envuelto en los dos proveedores:
  //   <TareasContext value={estado}>
  //     <TareasDispatchContext value={dispatch}>{children}</TareasDispatchContext>
  //   </TareasContext>
  //
  // TODO (paso 4): cambia el useReducer para que el estado inicial salga
  // de crearEstadoInicial (tercer argumento: useReducer(tareasReducer,
  // null, crearEstadoInicial)) y llama a useGuardadoAutomatico(estado.tareas)
  // justo debajo.
  return children
}
