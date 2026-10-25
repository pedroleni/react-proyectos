import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Combobox } from '@kit'

const IDIOMAS = ['Alemán', 'Árabe', 'Francés', 'Gallego', 'Griego', 'Inglés', 'Portugués']

function Ejemplo({ alCambiar }: { alCambiar: (valor: string | null) => void }) {
  const [idioma, setIdioma] = useState<string | null>(null)
  return (
    <Combobox
      etiqueta="Idioma"
      opciones={IDIOMAS}
      valor={idioma}
      onCambiar={(valor) => {
        setIdioma(valor)
        alCambiar(valor)
      }}
    />
  )
}

function montar() {
  const usuario = userEvent.setup()
  const alCambiar = vi.fn()
  render(<Ejemplo alCambiar={alCambiar} />)
  return { usuario, alCambiar, campo: screen.getByRole('combobox', { name: 'Idioma' }) }
}

const opcionesVisibles = () =>
  within(screen.getByRole('listbox', { name: 'Idioma' }))
    .getAllByRole('option')
    .map((opcion) => opcion.textContent)

describe('Combobox', () => {
  it('es un combobox con su etiqueta y empieza con la lista cerrada', () => {
    const { campo } = montar()

    expect(campo).toHaveAttribute('aria-expanded', 'false')
    expect(campo).toHaveAttribute('aria-autocomplete', 'list')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('al escribir filtra sin distinguir tildes ni mayúsculas, y anuncia cuántos hay', async () => {
    const { usuario, campo } = montar()

    await usuario.type(campo, 'GR')

    expect(campo).toHaveAttribute('aria-expanded', 'true')
    expect(opcionesVisibles()).toEqual(['Griego'])
    expect(screen.getByRole('status')).toHaveTextContent('1 resultado')

    await usuario.clear(campo)
    await usuario.type(campo, 'es')
    expect(opcionesVisibles()).toEqual(['Francés', 'Inglés', 'Portugués'])
    expect(screen.getByRole('status')).toHaveTextContent('3 resultados')
  })

  // TODO (paso 6): escribe estos tests. Cambia it.todo por it, con la
  // función del test, como en los dos de arriba y en los de Dialogo.test.tsx.
  it.todo('flecha abajo marca una opción con aria-activedescendant, sin mover el foco')
  it.todo('Intro elige la opción marcada, cierra la lista y avisa')
  it.todo('flecha arriba abre la lista en la última opción')
  it.todo('Escape cierra la lista y, con la lista cerrada, vacía el campo')
  it.todo('con el ratón, un clic en una opción la elige')
  it.todo('sin coincidencias no hay lista, y se dice')
})
