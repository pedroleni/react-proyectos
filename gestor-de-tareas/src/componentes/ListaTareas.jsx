import { useTareasVisibles } from '../TareasContext'
import Tarea from './Tarea'

export default function ListaTareas() {
  const visibles = useTareasVisibles()

  return (
    <>
      <ul className="lista-tareas">
        {visibles.map((tarea) => (
          <Tarea key={tarea.id} tarea={tarea} />
        ))}
      </ul>
      {visibles.length === 0 && <p className="mensaje-vacio">No hay tareas todavía.</p>}
    </>
  )
}
