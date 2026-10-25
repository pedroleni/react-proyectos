import { useEffect } from 'react'
import { guardarTareas } from './almacenamiento'

/**
 * Guarda las tareas en localStorage al montar y cada vez que cambian.
 *
 * En la versión en JavaScript, main.js se suscribía al estado con una
 * función que repintaba y guardaba en cada notificar(). Aquí React repinta
 * solo, y lo único que queda por sincronizar con el exterior es
 * localStorage: un efecto, con las tareas como dependencia.
 * @param {Array<object>} tareas
 */
export function useGuardadoAutomatico(tareas) {
  useEffect(() => {
    guardarTareas(tareas)
  }, [tareas])
}
