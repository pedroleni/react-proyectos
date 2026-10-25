import { useFiltro, useTareasDispatch } from '../TareasContext'

const FILTROS = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'pendientes', texto: 'Pendientes' },
  { valor: 'completadas', texto: 'Completadas' },
]

export default function Filtros() {
  const filtro = useFiltro()
  const dispatch = useTareasDispatch()

  return (
    <div className="filtros" role="group" aria-label="Filtrar tareas">
      {FILTROS.map(({ valor, texto }) => (
        <button
          key={valor}
          type="button"
          className="filtro"
          aria-pressed={filtro === valor}
          onClick={() => dispatch({ type: 'filtro_cambiado', filtro: valor })}
        >
          {texto}
        </button>
      ))}
    </div>
  )
}
