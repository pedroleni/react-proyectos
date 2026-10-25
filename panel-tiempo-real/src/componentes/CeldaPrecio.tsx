import { useEffect, useRef } from 'react'
import { formatoPrecio } from '../formato'
import type { Tendencia } from '../mercado/tipos'

const VERDE = 'rgb(19 115 71 / 0.25)'
const ROJO = 'rgb(180 35 24 / 0.22)'

interface CeldaPrecioProps {
  precio: number
  tendencia: Tendencia
}

export default function CeldaPrecio({ precio, tendencia }: CeldaPrecioProps) {
  const celdaRef = useRef<HTMLTableCellElement>(null)
  const precioAnterior = useRef(precio)

  // El destello es un efecto: ocurre cuando cambia el precio, no cuando la fila
  // aparece en pantalla, como al hacer scroll en la tabla virtual.
  useEffect(() => {
    if (precioAnterior.current === precio) return
    precioAnterior.current = precio
    const celda = celdaRef.current
    if (!celda?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    celda.animate([{ backgroundColor: tendencia === 'baja' ? ROJO : VERDE }, { backgroundColor: 'transparent' }], {
      duration: 900,
      easing: 'ease-out',
    })
  }, [precio, tendencia])

  return (
    <td ref={celdaRef} className="celda-numero">
      {formatoPrecio(precio)}
    </td>
  )
}
