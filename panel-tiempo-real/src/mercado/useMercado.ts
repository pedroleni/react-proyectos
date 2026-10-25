// Cómo leen los componentes el almacén. El almacén llega por contexto para
// que los tests puedan darle a la aplicación uno con una fuente de mentira;
// el contexto no cambia nunca, así que no provoca ningún render.

import { createContext, useContext, useSyncExternalStore } from 'react'
import type { AlmacenMercado } from './almacen'
import type { Mercado } from './tipos'

export const MercadoContext = createContext<AlmacenMercado | null>(null)
MercadoContext.displayName = 'Mercado'

function useAlmacen(): AlmacenMercado {
  const almacen = useContext(MercadoContext)
  if (almacen === null) {
    throw new Error('useMercado tiene que usarse dentro de <MercadoContext value={almacen}>')
  }
  return almacen
}

// Cada componente elige qué parte del mercado lee. React compara lo que
// devuelve el selector con Object.is: un componente que lee el estado de la
// conexión no se renderiza cuando solo cambian los precios. El selector tiene
// que devolver algo que ya esté en la instantánea, nunca un objeto o un
// array recién creado (lo verás en los errores típicos).
export function useMercado<T>(seleccionar: (mercado: Mercado) => T): T {
  const almacen = useAlmacen()
  return useSyncExternalStore(almacen.suscribir, () => seleccionar(almacen.leer()))
}
