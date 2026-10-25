import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { montar } from './montar'

describe('La galería', () => {
  it('enseña las doce fotos, cada una con su enlace', () => {
    montar('/')
    const galeria = screen.getByRole('region', { name: 'Doce fotos del invierno asturiano' })
    expect(within(galeria).getAllByRole('link')).toHaveLength(12)
    expect(within(galeria).getByRole('link', { name: /El faro de Peñas al anochecer/ })).toHaveAttribute(
      'href',
      '/foto/faro-de-penas',
    )
  })

  it('al abrir una foto, enseña su ficha', async () => {
    const usuario = montar('/')
    await usuario.click(screen.getByRole('link', { name: /El faro de Peñas al anochecer/ }))

    expect(await screen.findByRole('heading', { level: 1, name: 'El faro de Peñas al anochecer' })).toBeInTheDocument()
    expect(screen.getByText('Costa · 4 de 12')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Un faro blanco sobre un cabo/ })).toBeInTheDocument()
  })

  it('«Foto siguiente» y «Foto anterior» recorren la muestra y dan la vuelta', async () => {
    const usuario = montar('/foto/bufones-de-pria')

    await usuario.click(screen.getByRole('link', { name: 'Foto siguiente' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'El Urriellu entre nubes' })).toBeInTheDocument()

    await usuario.click(screen.getByRole('link', { name: 'Foto anterior' }))
    await usuario.click(screen.getByRole('link', { name: 'Foto anterior' }))
    // Antes de la primera, la última.
    expect(await screen.findByRole('heading', { level: 1, name: 'Teitos en la braña' })).toBeInTheDocument()
  })

  it('una foto que no existe tiene su mensaje', async () => {
    montar('/foto/no-existe')
    expect(screen.getByRole('heading', { name: 'No encontramos esa foto.' })).toBeInTheDocument()
  })

  it('una dirección que no existe enseña la página 404 dentro de la galería', () => {
    montar('/fotos')
    expect(screen.getByRole('heading', { name: 'Esta página no existe.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Galería' })).toHaveAttribute('aria-current', 'page')
  })
})

describe('Paso 4: el foco, en un efecto de layout', () => {
  it('al abrir una foto, el foco va a su título', async () => {
    const usuario = montar('/')
    await usuario.click(screen.getByRole('link', { name: /Hórreos de Espinaredo/ }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Hórreos de Espinaredo' })).toHaveFocus()
  })

  it('al volver a la galería, el foco vuelve a la foto de la que vienes', async () => {
    const usuario = montar('/foto/redes-en-tazones')
    await usuario.click(screen.getByRole('link', { name: 'Volver a la galería' }))

    expect(await screen.findByRole('link', { name: /Redes al sol en Tazones/ })).toHaveFocus()
  })
})
