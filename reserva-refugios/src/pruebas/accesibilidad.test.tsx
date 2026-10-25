import { screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { llegarAConfirmar, montarApp, rellenarRefugio } from './ayudas'

/** Las reglas que incumple la página entera, con su explicación. */
async function problemas() {
  // jsdom no pinta, así que no puede calcular contrastes: esa regla se
  // revisa en el navegador (lección 83).
  const { violations } = await axe(document.body, { rules: { 'color-contrast': { enabled: false } } })
  return violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)
}

describe('axe, en cada paso de la reserva', () => {
  it('el paso 1, recién cargado', async () => {
    montarApp()
    expect(await problemas()).toEqual([])
  })

  it('el paso 1, con errores', async () => {
    const usuario = montarApp()
    await usuario.click(screen.getByRole('button', { name: 'Ver plazas y seguir' }))
    await screen.findByText('Hay 2 campos por corregir.')

    expect(await problemas()).toEqual([])
  })

  it('el paso 2, con la columna de la reserva', async () => {
    const usuario = montarApp()
    await rellenarRefugio(usuario)
    await screen.findByRole('heading', { name: 'Paso 2 de 3: Quién viene' })

    expect(await problemas()).toEqual([])
  })

  it('el paso 3, con la casilla sin marcar', async () => {
    const usuario = montarApp()
    await llegarAConfirmar(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Confirmar reserva' }))
    await screen.findByText('Para reservar, tienes que aceptar las normas del refugio.')

    expect(await problemas()).toEqual([])
  })

  // TODO (paso 6): llega hasta «Reserva confirmada» (con fijarOcupadas, de
  // ../servidor/baseDeDatos, para que haya sitio seguro) y pasa axe.
  it.todo('la reserva confirmada')
})
