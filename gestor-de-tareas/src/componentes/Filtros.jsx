const FILTROS = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'pendientes', texto: 'Pendientes' },
  { valor: 'completadas', texto: 'Completadas' },
]

export default function Filtros() {
  // TODO (paso 3): lee el filtro activo con useFiltro() y dispatch con
  // useTareasDispatch() (los dos, de '../TareasContext').

  return (
    <div className="filtros" role="group" aria-label="Filtrar tareas">
      {FILTROS.map(({ valor, texto }) => (
        // TODO (paso 3): aria-pressed tiene que ser true solo en el botón
        // del filtro activo, y al pulsar un botón hay que despachar
        // { type: 'filtro_cambiado', filtro: valor }.
        <button key={valor} type="button" className="filtro" aria-pressed={valor === 'todas'}>
          {texto}
        </button>
      ))}
    </div>
  )
}
