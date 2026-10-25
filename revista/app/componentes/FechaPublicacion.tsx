import { formatearFecha } from '~/fechas'

/** La fecha de publicación, igual en el servidor y en el navegador. */
export default function FechaPublicacion({ fecha }: { fecha: string }) {
  return <time dateTime={fecha}>{formatearFecha(fecha)}</time>
}
