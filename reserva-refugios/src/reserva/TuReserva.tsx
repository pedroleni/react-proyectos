import { useId } from 'react'
import Disponibilidad from './Disponibilidad'
import type { DatosReserva } from './esquema'
import { formatearFecha, sumarDias } from './fechas'
import FotoRefugio from './FotoRefugio'
import { buscarRefugio } from './refugios'
import type { Noche } from './tipos'

type Props = {
  datos: Pick<DatosReserva, 'refugio' | 'llegada' | 'noches' | 'personas'>
  noches: Noche[]
}

/** La columna lateral: qué estás reservando y cuántas plazas quedan. */
export default function TuReserva({ datos, noches }: Props) {
  const idTitulo = useId()
  const refugio = buscarRefugio(datos.refugio)!

  return (
    <aside className="tu-reserva" aria-labelledby={idTitulo}>
      <FotoRefugio refugio={refugio} className="tu-reserva-foto" />
      <h2 id={idTitulo}>Tu reserva</h2>
      <p className="tu-reserva-nombre">{refugio.nombre}</p>
      <p className="tu-reserva-zona">
        {refugio.zona} · {refugio.altitud} m
      </p>
      <dl className="datos-breves">
        <div>
          <dt>Llegada</dt>
          <dd>{formatearFecha(datos.llegada)}</dd>
        </div>
        <div>
          <dt>Salida</dt>
          <dd>{formatearFecha(sumarDias(datos.llegada, datos.noches))}</dd>
        </div>
        <div>
          <dt>Personas</dt>
          <dd>{datos.personas}</dd>
        </div>
      </dl>
      <h3>Plazas libres</h3>
      <Disponibilidad noches={noches} />
    </aside>
  )
}
