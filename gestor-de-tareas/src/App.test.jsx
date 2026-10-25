// Tests de la aplicación entera con Testing Library (lección 83): montan
// <App />, hacen lo que haría una persona y comprueban lo que vería. Ninguno
// sabe que hay un reductor ni un contexto: buscan por rol, etiqueta y texto.
//
// Los cuatro primeros ya están escritos: se ponen en verde cuando terminas
// los pasos 1 a 4. Los marcados con it.todo los escribes tú en el paso 5.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
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

  it('marca una tarea como completada y descuenta el contador', async () => {
    const { usuario } = montarApp()
    await anadir(usuario, 'Comprar pan')

    await usuario.click(screen.getByRole('checkbox', { name: 'Marcar "Comprar pan" como completada' }))

    expect(screen.getByRole('checkbox', { name: 'Marcar "Comprar pan" como pendiente' })).toBeChecked()
    expect(screen.getByText('0 tareas pendientes')).toBeInTheDocument()
  })

  // TODO (paso 5): escribe estos tests. Cambia it.todo('...') por
  // it('...', async () => { ... }) y usa los de arriba como modelo.
  it.todo('añade una tarea al pulsar Intro')
  it.todo('no añade una tarea que solo tiene espacios')
  it.todo('borra una tarea')
  it.todo('filtra las pendientes y las completadas, y marca el filtro activo')
  it.todo('deja el foco en la casilla que acabas de marcar')
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

  // TODO (paso 5): prepara localStorage con localStorage.setItem(
  // 'gestor-de-tareas:v1', ...) ANTES de montar la aplicación.
  it.todo('arranca con las tareas que ya había guardadas')
  it.todo('arranca vacía si lo guardado no es JSON')
  it.todo('arranca vacía si lo guardado no es una lista')
})
