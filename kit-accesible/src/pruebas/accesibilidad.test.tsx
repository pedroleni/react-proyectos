import { render } from '@testing-library/react'
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

  // TODO (paso 6): pasa axe en cada estado abierto del kit. Lleva la
  // página a ese estado con user-event, como haría una persona, y después
  // comprueba que problemas() devuelve una lista vacía.
  it.todo('con la lista del combobox abierta y una opción marcada')
  it.todo('con otra pestaña activa')
  it.todo('con un menú abierto')
  it.todo('con el diálogo abierto')
})
