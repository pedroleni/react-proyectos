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

  it('flecha abajo marca una opción con aria-activedescendant, sin mover el foco', async () => {
    const { usuario, campo } = montar()
    await usuario.type(campo, 'es')

    await usuario.keyboard('{ArrowDown}')

    const frances = screen.getByRole('option', { name: 'Francés' })
    expect(campo).toHaveFocus()
    expect(campo).toHaveAttribute('aria-activedescendant', frances.id)
    expect(frances).toHaveAttribute('aria-selected', 'true')

    await usuario.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    expect(campo).toHaveAttribute('aria-activedescendant', frances.id)
  })

  it('Intro elige la opción marcada, cierra la lista y avisa', async () => {
    const { usuario, campo, alCambiar } = montar()
    await usuario.type(campo, 'ale')

    await usuario.keyboard('{ArrowDown}{Enter}')

    expect(campo).toHaveValue('Alemán')
    expect(campo).toHaveAttribute('aria-expanded', 'false')
    expect(alCambiar).toHaveBeenLastCalledWith('Alemán')
  })

  it('flecha arriba abre la lista en la última opción', async () => {
    const { usuario, campo } = montar()
    await usuario.click(campo)

    await usuario.keyboard('{ArrowUp}')

    expect(campo).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Portugués' }).id)
  })

  it('Escape cierra la lista y, con la lista cerrada, vacía el campo', async () => {
    const { usuario, campo } = montar()
    await usuario.type(campo, 'gr')

    await usuario.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(campo).toHaveValue('gr')

    await usuario.keyboard('{Escape}')
    expect(campo).toHaveValue('')
  })

  it('con el ratón, un clic en una opción la elige', async () => {
    const { usuario, campo, alCambiar } = montar()
    await usuario.type(campo, 'g')

    await usuario.click(screen.getByRole('option', { name: 'Gallego' }))

    expect(campo).toHaveValue('Gallego')
    expect(alCambiar).toHaveBeenLastCalledWith('Gallego')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('sin coincidencias no hay lista, y se dice', async () => {
    const { usuario, campo } = montar()

    await usuario.type(campo, 'klingon')

    expect(campo).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Sin resultados')
  })
})
