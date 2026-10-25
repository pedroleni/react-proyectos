// TODO (paso 4): importa useEffect de 'react' y guardarTareas de
// './almacenamiento'.

/**
 * Guarda las tareas en localStorage al montar y cada vez que cambian.
 *
 * En la versión en JavaScript, main.js se suscribía al estado con una
 * función que repintaba y guardaba en cada notificar(). Aquí React repinta
 * solo, y lo único que queda por sincronizar con el exterior es
 * localStorage.
 *
 * Los tests de src/useGuardadoAutomatico.test.js comprueban este Hook.
 * @param {Array<object>} tareas
 */
export function useGuardadoAutomatico(tareas) {
  // TODO (paso 4): con un efecto, llama a guardarTareas(tareas). Elige la
  // lista de dependencias para que se ejecute al montar y cada vez que
  // cambie la lista de tareas, pero no en cada render.
}
