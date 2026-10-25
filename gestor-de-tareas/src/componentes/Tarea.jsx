import { useTareasDispatch } from '../TareasContext'

const formateadorFecha = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' })

// Es crearElementoTarea() de vista.js: el mismo <li>, descrito en vez de
// construido pieza a pieza. Sin dataset.id ni delegación de eventos: cada
// botón sabe a qué tarea pertenece porque la recibe en sus props.
export default function Tarea({ tarea }) {
  const dispatch = useTareasDispatch()

  return (
    <li className={tarea.completada ? 'tarea completada' : 'tarea'}>
      <input
        type="checkbox"
        className="tarea-checkbox"
        checked={tarea.completada}
        onChange={() => dispatch({ type: 'alternada', id: tarea.id })}
        aria-label={`Marcar "${tarea.texto}" como ${tarea.completada ? 'pendiente' : 'completada'}`}
      />
      <span className="tarea-texto">{tarea.texto}</span>
      <time className="tarea-fecha" dateTime={tarea.creadaEn}>
        {formateadorFecha.format(new Date(tarea.creadaEn))}
      </time>
      <button
        type="button"
        className="tarea-borrar"
        aria-label={`Borrar "${tarea.texto}"`}
        onClick={() => dispatch({ type: 'borrada', id: tarea.id })}
      >
        ×
      </button>
    </li>
  )
}
