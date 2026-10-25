import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'

describe('La matrícula, de principio a fin y solo con el teclado', () => {
  it('elige idioma, cambia de modalidad y pide plaza en un grupo', async () => {
    const usuario = userEvent.setup()
    render(<App />)

    // 1. Idioma: se vacía el campo, se escribe «ale» y se elige con Intro.
    const idioma = screen.getByRole('combobox', { name: 'Idioma' })
    await usuario.click(idioma)
    await usuario.keyboard('{Escape}{Escape}ale{ArrowDown}{Enter}')
    expect(idioma).toHaveValue('Alemán')

    // 2. Modalidad: del campo a las pestañas con Tab, y flecha derecha.
    await usuario.tab()
    expect(screen.getByRole('tab', { name: 'Intensivo' })).toHaveFocus()
    await usuario.keyboard('{ArrowRight}')
    const panel = screen.getByRole('tabpanel', { name: 'Extensivo' })
    expect(within(panel).getByRole('heading', { name: 'Alemán B2' })).toBeInTheDocument()

    // 3. Menú del grupo B2 y «Pedir plaza».
    const opciones = screen.getByRole('button', { name: 'Opciones de Alemán B2 (extensivo)' })
    opciones.focus()
    await usuario.keyboard('{Enter}')
    expect(screen.getByRole('menuitem', { name: 'Pedir plaza' })).toHaveFocus()
    await usuario.keyboard('{Enter}')

    // 4. El diálogo: el foco entra en el nombre.
    const dialogo = screen.getByRole('dialog', { name: 'Pedir plaza en Alemán B2 (extensivo)' })
    expect(within(dialogo).getByRole('textbox', { name: 'Nombre y apellidos' })).toHaveFocus()
    await usuario.keyboard('Lucía Ortega')
    await usuario.tab()
    await usuario.keyboard('lucia@correo.es')
    await usuario.click(within(dialogo).getByRole('button', { name: 'Enviar solicitud' }))

    // 5. Se cierra, se anuncia y el foco vuelve al botón del menú.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const aviso = screen.getByText(/Solicitud enviada/)
    expect(aviso).toHaveAttribute('role', 'status')
    expect(aviso).toHaveTextContent(
      'Solicitud enviada para Alemán B2 (extensivo). Te escribiremos a lucia@correo.es.',
    )
    expect(opciones).toHaveFocus()
  })
})
