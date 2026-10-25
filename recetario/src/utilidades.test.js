import { describe, expect, it } from 'vitest'
import { normalizarIngredientes } from './utilidades.js'

describe('normalizarIngredientes', () => {
  it('filtra los huecos vacíos que deja la API al final', () => {
    const receta = {
      strIngredient1: 'Harina',
      strMeasure1: '250 g',
      strIngredient2: 'Leche',
      strMeasure2: '300 ml',
      strIngredient3: '',
      strMeasure3: '',
      strIngredient4: null,
      strMeasure4: null,
    }

    expect(normalizarIngredientes(receta)).toEqual([
      { ingrediente: 'Harina', medida: '250 g' },
      { ingrediente: 'Leche', medida: '300 ml' },
    ])
  })

  it('mantiene el ingrediente si su medida viene vacía', () => {
    const receta = {
      strIngredient1: 'Sal',
      strMeasure1: '',
    }

    expect(normalizarIngredientes(receta)).toEqual([
      { ingrediente: 'Sal', medida: '' },
    ])
  })
})
