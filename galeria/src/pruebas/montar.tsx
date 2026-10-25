import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import App from '../App'

/**
 * Monta la app entera en una dirección, como main.tsx pero con MemoryRouter:
 * la URL vive en memoria y cada test empieza donde quiere (lección 83).
 * MemoryRouter también navega dentro de transiciones, como BrowserRouter.
 */
export function montar(ruta = '/') {
  const usuario = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
    { reactStrictMode: true },
  )
  return usuario
}
