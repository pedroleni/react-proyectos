import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import Encabezado, { COLUMNAS } from './Encabezado'
import FilaPar from './FilaPar'
import TablaCompleta, { type TablaProps } from './TablaCompleta'

// La altura de cada fila en píxeles: la misma que fija estilos.css.
export const ALTO_FILA = 44

// Solo las filas que se ven, más unas pocas por encima y por debajo. Las demás
// se sustituyen por dos filas vacías con su altura, para que la barra de scroll
// mida lo mismo que con la tabla entera.
export default function TablaVirtual({ pares, favoritos }: TablaProps) {
  // TODO (paso 7): virtualiza la tabla.
  // - Una ref para el div con scroll (contenedorRef) y useVirtualizer con count,
  //   getScrollElement, estimateSize (ALTO_FILA), overscan y getItemKey (el
  //   símbolo del par: así la fila de BTC sigue siendo la de BTC al reordenar).
  // - virtualizador.getVirtualItems() da las filas que tocan; antes y después
  //   van dos filas de relleno con la altura que falta (la primera empieza en
  //   filas[0].start; la última acaba en getTotalSize()).
  // - La tabla lleva aria-rowcount={pares.length + 1}, <Encabezado conIndices />
  //   y cada FilaPar su indice (fila.index + 2), para los lectores de pantalla.
  // - Debajo, «Filas en el DOM: N» con las que de verdad hay.
  // Mientras tanto, enseña la tabla completa.
  return <TablaCompleta pares={pares} favoritos={favoritos} />
}
