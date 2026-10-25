import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Menu, OpcionMenu } from '@kit'

// Las referencias se toman antes de abrir: con el menú abierto, una
// librería puede ocultar el resto de la página al lector de pantalla
// (aria-hidden), y entonces getByRole ya no lo encontraría.
function montar() {
  const usuario = userEvent.setup()
  const alElegir = vi.fn()
  render(
    <>
      <Menu etiqueta="Opciones" aria-label="Opciones de Alemán B1">
        <OpcionMenu onSeleccionar={() => alElegir('plaza')}>Pedir plaza</OpcionMenu>
        <OpcionMenu onSeleccionar={() => alElegir('calendario')}>Añadir al calendario</OpcionMenu>
        <OpcionMenu onSeleccionar={() => alElegir('horario')}>Avisarme si cambia el horario</OpcionMenu>
      </Menu>
      <button type="button">Siguiente</button>
    </>,
  )
  const boton = screen.getByRole('button', { name: 'Opciones de Alemán B1' })
  const siguiente = screen.getByRole('button', { name: 'Siguiente' })
  async function abrirConTeclado(tecla = '{Enter}') {
    await usuario.tab()
    expect(boton).toHaveFocus()
    await usuario.keyboard(tecla)
  }
  return { usuario, alElegir, boton, siguiente, abrirConTeclado }
}

const opcion = (nombre: string) => screen.getByRole('menuitem', { name: nombre })

describe('Menu', () => {
  it('el botón anuncia que abre un menú, y si está abierto', () => {
    const { boton } = montar()

    expect(boton).toHaveAttribute('aria-haspopup', 'menu')
    expect(boton).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('Intro abre el menú y enfoca la primera opción', async () => {
    const { boton, abrirConTeclado } = montar()

    await abrirConTeclado()

    expect(screen.getByRole('menu', { name: 'Opciones de Alemán B1' })).toBeInTheDocument()
    expect(boton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
    expect(opcion('Pedir plaza')).toHaveFocus()
  })

  it('flecha arriba abre el menú en la última opción', async () => {
    const { abrirConTeclado } = montar()

    await abrirConTeclado('{ArrowUp}')

    expect(opcion('Avisarme si cambia el horario')).toHaveFocus()
  })

  it('las flechas recorren las opciones y dan la vuelta; Inicio y Fin van a los extremos', async () => {
    const { usuario, abrirConTeclado } = montar()
    await abrirConTeclado()

    await usuario.keyboard('{ArrowDown}')
    expect(opcion('Añadir al calendario')).toHaveFocus()
    await usuario.keyboard('{ArrowDown}{ArrowDown}')
    expect(opcion('Pedir plaza')).toHaveFocus()
    await usuario.keyboard('{ArrowUp}')
    expect(opcion('Avisarme si cambia el horario')).toHaveFocus()
    await usuario.keyboard('{Home}')
    expect(opcion('Pedir plaza')).toHaveFocus()
    await usuario.keyboard('{End}')
    expect(opcion('Avisarme si cambia el horario')).toHaveFocus()
  })

  it('Escape cierra el menú y devuelve el foco al botón', async () => {
    const { usuario, alElegir, boton, abrirConTeclado } = montar()
    await abrirConTeclado()

    await usuario.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(boton).toHaveFocus()
    expect(alElegir).not.toHaveBeenCalled()
  })

  it('Intro en una opción la elige, cierra el menú y devuelve el foco', async () => {
    const { usuario, alElegir, boton, abrirConTeclado } = montar()
    await abrirConTeclado()

    await usuario.keyboard('{ArrowDown}{Enter}')

    expect(alElegir).toHaveBeenCalledExactlyOnceWith('calendario')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(boton).toHaveFocus()
  })

  it('Tab cierra el menú y sigue al siguiente elemento de la página', async () => {
    const { usuario, siguiente, abrirConTeclado } = montar()
    await abrirConTeclado()

    await usuario.tab()

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(siguiente).toHaveFocus()
  })

  it('con el ratón: se abre con un clic y se elige con otro', async () => {
    const { usuario, alElegir, boton } = montar()

    await usuario.click(boton)
    await usuario.click(opcion('Pedir plaza'))

    expect(alElegir).toHaveBeenCalledExactlyOnceWith('plaza')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('un clic fuera lo cierra sin elegir nada', async () => {
    const { usuario, alElegir, boton, siguiente } = montar()
    await usuario.click(boton)

    await usuario.click(siguiente)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(alElegir).not.toHaveBeenCalled()
  })
})
