export default function ListaTareas() {
  // TODO (paso 3): lee las tareas que se ven con el filtro activo con
  // useTareasVisibles() (de '../TareasContext').

  return (
    <>
      <ul className="lista-tareas">
        {/* TODO (paso 3): una <Tarea tarea={tarea} /> (de './Tarea') por
            cada tarea visible, con key={tarea.id}. */}
      </ul>
      {/* TODO (paso 3): el mensaje solo tiene que salir cuando no hay
          ninguna tarea visible. */}
      <p className="mensaje-vacio">No hay tareas todavía.</p>
    </>
  )
}
