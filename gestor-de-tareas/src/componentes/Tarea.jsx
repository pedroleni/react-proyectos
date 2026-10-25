// Es crearElementoTarea() de vista.js, pero descrito con JSX en vez de
// construido con createElement.

// TODO (paso 3): mueve aquí el formateador de fechas de vista.js:
//   const formateadorFecha = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' })

export default function Tarea({ tarea }) {
  // TODO (paso 3): consigue dispatch con useTareasDispatch() (de
  // '../TareasContext') y devuelve el mismo <li> que construía
  // crearElementoTarea():
  // - <li> con className 'tarea', o 'tarea completada' si está completada.
  // - <input type="checkbox" className="tarea-checkbox"> con
  //   checked={tarea.completada}, un onChange que despache
  //   { type: 'alternada', id: tarea.id } y este aria-label:
  //   `Marcar "${tarea.texto}" como ${tarea.completada ? 'pendiente' : 'completada'}`
  // - <span className="tarea-texto"> con el texto.
  // - <time className="tarea-fecha" dateTime={tarea.creadaEn}> con
  //   formateadorFecha.format(new Date(tarea.creadaEn)).
  // - <button type="button" className="tarea-borrar"> con el texto ×, el
  //   aria-label `Borrar "${tarea.texto}"` y un onClick que despache
  //   { type: 'borrada', id: tarea.id }.
  // Sin dataset.id ni delegación: cada manejador ya sabe de qué tarea es.
  return <li className="tarea">{tarea.texto}</li>
}
