import { useTareas } from '../TareasContext'

export default function Cabecera() {
  const tareas = useTareas()
  // Cuenta sobre todas las tareas, no sobre las visibles: con el filtro
  // «Completadas», las pendientes siguen siendo las que son.
  const pendientes = tareas.filter((tarea) => !tarea.completada).length
  const textoContador = `${pendientes} ${pendientes === 1 ? 'tarea pendiente' : 'tareas pendientes'}`

  return (
    <header className="app-header">
      <h1>Gestor de tareas</h1>
      <p className="contador" aria-live="polite">
        {textoContador}
      </p>
    </header>
  )
}
