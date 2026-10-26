import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub, data, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import FormularioBoletin from '~/componentes/FormularioBoletin'

const CAMPO = { name: 'Recibe el boletín: un correo al mes con los artículos nuevos' }
const ERROR = 'Escribe un correo válido, como nombre@ejemplo.es.'

// Un artículo de mentira con el boletín al pie, y la ruta /boletin con una
// action de mentira, con createRoutesStub.
function montar(accion: () => unknown) {
  function Articulo() {
    const { pathname } = useLocation()
    return (
      <>
        <h1>Un artículo</h1>
        <p>Estás en {pathname}</p>
        <FormularioBoletin />
      </>
    )
  }
  const Stub = createRoutesStub([
    { path: '/articulos/:slug', Component: Articulo },
    { path: '/boletin', Component: () => <h1>La página del boletín</h1>, action: accion },
  ])
  render(<Stub initialEntries={['/articulos/la-raya-no-es-un-guion']} />)
  return userEvent.setup()
}

describe('Paso 7: el boletín, sin cambiar de página', () => {
  it('apuntarse no navega: el aviso sale en el pie, el artículo sigue ahí y el campo se vacía', async () => {
    const usuario = montar(() => ({ ok: true, correo: 'ana@correo.es' }))
    const campo = screen.getByRole('textbox', CAMPO)
    await usuario.type(campo, 'ana@correo.es')
    await usuario.click(screen.getByRole('button', { name: 'Apuntarme' }))

    expect(await screen.findByText('Hecho: te escribiremos a ana@correo.es.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Un artículo' })).toBeInTheDocument()
    expect(screen.getByText('Estás en /articulos/la-raya-no-es-un-guion')).toBeInTheDocument()
    expect(campo).toHaveValue('')
  })

  it('mientras se envía, el botón dice «Apuntándote…»; después, el error sale junto al campo', async () => {
    let terminar = () => {}
    const usuario = montar(
      () =>
        new Promise((resolver) => {
          terminar = () => resolver(data({ ok: false, error: ERROR, correo: 'ana@correo' }, { status: 400 }))
        }),
    )
    const campo = screen.getByRole('textbox', CAMPO)
    await usuario.type(campo, 'ana@correo')
    await usuario.click(screen.getByRole('button', { name: 'Apuntarme' }))

    expect(await screen.findByRole('button', { name: 'Apuntándote…' })).toBeDisabled()
    terminar()
    expect(await screen.findByText(ERROR)).toBeInTheDocument()
    expect(campo).toHaveAttribute('aria-invalid', 'true')
    expect(campo).toHaveAccessibleDescription(ERROR)
    expect(campo).toHaveValue('ana@correo')
  })
})
