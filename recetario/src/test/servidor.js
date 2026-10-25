// Una TheMealDB de mentira para los tests: responde siempre lo mismo y no
// necesita red. Cada test puede cambiar una ruta con servidor.use(...).

import { http, HttpResponse } from 'msw/http'
import { setupServer } from 'msw/node'

const API = 'https://www.themealdb.com/api/json/v1/1'

export const recetas = [
  { idMeal: '1', strMeal: 'Tarta de Santiago', strCategory: 'Dessert', strMealThumb: 'https://example.com/1.jpg' },
  { idMeal: '2', strMeal: 'Tarta de queso', strCategory: 'Dessert', strMealThumb: 'https://example.com/2.jpg' },
  { idMeal: '3', strMeal: 'Tortilla de patatas', strCategory: 'Vegetarian', strMealThumb: 'https://example.com/3.jpg' },
]

export const categorias = [
  { idCategory: '3', strCategory: 'Dessert', strCategoryThumb: 'https://example.com/dessert.png' },
  { idCategory: '12', strCategory: 'Vegetarian', strCategoryThumb: 'https://example.com/vegetarian.png' },
]

function buscarEnRecetas(texto) {
  const encontradas = recetas.filter((receta) => receta.strMeal.toLowerCase().includes(texto.toLowerCase()))
  return encontradas.length > 0 ? encontradas : null
}

export const manejadores = [
  http.get(`${API}/search.php`, ({ request }) => {
    const texto = new URL(request.url).searchParams.get('s') ?? ''
    return HttpResponse.json({ meals: buscarEnRecetas(texto) })
  }),
  http.get(`${API}/lookup.php`, ({ request }) => {
    const id = new URL(request.url).searchParams.get('i')
    const receta = recetas.find((r) => r.idMeal === id)
    return HttpResponse.json({ meals: receta ? [receta] : null })
  }),
  http.get(`${API}/random.php`, () => HttpResponse.json({ meals: [recetas[0]] })),
  http.get(`${API}/categories.php`, () => HttpResponse.json({ categories: categorias })),
  http.get(`${API}/filter.php`, ({ request }) => {
    const nombre = new URL(request.url).searchParams.get('c')
    const deEsa = recetas.filter((r) => r.strCategory === nombre)
    return HttpResponse.json({ meals: deEsa.length > 0 ? deEsa : null })
  }),
]

export const servidor = setupServer(...manejadores)
