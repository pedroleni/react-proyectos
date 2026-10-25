import { screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { montar } from './montar'
import { imitarViewTransitions, type TransicionApuntada } from './transicionesDeMentira'

// Lo que React le pide al navegador en cada navegación: document.startViewTransition
// con los tipos de la transición. Aquí no se anima nada (jsdom no pinta); se
// comprueba que la dirección llega hasta React a través de React Router.

let apuntadas: TransicionApuntada[]
let quitar: () => void

beforeEach(() => {
  ;({ apuntadas, quitar } = imitarViewTransitions())
})

afterEach(() => {
  quitar()
})

function ultimosTipos(): string[] | undefined {
  return apuntadas.at(-1)?.tipos
}

describe('Paso 5: anterior y siguiente, con dirección', () => {
  it('«Foto siguiente» es una transición de tipo adelante, y «Foto anterior», de tipo atras', async () => {
    const usuario = montar('/foto/ercina-nevado')

    await usuario.click(screen.getByRole('link', { name: 'Foto siguiente' }))
    await screen.findByRole('heading', { level: 1, name: 'Hórreos de Espinaredo' })
    expect(ultimosTipos()).toEqual(['adelante'])

    await usuario.click(screen.getByRole('link', { name: 'Foto anterior' }))
    await screen.findByRole('heading', { level: 1, name: 'Primera nevada en el lago Ercina' })
    expect(ultimosTipos()).toEqual(['atras'])
  })
})

describe('Paso 6: las pestañas, con dirección', () => {
  it('ir a una pestaña de la derecha es adelante, y a una de la izquierda, atras', async () => {
    const usuario = montar('/')

    await usuario.click(screen.getByRole('link', { name: 'Visita' }))
    await screen.findByRole('heading', { name: 'Visita la exposición' })
    expect(ultimosTipos()).toEqual(['adelante'])

    await usuario.click(screen.getByRole('link', { name: 'Participa' }))
    await screen.findByRole('heading', { name: 'Participa en la muestra de 2027' })
    expect(ultimosTipos()).toEqual(['atras'])
  })
})
