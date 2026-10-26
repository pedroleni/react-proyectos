// Un reloj como almacén externo (lección 46): el navegador sabe qué hora es;
// el servidor no sabe cuándo vas a leer la página.
import { useSyncExternalStore } from 'react'

/** El instante actual, redondeado al minuto, o null si todavía no se sabe. */
export function useAhora(): number | null {
  // TODO (paso 9): useSyncExternalStore con tres funciones: suscribirse (un
  // setInterval de un minuto, con su limpieza), la hora del navegador
  // redondeada al minuto y la del servidor, que devuelve null.
  void useSyncExternalStore
  return null
}
