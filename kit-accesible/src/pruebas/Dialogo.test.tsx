import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Dialogo } from '@kit'

function Ejemplo() {
  const [abierto, setAbierto] = useState(false)
  return (
    <>
      <main>
        <h1>Matrícula</h1>
        <button type="button" onClick={() => setAbierto(true)}>
          Pedir plaza
        </button>
        <a href="#ayuda">Ayuda</a>
      </main>
      <Dialogo
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        titulo="Pedir plaza en Alemán B1"
        descripcion="Te escribiremos para confirmarla."
      >
        <label>
          Nombre <input />
        </label>
        <button type="button">Enviar</button>
        <button type="button" onClick={() => setAbierto(false)}>
          Cancelar
        </button>
      </Dialogo>
    </>
  )
}

async function abrir() {
  const usuario = userEvent.setup()
  render(<Ejemplo />)
  await usuario.click(screen.getByRole('button', { name: 'Pedir plaza' }))
  // Sin esto, un test de «se cierra» pasaría con un diálogo sin rol.
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  return usuario
}

describe('Dialogo', () => {
  it('cerrado no está; abierto es un diálogo modal con nombre y descripción', async () => {
    const usuario = userEvent.setup()
    render(<Ejemplo />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Pedir plaza' }))

    const dialogo = screen.getByRole('dialog', { name: 'Pedir plaza en Alemán B1' })
    expect(dialogo).toHaveAttribute('aria-modal', 'true')
    expect(dialogo).toHaveAccessibleDescription('Te escribiremos para confirmarla.')
  })

  it('al abrirse, el foco entra en el primer control', async () => {
    await abrir()

    expect(screen.getByRole('textbox', { name: 'Nombre' })).toHaveFocus()
  })

  it('Tab y Mayús+Tab dan la vuelta sin salir del diálogo', async () => {
    const usuario = await abrir()

    await usuario.tab()
    expect(screen.getByRole('button', { name: 'Enviar' })).toHaveFocus()
    await usuario.tab()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()
    await usuario.tab()
    expect(screen.getByRole('textbox', { name: 'Nombre' })).toHaveFocus()

    await usuario.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()
  })

  it('mientras está abierto, lo de fuera queda oculto para la tecnología de apoyo', async () => {
    await abrir()

    // hidden: true para encontrarlo aunque esté oculto. Vale inert o aria-hidden.
    const fuera = screen.getByRole('button', { name: 'Pedir plaza', hidden: true })
    expect(fuera.closest('[inert], [aria-hidden="true"]')).not.toBeNull()
  })

  it('Escape cierra y el foco vuelve al botón que lo abrió', async () => {
    const usuario = await abrir()

    await usuario.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const pedirPlaza = screen.getByRole('button', { name: 'Pedir plaza' })
    expect(pedirPlaza).toHaveFocus()
    expect(pedirPlaza.closest('[inert], [aria-hidden="true"]')).toBeNull()
  })

  it('un botón de dentro también lo cierra y devuelve el foco', async () => {
    const usuario = await abrir()

    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pedir plaza' })).toHaveFocus()
  })

  it('pulsar en el fondo lo cierra; pulsar dentro, no', async () => {
    const usuario = await abrir()

    await usuario.click(screen.getByRole('heading', { name: 'Pedir plaza en Alemán B1' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // El fondo es decorativo: no tiene rol ni nombre, así que aquí sí
    // toca buscarlo por su clase.
    await usuario.click(document.querySelector('.kit-dialogo-fondo')!)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
