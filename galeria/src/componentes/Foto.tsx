import type { CSSProperties } from 'react'
import { urlFoto, type Foto as DatosFoto } from '../datos'

interface Props {
  foto: DatosFoto
  /** «recorte»: cuadrada, para la cuadrícula. «entera»: con su proporción. */
  forma: 'recorte' | 'entera'
}

// width y height son los del archivo: con ellos el navegador conoce la
// proporción antes de descargar nada y reserva el hueco, sin saltos. Mientras
// llega, se ve el fondo: un degradado con los tonos de la foto.
export default function Foto({ foto, forma }: Props) {
  const [oscuro, medio, claro] = foto.colores
  const estilo = {
    '--oscuro': oscuro,
    '--medio': medio,
    '--claro': claro,
    '--proporcion': foto.ancho / foto.alto,
  } as CSSProperties

  return (
    <img
      className={`foto foto-${forma}`}
      src={urlFoto(foto)}
      alt={foto.alt}
      width={foto.ancho}
      height={foto.alto}
      style={estilo}
    />
  )
}
