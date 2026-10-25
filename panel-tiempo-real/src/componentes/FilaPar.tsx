import { alternarFavorito } from '../favoritos'
import { formatoVariacion, formatoVolumen } from '../formato'
import type { Par } from '../mercado/tipos'
import CeldaPrecio from './CeldaPrecio'
import MiniGrafico from './MiniGrafico'

interface FilaParProps {
  par: Par
  esFavorito: boolean
  indice?: number // la posición en la tabla entera, solo en la tabla virtual
}

// Un color para la inicial de cada moneda, siempre el mismo para el mismo símbolo.
function tono(base: string): number {
  let suma = 0
  for (const letra of base) suma = (suma * 31 + (letra.codePointAt(0) ?? 0)) % 360
  return suma
}

export default function FilaPar({ par, esFavorito, indice }: FilaParProps) {
  const { simbolo, base, precio, variacion, tendencia } = par

  return (
    <tr aria-rowindex={indice}>
      <td className="celda-favorito">
        <button
          type="button"
          className="boton-favorito"
          aria-pressed={esFavorito}
          aria-label={`Favorito: ${base}`}
          onClick={() => alternarFavorito(simbolo)}
        >
          {esFavorito ? '★' : '☆'}
        </button>
      </td>
      <th scope="row" className="celda-par">
        <span className="inicial" style={{ backgroundColor: `hsl(${tono(base)} 55% 42%)` }} aria-hidden="true">
          {base.slice(0, 1)}
        </span>
        {base}
        <span className="cotizacion">/USDT</span>
      </th>
      <CeldaPrecio precio={precio} tendencia={tendencia} />
      <td className={`celda-numero ${variacion >= 0 ? 'positiva' : 'negativa'}`}>{formatoVariacion(variacion)}</td>
      <td className="celda-numero celda-volumen">{formatoVolumen(par.volumen)}</td>
      <td className="celda-grafico">
        <MiniGrafico historial={par.historial} />
      </td>
    </tr>
  )
}
