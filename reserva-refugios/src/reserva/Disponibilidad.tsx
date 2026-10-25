import { formatearFecha } from './fechas'
import type { Noche } from './tipos'

function textoPlazas({ libres, plazas, retenidas }: Noche) {
  const texto = `${libres} de ${plazas} libres`
  return retenidas ? `${texto} · ${retenidas} retenidas para ti` : texto
}

function porcentaje(parte: number, total: number) {
  return `${(parte / total) * 100}%`
}

/** Las plazas de cada noche. No sabe si son las de verdad o las optimistas:
 * pinta lo que le pasen, y marca las retenidas si las hay. */
export default function Disponibilidad({ noches }: { noches: Noche[] }) {
  return (
    <ul className="noches">
      {noches.map((noche) => {
        const retenidas = noche.retenidas ?? 0
        const ocupadas = noche.plazas - noche.libres - retenidas
        return (
          <li key={noche.fecha} className={retenidas > 0 ? 'noche retenida' : 'noche'}>
            <time className="noche-fecha" dateTime={noche.fecha}>
              {formatearFecha(noche.fecha)}
            </time>
            <span className="noche-plazas">{textoPlazas(noche)}</span>
            {/* La barra repite lo que dice el texto: solo para la vista */}
            <span className="barra" aria-hidden="true">
              <span className="barra-ocupadas" style={{ width: porcentaje(ocupadas, noche.plazas) }} />
              <span className="barra-retenidas" style={{ width: porcentaje(retenidas, noche.plazas) }} />
            </span>
          </li>
        )
      })}
    </ul>
  )
}
