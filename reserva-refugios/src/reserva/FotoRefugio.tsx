import angelOrus from '../assets/refugios/angel-orus.jpg'
import estos from '../assets/refugios/estos.jpg'
import pineta from '../assets/refugios/pineta.jpg'
import renclusa from '../assets/refugios/renclusa.jpg'
import respomuso from '../assets/refugios/respomuso.jpg'
import type { IdRefugio, Refugio } from './refugios'

// Las imágenes están generadas con IA para el proyecto: un refugio genérico
// en el paisaje de cada sitio, no una foto del refugio de verdad. Importadas
// así, Vite les pone un hash en el nombre en el build (lección 85).
const IMAGENES: Record<IdRefugio, string> = {
  respomuso,
  pineta,
  estos,
  'angel-orus': angelOrus,
  renclusa,
}

/** La imagen de un refugio. Siempre va junto a su nombre, que ya dice todo
 * lo que hace falta: es decorativa, y por eso su alt está vacío. */
export default function FotoRefugio({ refugio, className }: { refugio: Refugio; className?: string }) {
  return (
    <img
      className={className}
      src={IMAGENES[refugio.id]}
      alt=""
      // El tamaño real del archivo: con él, el navegador reserva el sitio
      // antes de que llegue la imagen. El CSS decide cómo se ve.
      width={512}
      height={512}
      decoding="async"
    />
  )
}
