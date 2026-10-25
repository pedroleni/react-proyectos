import { PUNTOS_HISTORIAL } from '../mercado/almacen'

const ANCHO = 120
const ALTO = 32
const MARGEN = 3

interface MiniGraficoProps {
  historial: readonly number[]
}

// La línea de los últimos precios recibidos. Es SVG con viewBox: se escala
// sola con su celda, sin el listener de resize que el canvas del proyecto de
// JavaScript tenía que añadir y quitar a mano.
export default function MiniGrafico({ historial }: MiniGraficoProps) {
  if (historial.length < 2) {
    return <svg className="mini-grafico" viewBox={`0 0 ${ANCHO} ${ALTO}`} aria-hidden="true" />
  }

  const minimo = Math.min(...historial)
  const maximo = Math.max(...historial)
  const rango = maximo - minimo || 1
  // El eje x es fijo, de 60 puntos: la línea crece de izquierda a derecha a
  // medida que llegan precios.
  const puntos = historial
    .map((precio, i) => {
      const x = (i / (PUNTOS_HISTORIAL - 1)) * ANCHO
      const y = MARGEN + ((maximo - precio) / rango) * (ALTO - 2 * MARGEN)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const sube = historial[historial.length - 1] >= historial[0]

  return (
    <svg
      className={sube ? 'mini-grafico sube' : 'mini-grafico baja'}
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      aria-hidden="true"
    >
      <polyline points={puntos} />
    </svg>
  )
}
