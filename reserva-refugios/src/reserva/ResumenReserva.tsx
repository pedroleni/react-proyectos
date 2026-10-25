import type { DatosReserva } from './esquema'
import { formatearFecha, sumarDias } from './fechas'
import { calcularImporte, formatearEuros } from './importe'
import { buscarRefugio } from './refugios'

export type DatosResumen = Omit<DatosReserva, 'acepto'>

/** Todo lo que se va a reservar (o se ha reservado), en una lista de definiciones. */
export default function ResumenReserva({ datos, importe }: { datos: DatosResumen; importe?: number }) {
  const refugio = buscarRefugio(datos.refugio)!
  const noches = datos.noches === 1 ? '1 noche' : `${datos.noches} noches`
  const federados =
    datos.federados === 0 ? 'nadie con licencia federativa' : `${datos.federados} con licencia federativa`

  return (
    <dl className="resumen">
      <div>
        <dt>Refugio</dt>
        <dd>{refugio.nombre}</dd>
      </div>
      <div>
        <dt>Fechas</dt>
        <dd>
          Del {formatearFecha(datos.llegada)} al {formatearFecha(sumarDias(datos.llegada, datos.noches))} ({noches})
        </dd>
      </div>
      <div>
        <dt>Grupo</dt>
        <dd>
          {datos.personas === 1 ? '1 persona' : `${datos.personas} personas`}, {federados}
        </dd>
      </div>
      <div>
        <dt>A nombre de</dt>
        <dd>
          {datos.nombre} · {datos.correo} · {datos.telefono}
        </dd>
      </div>
      {datos.observaciones !== '' && (
        <div>
          <dt>Observaciones</dt>
          <dd>{datos.observaciones}</dd>
        </div>
      )}
      <div>
        <dt>Importe</dt>
        <dd>{formatearEuros(importe ?? calcularImporte(datos))}, que se paga en el refugio</dd>
      </div>
    </dl>
  )
}
