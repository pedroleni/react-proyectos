export default function Cabecera() {
  // TODO (paso 3): lee todas las tareas con useTareas() (impórtalo de
  // '../TareasContext'), cuenta las que no están completadas y escribe el
  // texto con singular y plural: «1 tarea pendiente», «3 tareas pendientes».
  // Cuenta sobre todas las tareas, no sobre las visibles.
  const textoContador = '0 tareas pendientes'

  return (
    <header className="app-header">
      <h1>Gestor de tareas</h1>
      <p className="contador" aria-live="polite">
        {textoContador}
      </p>
    </header>
  )
}
