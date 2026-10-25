import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub, data } from 'react-router'
import { describe, expect, it } from 'vitest'
import FormularioCarta from '~/componentes/FormularioCarta'

// FormularioCarta es un componente reutilizable: se prueba dentro de una ruta
// de mentira, con createRoutesStub, como recomienda React Router.
function montar(accion: () => unknown) {
  const Stub = createRoutesStub([
    {
      path: '/articulos/:slug',
      Component: ({ actionData }: { actionData?: never }) => <FormularioCarta resultado={actionData} />,
      action: accion,
    },
  ])
  render(<Stub initialEntries={['/articulos/la-raya-no-es-un-guion']} />)
  return userEvent.setup()
}

describe('Paso 5: cartas al director, validadas en el servidor', () => {
  it('los errores que devuelve la action salen junto a su campo, y el foco va al primero', async () => {
    const usuario = montar(() =>
      data(
        {
          errores: { correo: 'Escribe un correo válido, como nombre@ejemplo.es. No lo publicaremos.' },
          valores: { nombre: 'Ana', correo: 'ana@correo', texto: 'Una carta de prueba bastante larga.' },
        },
        { status: 400 },
      ),
    )
    await usuario.click(screen.getByRole('button', { name: 'Enviar la carta' }))

    const correo = await screen.findByRole('textbox', { name: 'Correo (no se publica)' })
    expect(correo).toHaveAttribute('aria-invalid', 'true')
    expect(correo).toHaveAccessibleDescription('Escribe un correo válido, como nombre@ejemplo.es. No lo publicaremos.')
    expect(correo).toHaveFocus()
    expect(screen.getByRole('textbox', { name: 'Nombre' })).not.toHaveAttribute('aria-invalid')
  })
})

describe('Paso 6: con JavaScript, el estado del envío', () => {
  it('mientras se envía, el botón dice «Enviando…» y no se puede pulsar otra vez', async () => {
    let terminar = () => {}
    const usuario = montar(() => new Promise((resolver) => (terminar = () => resolver(null))))
    await usuario.click(screen.getByRole('button', { name: 'Enviar la carta' }))

    const boton = await screen.findByRole('button', { name: 'Enviando…' })
    expect(boton).toBeDisabled()
    terminar()
    expect(await screen.findByRole('button', { name: 'Enviar la carta' })).toBeEnabled()
  })
})
