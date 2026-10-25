import type { Paso } from './tipos'

const PASOS = [
  { id: 'refugio', titulo: 'Refugio y fechas' },
  { id: 'grupo', titulo: 'Quién viene' },
  { id: 'confirmar', titulo: 'Revisar y confirmar' },
] as const

/** Dónde estás: una lista ordenada con el paso actual marcado con
 * aria-current="step". No son enlaces: no se puede saltar un paso sin validarlo. */
export default function Pasos({ actual }: { actual: Paso }) {
  const indiceActual = actual === 'hecha' ? PASOS.length : PASOS.findIndex((paso) => paso.id === actual)

  return (
    <ol className="pasos" aria-label="Pasos de la reserva">
      {PASOS.map((paso, indice) => {
        const hecho = indice < indiceActual
        const esActual = indice === indiceActual
        return (
          <li
            key={paso.id}
            className={hecho ? 'paso-hecho' : esActual ? 'paso-actual' : undefined}
            aria-current={esActual ? 'step' : undefined}
          >
            <span className="pasos-numero" aria-hidden="true">
              {hecho ? '✓' : indice + 1}
            </span>
            {paso.titulo}
            {hecho && <span className="solo-lectores"> (hecho)</span>}
          </li>
        )
      })}
    </ol>
  )
}
