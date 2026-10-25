import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Metadatos from '~/componentes/Metadatos'

const meta = (selector: string) => document.head.querySelector(selector)?.getAttribute('content')

describe('Paso 4: título, descripción y Open Graph', () => {
  it('pone en el <head> el título, la descripción y la URL canónica', () => {
    render(
      <Metadatos
        titulo="La raya no es un guion"
        descripcion="Tres rayitas y tres trabajos."
        url="https://cajabaja.example/articulos/la-raya-no-es-un-guion"
        imagen="https://cajabaja.example/og/la-raya-no-es-un-guion.png"
        tipo="article"
      />,
    )
    expect(document.title).toBe('La raya no es un guion · Caja Baja')
    expect(meta('meta[name="description"]')).toBe('Tres rayitas y tres trabajos.')
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://cajabaja.example/articulos/la-raya-no-es-un-guion',
    )
  })

  it('pone las etiquetas Open Graph con property y la imagen con URL absoluta', () => {
    render(
      <Metadatos
        titulo="La raya no es un guion"
        descripcion="Tres rayitas y tres trabajos."
        url="https://cajabaja.example/articulos/la-raya-no-es-un-guion"
        imagen="https://cajabaja.example/og/la-raya-no-es-un-guion.png"
        tipo="article"
      />,
    )
    expect(meta('meta[property="og:title"]')).toBe('La raya no es un guion')
    expect(meta('meta[property="og:type"]')).toBe('article')
    expect(meta('meta[property="og:url"]')).toBe('https://cajabaja.example/articulos/la-raya-no-es-un-guion')
    expect(meta('meta[property="og:image"]')).toBe('https://cajabaja.example/og/la-raya-no-es-un-guion.png')
    expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image')
  })
})
