import { ORDENES, type Orden } from '../mercado/filtrar'

interface ControlesProps {
  busqueda: string
  orden: Orden
  soloFavoritos: boolean
  virtual: boolean
  onCambiarBusqueda: (busqueda: string) => void
  onCambiarOrden: (orden: Orden) => void
  onAlternarFavoritos: () => void
  onCambiarVirtual: (virtual: boolean) => void
}

function esOrden(valor: string): valor is Orden {
  return valor in ORDENES
}

export default function Controles({
  busqueda,
  orden,
  soloFavoritos,
  virtual,
  onCambiarBusqueda,
  onCambiarOrden,
  onAlternarFavoritos,
  onCambiarVirtual,
}: ControlesProps) {
  return (
    <div className="barra-controles">
      <label className="campo-control">
        Buscar par
        <input
          type="search"
          placeholder="BTC, ETH, SOL…"
          autoComplete="off"
          value={busqueda}
          onChange={(evento) => onCambiarBusqueda(evento.target.value)}
        />
      </label>
      <label className="campo-control">
        Ordenar por
        <select
          value={orden}
          onChange={(evento) => {
            if (esOrden(evento.target.value)) onCambiarOrden(evento.target.value)
          }}
        >
          {Object.entries(ORDENES).map(([valor, texto]) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className="boton" aria-pressed={soloFavoritos} onClick={onAlternarFavoritos}>
        <span aria-hidden="true">{soloFavoritos ? '★' : '☆'}</span> Solo favoritos
      </button>
      <label className="interruptor">
        <input type="checkbox" checked={virtual} onChange={(evento) => onCambiarVirtual(evento.target.checked)} />
        Virtualizar la tabla
      </label>
    </div>
  )
}
