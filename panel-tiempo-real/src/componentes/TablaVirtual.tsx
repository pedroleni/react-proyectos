import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import Encabezado, { COLUMNAS } from './Encabezado'
import FilaPar from './FilaPar'
import type { TablaProps } from './TablaCompleta'

// La altura de cada fila en píxeles: la misma que fija estilos.css.
export const ALTO_FILA = 44

// Solo las filas que se ven, más unas pocas por encima y por debajo. Las demás
// se sustituyen por dos filas vacías con su altura, para que la barra de scroll
// mida lo mismo que con la tabla entera.
export default function TablaVirtual({ pares, favoritos }: TablaProps) {
  const contenedorRef = useRef<HTMLDivElement>(null)

  // El React Compiler se salta este componente, y npm run lint lo avisa
  // (incompatible-library): el virtualizador cambia por dentro sin dejar de
  // ser el mismo objeto, y memorizar lo que devuelve dejaría filas viejas.
  // Por eso a FilaPar solo le llegan datos, nunca el virtualizador.
  const virtualizador = useVirtualizer({
    count: pares.length,
    getScrollElement: () => contenedorRef.current,
    estimateSize: () => ALTO_FILA,
    overscan: 8,
    // Cada fila se identifica por su par, no por su posición: al reordenar
    // por variación, la fila de BTC sigue siendo la de BTC.
    getItemKey: (indice) => pares[indice].simbolo,
  })

  const filas = virtualizador.getVirtualItems()
  const rellenoArriba = filas.length > 0 ? filas[0].start : 0
  const rellenoAbajo = filas.length > 0 ? virtualizador.getTotalSize() - filas[filas.length - 1].end : 0

  return (
    <>
      <div ref={contenedorRef} className="tabla-desplazable" tabIndex={0} role="region" aria-label="Pares en USDT">
        <table className="tabla-pares" aria-rowcount={pares.length + 1}>
          <Encabezado conIndices />
          <tbody>
            {rellenoArriba > 0 && (
              <tr className="relleno" aria-hidden="true">
                <td colSpan={COLUMNAS} style={{ height: rellenoArriba }} />
              </tr>
            )}
            {filas.map((fila) => {
              const par = pares[fila.index]
              return (
                <FilaPar key={fila.key} par={par} esFavorito={favoritos.has(par.simbolo)} indice={fila.index + 2} />
              )
            })}
            {rellenoAbajo > 0 && (
              <tr className="relleno" aria-hidden="true">
                <td colSpan={COLUMNAS} style={{ height: rellenoAbajo }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="filas-dom">Filas en el DOM: {filas.length}</p>
    </>
  )
}
