import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import App from '../App'

/** Las reglas que incumple la página entera, con su explicación. */
async function problemas(desactivar: string[] = []) {
  // jsdom no pinta, así que no puede calcular contrastes: esa regla se
  // revisa en el navegador (lección 83).
  const rules = Object.fromEntries(['color-contrast', ...desactivar].map((id) => [id, { enabled: false }]))
  // document.body y no el container: diálogo y menú viven en portales.
  const { violations } = await axe(document.body, { rules })
  return violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)
}

describe('axe, en cada estado del kit', () => {
  it('la página recién cargada', async () => {
    render(<App />)
    expect(await problemas()).toEqual([])
  })

  it('con la lista del combobox abierta y una opción marcada', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await usuario.clear(screen.getByRole('combobox', { name: 'Idioma' }))
    await usuario.keyboard('a{ArrowDown}')

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(await problemas()).toEqual([])
  })

  it('con otra pestaña activa', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await usuario.click(screen.getByRole('tab', { name: 'En línea' }))

    expect(await problemas()).toEqual([])
  })

  it('con un menú abierto', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await usuario.click(screen.getByRole('button', { name: 'Opciones de Inglés A1 (intensivo)' }))

    expect(screen.getByRole('menu')).toBeInTheDocument()
    // El menú está en un portal, al final de <body> y fuera de <main>. La
    // regla «region» (una buena práctica, no un criterio WCAG) cuenta un
    // diálogo como región, pero no un menú: aquí se desactiva sabiendo por qué.
    expect(await problemas(['region'])).toEqual([])
  })

  it('con el diálogo abierto', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await usuario.click(screen.getByRole('button', { name: 'Opciones de Inglés A1 (intensivo)' }))
    await usuario.click(screen.getByRole('menuitem', { name: 'Pedir plaza' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(await problemas()).toEqual([])
  })
})
