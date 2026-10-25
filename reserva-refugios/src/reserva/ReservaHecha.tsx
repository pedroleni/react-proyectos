import ResumenReserva from './ResumenReserva'
import type { ReservaConfirmada } from './tipos'

export default function ReservaHecha({ reserva }: { reserva: ReservaConfirmada }) {
  return (
    <>
      <p className="localizador">
        Localizador <strong>{reserva.localizador}</strong>
      </p>
      <p>
        Guárdalo: te lo pedirán al llegar al refugio. En una aplicación de verdad, ahora te llegaría un correo
        a {reserva.correo}; en este proyecto no se envía nada.
      </p>
      <ResumenReserva datos={reserva} importe={reserva.importe} />
    </>
  )
}
