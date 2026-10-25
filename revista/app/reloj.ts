// Un reloj como almacén externo (lección 46): el navegador sabe qué hora es;
// el servidor no sabe cuándo vas a leer la página.
import { useSyncExternalStore } from 'react'

const MINUTO = 60_000

function suscribirse(avisar: () => void) {
  // Cada minuto, React vuelve a leer la hora y repinta si ha cambiado.
  const id = setInterval(avisar, MINUTO)
  return () => clearInterval(id)
}

// Redondeada al minuto: dos lecturas seguidas devuelven el mismo número, y
// React no ve un cambio en cada render.
const ahoraEnElNavegador = () => Math.floor(Date.now() / MINUTO) * MINUTO

// En el servidor y durante la hidratación: «no lo sé».
const ahoraEnElServidor = () => null

/** El instante actual, redondeado al minuto, o null si todavía no se sabe. */
export function useAhora(): number | null {
  return useSyncExternalStore(suscribirse, ahoraEnElNavegador, ahoraEnElServidor)
}
