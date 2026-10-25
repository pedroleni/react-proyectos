import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { crearPar } from '../mercado/almacen'
import { ticker } from '../pruebas/fuenteFalsa'
import TablaVirtual, { ALTO_FILA } from './TablaVirtual'

// 516 pares, como en Binance.
const PARES = Array.from({ length: 516 }, (_, i) => crearPar(ticker(`MONEDA${i}USDT`, 1 + i)))
const ALTO_VISIBLE = 10 * ALTO_FILA

// jsdom no calcula tamaños: el contenedor mediría 0 píxeles y no se vería
// ninguna fila. Aquí se le da la altura de diez filas.
const descriptorOriginal = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')

describe('la tabla virtual (paso 7)', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      get() {
        return this.classList.contains('tabla-desplazable') ? ALTO_VISIBLE : 0
      },
    })
  })

  afterEach(() => {
    if (descriptorOriginal) Object.defineProperty(HTMLElement.prototype, 'clientHeight', descriptorOriginal)
  })

  it('pone en el DOM solo las filas que se ven, más unas pocas de margen', () => {
    render(<TablaVirtual pares={PARES} favoritos={new Set()} />)

    const filas = within(screen.getByRole('table')).getAllByRole('row').slice(1) // sin la de títulos
    expect(filas.length).toBeGreaterThanOrEqual(10)
    expect(filas.length).toBeLessThan(30)
    expect(screen.getByText(`Filas en el DOM: ${filas.length}`)).toBeInTheDocument()
  })

  it('dice a los lectores de pantalla cuántas filas hay en total y cuál es cada una', () => {
    render(<TablaVirtual pares={PARES} favoritos={new Set()} />)

    expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '517')
    const primera = within(screen.getByRole('table')).getAllByRole('row')[1]
    expect(primera).toHaveAttribute('aria-rowindex', '2')
  })

  it('al bajar con el scroll, pinta las filas de esa altura', () => {
    render(<TablaVirtual pares={PARES} favoritos={new Set()} />)
    const contenedor = screen.getByRole('region', { name: 'Pares en USDT' })

    contenedor.scrollTop = 300 * ALTO_FILA
    fireEvent.scroll(contenedor)

    expect(screen.getByRole('rowheader', { name: 'MONEDA300/USDT' })).toBeInTheDocument()
    expect(screen.queryByRole('rowheader', { name: 'MONEDA0/USDT' })).not.toBeInTheDocument()
  })
})
