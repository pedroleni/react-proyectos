// Tests de la aplicación entera con Testing Library (lección 83): montan
// <App />, hacen lo que haría una persona y comprueban lo que vería. Ninguno
// sabe que hay un reductor ni un contexto: buscan por rol, etiqueta y texto.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

// Monta la aplicación en StrictMode, como main.jsx, y devuelve la persona
// virtual de user-event y una función para desmontarla.
function montarApp() {
  const usuario = userEvent.setup()
  const { unmount } = render(<App />, { reactStrictMode: true })
  return { usuario, desmontar: unmount }
}

async function anadir(usuario, texto) {
  await usuario.type(screen.getByLabelText('Nueva tarea'), texto)
  await usuario.click(screen.getByRole('button', { name: 'Añadir' }))
}

describe('Gestor de tareas', () => {
  it('empieza vacío y lo dice', () => {
    montarApp()

    expect(screen.getByText('No hay tareas todavía.')).toBeVisible()
    expect(screen.getByText('0 tareas pendientes')).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('añade una tarea, vacía el campo y le devuelve el foco', async () => {
    const { usuario } = montarApp()

    await anadir(usuario, 'Comprar pan')

    expect(screen.getByRole('listitem')).toHaveTextContent('Comprar pan')
    expect(screen.getByText('1 tarea pendiente')).toBeInTheDocument()
    expect(screen.getByLabelText('Nueva tarea')).toHaveValue('')
    expect(screen.getByLabelText('Nueva tarea')).toHaveFocus()
  })

  it('añade una tarea al pulsar Intro', async () => {
    const { usuario } = montarApp()

    await usuario.type(screen.getByLabelText('Nueva tarea'), 'Renovar el DNI{Enter}')

    expect(screen.getByRole('listitem')).toHaveTextContent('Renovar el DNI')
  })

  it('no añade una tarea que solo tiene espacios', async () => {
    const { usuario } = montarApp()

    await anadir(usuario, '   ')

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    expect(screen.getByText('0 tareas pendientes')).toBeInTheDocument()
  })

  it('marca una tarea como completada y descuenta el contador', async () => {
    const { usuario } = montarApp()
    await anadir(usuario, 'Comprar pan')

    await usuario.click(screen.getByRole('checkbox', { name: 'Marcar "Comprar pan" como completada' }))

    expect(screen.getByRole('checkbox', { name: 'Marcar "Comprar pan" como pendiente' })).toBeChecked()
    expect(screen.getByText('0 tareas pendientes')).toBeInTheDocument()
  })

  it('borra una tarea', async () => {
    const { usuario } = montarApp()
    await anadir(usuario, 'Comprar pan')
    await anadir(usuario, 'Renovar el DNI')

    await usuario.click(screen.getByRole('button', { name: 'Borrar "Comprar pan"' }))

    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.queryByText('Comprar pan')).not.toBeInTheDocument()
    expect(screen.getByText('1 tarea pendiente')).toBeInTheDocument()
  })

  it('filtra las pendientes y las completadas, y marca el filtro activo', async () => {
    const { usuario } = montarApp()
    await anadir(usuario, 'Comprar pan')
    await anadir(usuario, 'Renovar el DNI')
    await usuario.click(screen.getByRole('checkbox', { name: 'Marcar "Renovar el DNI" como completada' }))

    await usuario.click(screen.getByRole('button', { name: 'Pendientes' }))

    expect(screen.getByRole('button', { name: 'Pendientes' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('listitem')).toHaveTextContent('Comprar pan')

    await usuario.click(screen.getByRole('button', { name: 'Completadas' }))

    expect(screen.getByRole('listitem')).toHaveTextContent('Renovar el DNI')
    // El contador cuenta todas las tareas, no las que se ven.
    expect(screen.getByText('1 tarea pendiente')).toBeInTheDocument()
  })

  it('deja el foco en la casilla que acabas de marcar', async () => {
    const { usuario } = montarApp()
    await anadir(usuario, 'Comprar pan')
    await anadir(usuario, 'Renovar el DNI')

    const casilla = screen.getByRole('checkbox', { name: 'Marcar "Renovar el DNI" como completada' })
    casilla.focus()
    await usuario.keyboard(' ')

    expect(casilla).toBeChecked()
    expect(casilla).toHaveFocus()
  })
})

describe('Persistencia', () => {
  it('recuerda las tareas al volver a abrir la aplicación', async () => {
    const { usuario, desmontar } = montarApp()
    await anadir(usuario, 'Comprar pan')
    await usuario.click(screen.getByRole('checkbox', { name: 'Marcar "Comprar pan" como completada' }))
    desmontar()

    montarApp()

    expect(screen.getByRole('checkbox', { name: 'Marcar "Comprar pan" como pendiente' })).toBeChecked()
  })

  it('arranca con las tareas que ya había guardadas', () => {
    localStorage.setItem(
      'gestor-de-tareas:v1',
      JSON.stringify([{ id: 'a1', texto: 'Devolver los libros', completada: false, creadaEn: '2026-10-20T09:00:00.000Z' }]),
    )

    montarApp()

    expect(screen.getByRole('listitem')).toHaveTextContent('Devolver los libros')
    expect(screen.getByText('1 tarea pendiente')).toBeInTheDocument()
  })

  it('arranca vacía si lo guardado no es JSON', () => {
    const consola = vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorage.setItem('gestor-de-tareas:v1', 'esto no es json')

    montarApp()

    expect(screen.getByText('No hay tareas todavía.')).toBeVisible()
    expect(consola).toHaveBeenCalled()
    consola.mockRestore()
  })

  it('arranca vacía si lo guardado no es una lista', () => {
    localStorage.setItem('gestor-de-tareas:v1', '{}')

    montarApp()

    expect(screen.getByText('No hay tareas todavía.')).toBeVisible()
  })
})
