import type { Par } from '../mercado/tipos'
import Encabezado from './Encabezado'
import FilaPar from './FilaPar'

export interface TablaProps {
  pares: readonly Par[]
  favoritos: ReadonlySet<string>
}

// Todas las filas en el DOM, también las que no se ven. Con 516 pares y unos
// 70 cambios por segundo, cada mensaje del WebSocket vuelve a renderizar la
// tabla entera.
export default function TablaCompleta({ pares, favoritos }: TablaProps) {
  return (
    <>
      <div className="tabla-desplazable" tabIndex={0} role="region" aria-label="Pares en USDT">
        <table className="tabla-pares">
          <Encabezado />
          <tbody>
            {pares.map((par) => (
              <FilaPar key={par.simbolo} par={par} esFavorito={favoritos.has(par.simbolo)} />
            ))}
          </tbody>
        </table>
      </div>
      <p className="filas-dom">Filas en el DOM: {pares.length}</p>
    </>
  )
}
