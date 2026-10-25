import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Pestanas } from '@kit'

const MODALIDADES = [
  { id: 'intensivo', titulo: 'Intensivo', contenido: <p>De lunes a jueves, dos horas al día.</p> },
  { id: 'extensivo', titulo: 'Extensivo', contenido: <p>Dos tardes por semana.</p> },
  { id: 'en-linea', titulo: 'En línea', contenido: <p>Por videollamada.</p> },
]

function montar() {
  const usuario = userEvent.setup()
  render(
    <>
      <button type="button">Antes</button>
      <Pestanas etiqueta="Modalidades" pestanas={MODALIDADES} />
    </>,
  )
  return usuario
}

const pestana = (nombre: string) => screen.getByRole('tab', { name: nombre })
const panelVisible = () => screen.getByRole('tabpanel')

describe('Pestanas', () => {
  it('son una lista de pestañas con nombre, y solo se ve el panel activo', () => {
    montar()

    expect(screen.getByRole('tablist', { name: 'Modalidades' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(pestana('Intensivo')).toHaveAttribute('aria-selected', 'true')
    expect(pestana('Extensivo')).toHaveAttribute('aria-selected', 'false')
    // getByRole falla si hay más de uno: los ocultos no cuentan.
    expect(panelVisible()).toHaveAccessibleName('Intensivo')
    expect(panelVisible()).toHaveTextContent('De lunes a jueves')
  })

  it('el tabulador entra en la pestaña activa y sale al panel', async () => {
    const usuario = montar()

    await usuario.tab() // «Antes»
    await usuario.tab()
    expect(pestana('Intensivo')).toHaveFocus()

    await usuario.tab()
    expect(panelVisible()).toHaveFocus()
  })

  it('las flechas cambian de pestaña y dan la vuelta en los extremos', async () => {
    const usuario = montar()
    await usuario.click(pestana('Intensivo'))

    await usuario.keyboard('{ArrowRight}')
    expect(pestana('Extensivo')).toHaveFocus()
    expect(panelVisible()).toHaveAccessibleName('Extensivo')

    await usuario.keyboard('{ArrowRight}{ArrowRight}')
    expect(pestana('Intensivo')).toHaveFocus()
    expect(panelVisible()).toHaveAccessibleName('Intensivo')

    await usuario.keyboard('{ArrowLeft}')
    expect(pestana('En línea')).toHaveFocus()
    expect(panelVisible()).toHaveAccessibleName('En línea')
  })

  it('Inicio y Fin van a la primera y a la última', async () => {
    const usuario = montar()
    await usuario.click(pestana('Extensivo'))

    await usuario.keyboard('{End}')
    expect(pestana('En línea')).toHaveFocus()
    expect(pestana('En línea')).toHaveAttribute('aria-selected', 'true')

    await usuario.keyboard('{Home}')
    expect(pestana('Intensivo')).toHaveFocus()
    expect(pestana('Intensivo')).toHaveAttribute('aria-selected', 'true')
  })

  it('con el ratón, una pestaña se activa al pulsarla', async () => {
    const usuario = montar()

    await usuario.click(pestana('En línea'))

    expect(pestana('En línea')).toHaveAttribute('aria-selected', 'true')
    expect(panelVisible()).toHaveTextContent('Por videollamada.')
  })

  it('dos grupos de pestañas en la misma página no se pisan los ids', () => {
    render(
      <>
        <Pestanas etiqueta="Modalidades" pestanas={MODALIDADES} />
        <Pestanas
          etiqueta="Niveles"
          pestanas={[
            { id: 'intensivo', titulo: 'Básico', contenido: <p>A1 y A2.</p> },
            { id: 'extensivo', titulo: 'Avanzado', contenido: <p>C1 y C2.</p> },
          ]}
        />
      </>,
    )

    // Mismos id de pestaña en los dos grupos: si los ids del DOM chocaran,
    // los paneles tomarían el nombre del otro grupo.
    const paneles = screen.getAllByRole('tabpanel')
    expect(paneles[0]).toHaveAccessibleName('Intensivo')
    expect(paneles[1]).toHaveAccessibleName('Básico')
  })
})
