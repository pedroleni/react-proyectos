import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { montar } from './montar'

describe('Las pestañas', () => {
  it('la de la sección actual lleva aria-current', () => {
    montar('/visita')
    expect(screen.getByRole('link', { name: 'Visita' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Galería' })).not.toHaveAttribute('aria-current')
  })

  it('solo se ve la sección de la pestaña activa', () => {
    montar('/participa')
    expect(screen.getByRole('heading', { level: 1, name: 'Participa en la muestra de 2027' })).toBeInTheDocument()
    // Las otras dos, si están montadas, están escondidas: fuera del árbol de accesibilidad.
    expect(screen.queryByRole('heading', { name: 'Doce fotos del invierno asturiano' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Visita la exposición' })).not.toBeInTheDocument()
  })
})

describe('Paso 1: cada pestaña, dentro de un <Activity>', () => {
  it('«Participa» conserva lo escrito al irte a otra pestaña y volver', async () => {
    const usuario = montar('/participa')
    await usuario.type(screen.getByLabelText('Nombre'), 'Rosa Cueto')
    await usuario.type(screen.getByLabelText('Cuéntanos la foto'), 'Niebla en el puerto')

    await usuario.click(screen.getByRole('link', { name: 'Galería' }))
    await screen.findByRole('heading', { name: 'Doce fotos del invierno asturiano' })
    await usuario.click(screen.getByRole('link', { name: 'Participa' }))

    await screen.findByRole('heading', { name: 'Participa en la muestra de 2027' })
    expect(screen.getByLabelText('Nombre')).toHaveValue('Rosa Cueto')
    expect(screen.getByLabelText('Cuéntanos la foto')).toHaveValue('Niebla en el puerto')
  })
})

describe('Paso 2: la galería recuerda dónde se quedó', () => {
  it('la pestaña «Galería» vuelve a la foto que estabas mirando', async () => {
    const usuario = montar('/foto/faro-de-penas')

    await usuario.click(screen.getByRole('link', { name: 'Participa' }))
    await screen.findByRole('heading', { name: 'Participa en la muestra de 2027' })
    expect(screen.getByRole('link', { name: 'Galería' })).toHaveAttribute('href', '/foto/faro-de-penas')

    await usuario.click(screen.getByRole('link', { name: 'Galería' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'El faro de Peñas al anochecer' })).toBeInTheDocument()
  })
})
