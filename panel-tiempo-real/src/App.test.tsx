import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { crearAlmacenMercado } from './mercado/almacen'
import { MercadoContext } from './mercado/useMercado'
import { crearFuenteFalsa, ticker } from './pruebas/fuenteFalsa'

// Monta la aplicación con un almacén nuevo y una fuente de mentira, con la
// tabla completa: jsdom no tiene tamaños, y la virtual no pintaría ninguna
// fila (tiene su propio test).
function montar() {
  const fuente = crearFuenteFalsa()
  const almacen = crearAlmacenMercado(fuente.abrir)
  const usuario = userEvent.setup()
  render(
    <MercadoContext value={almacen}>
      <App virtualInicial={false} />
    </MercadoContext>,
    { reactStrictMode: true },
  )
  // Lo que llega del WebSocket no viene de un evento de React: va dentro de act (lección 84).
  const enviar = (...args: Parameters<typeof fuente.enviar>) => act(() => fuente.enviar(...args))
  const cambiarEstado = (...args: Parameters<typeof fuente.cambiarEstado>) => act(() => fuente.cambiarEstado(...args))
  return { usuario, enviar, cambiarEstado }
}

const MERCADO = [
  ticker('BTCUSDT', 81616.4, { apertura: 84588.48, volumen: 1_738_000_000 }),
  ticker('ETHUSDT', 2396.59, { apertura: 2509, volumen: 618_000_000 }),
  ticker('SOLUSDT', 104.35, { apertura: 100, volumen: 206_000_000 }),
]

function filaDe(base: string) {
  return screen.getByRole('rowheader', { name: new RegExp(`^${base}`) }).closest('tr') as HTMLElement
}

describe('la conexión (paso 3)', () => {
  it('dice «Conectando…» hasta que el WebSocket se abre, y después «En directo»', () => {
    const { cambiarEstado } = montar()
    expect(screen.getByRole('status')).toHaveTextContent('Conectando…')

    cambiarEstado('en-directo')
    expect(screen.getByRole('status')).toHaveTextContent('En directo')
  })

  it('avisa cuando se pierde la conexión', () => {
    const { cambiarEstado } = montar()
    cambiarEstado('en-directo')
    cambiarEstado('reconectando')
    expect(screen.getByRole('status')).toHaveTextContent('Conexión perdida. Reconectando…')
  })

  it('enseña la hora del último lote y cuántos pares han cambiado en él', () => {
    const { enviar } = montar()
    enviar(MERCADO.map((t) => ({ ...t, hora: Date.UTC(2026, 9, 22, 16, 20, 5) })))
    expect(screen.getByText(/3 cambios$/)).toBeInTheDocument()
  })
})

describe('la tabla (paso 4)', () => {
  it('espera a los primeros datos y después pinta una fila por par, de más a menos volumen', () => {
    const { enviar } = montar()
    expect(screen.getByText('Esperando los primeros datos del mercado…')).toBeInTheDocument()

    enviar(MERCADO)

    const filas = within(screen.getByRole('table')).getAllByRole('row').slice(1)
    expect(filas).toHaveLength(3)
    expect(within(filas[0]).getByRole('rowheader')).toHaveAccessibleName('BTC/USDT')
    expect(within(filas[1]).getByRole('rowheader')).toHaveAccessibleName('ETH/USDT')
    expect(within(filas[2]).getByRole('rowheader')).toHaveAccessibleName('SOL/USDT')
    expect(screen.getByText('3 de 3 pares')).toBeInTheDocument()
  })

  it('cambia el precio y la variación de una fila cuando llega un lote nuevo', () => {
    const { enviar } = montar()
    enviar(MERCADO)
    expect(filaDe('SOL')).toHaveTextContent('104,35')
    expect(filaDe('SOL')).toHaveTextContent('+4,35 %')

    enviar([ticker('SOLUSDT', 98, { apertura: 100, hora: 2 })])

    expect(filaDe('SOL')).toHaveTextContent('98,00')
    expect(filaDe('SOL')).toHaveTextContent('-2,00 %')
  })

  it('filtra por el texto del buscador, sin distinguir mayúsculas', async () => {
    const { usuario, enviar } = montar()
    enviar(MERCADO)

    await usuario.type(screen.getByLabelText('Buscar par'), 'eth')

    expect(screen.getByText('1 de 3 pares')).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: /^ETH/ })).toBeInTheDocument()
    expect(screen.queryByRole('rowheader', { name: /^BTC/ })).not.toBeInTheDocument()
  })

  it('ordena por variación cuando se elige en el desplegable', async () => {
    const { usuario, enviar } = montar()
    enviar(MERCADO)

    await usuario.selectOptions(screen.getByLabelText('Ordenar por'), 'Variación: mayor primero')

    const primera = within(screen.getByRole('table')).getAllByRole('row')[1]
    expect(within(primera).getByRole('rowheader')).toHaveAccessibleName('SOL/USDT')
  })

  it('marca un favorito, lo recuerda y puede enseñar solo los favoritos', async () => {
    const { usuario, enviar } = montar()
    enviar(MERCADO)

    await usuario.click(screen.getByRole('button', { name: 'Favorito: ETH' }))
    expect(screen.getByRole('button', { name: 'Favorito: ETH' })).toHaveAttribute('aria-pressed', 'true')
    expect(localStorage.getItem('panel-tiempo-real:favoritos:v1')).toBe('["ETHUSDT"]')

    await usuario.click(screen.getByRole('button', { name: 'Solo favoritos' }))
    expect(screen.getByText('1 de 3 pares')).toBeInTheDocument()
    expect(screen.queryByRole('rowheader', { name: /^BTC/ })).not.toBeInTheDocument()
  })
})
