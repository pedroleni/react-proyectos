import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { MemoryRouter } from 'react-router'
import App from './App.jsx'
import { servidor } from './test/servidor.js'

const API = 'https://www.themealdb.com/api/json/v1/1'

// Cada test, con su propia caché y su propio historial en memoria.
function montar(ruta) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[ruta]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms))

describe('rutas', () => {
  it('una dirección que no existe enseña la página no encontrada', async () => {
    montar('/ofertas')
    expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
  })

  it('una receta que no existe lo dice, con el menú a la vista', async () => {
    montar('/receta/999')
    expect(await screen.findByText('No hemos encontrado esa receta.', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Categorías' })).toBeInTheDocument()
  })

  it('la ficha de una receta se abre por su id', async () => {
    montar('/receta/3')
    expect(await screen.findByRole('heading', { name: 'Tortilla de patatas', level: 1 }, { timeout: 3000 })).toBeInTheDocument()
  })

  it('una categoría se abre dentro de la página de categorías', async () => {
    montar('/categorias/Dessert')
    expect(await screen.findByRole('heading', { name: 'Tarta de queso' }, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Categorías', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dessert', current: 'page' })).toBeInTheDocument()
  })
})

describe('búsqueda', () => {
  it('la búsqueda llega en la URL y rellena el campo', async () => {
    montar('/buscar?q=tarta')
    expect(await screen.findByText('2 resultados para «tarta».', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Nombre de la receta' })).toHaveValue('tarta')
  })

  it('una respuesta que llega tarde no pisa la búsqueda nueva', async () => {
    // «tarta» tarda 300 ms en llegar; «tortilla», casi nada.
    servidor.use(
      http.get(`${API}/search.php`, async ({ request }) => {
        const texto = new URL(request.url).searchParams.get('s')
        if (texto === 'tarta') {
          await delay(300)
          return HttpResponse.json({ meals: [{ idMeal: '1', strMeal: 'Tarta de Santiago', strMealThumb: '' }] })
        }
        return HttpResponse.json({ meals: [{ idMeal: '3', strMeal: 'Tortilla de patatas', strMealThumb: '' }] })
      }),
    )
    const usuario = userEvent.setup()
    montar('/buscar')
    const campo = await screen.findByRole('searchbox', { name: 'Nombre de la receta' }, { timeout: 3000 })

    await usuario.type(campo, 'tarta{Enter}')
    await usuario.clear(campo)
    await usuario.type(campo, 'tortilla{Enter}')

    expect(await screen.findByText('1 resultado para «tortilla».')).toBeInTheDocument()
    await esperar(500) // la respuesta de «tarta» ya habría llegado
    expect(screen.getByText('1 resultado para «tortilla».')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Tarta de Santiago' })).not.toBeInTheDocument()
  })

  it('el error de una búsqueda abandonada no aparece en la página siguiente', async () => {
    // El bug real del recetario en JavaScript: buscar algo que falla y, antes de
    // que responda, irse a Categorías.
    servidor.use(
      http.get(`${API}/search.php`, async () => {
        await delay(300)
        return new HttpResponse(null, { status: 500 })
      }),
    )
    const usuario = userEvent.setup()
    montar('/buscar')
    const campo = await screen.findByRole('searchbox', { name: 'Nombre de la receta' }, { timeout: 3000 })

    await usuario.type(campo, 'fallo{Enter}')
    await usuario.click(screen.getByRole('link', { name: 'Categorías' }))

    expect(await screen.findByRole('heading', { name: 'Vegetarian' }, { timeout: 3000 })).toBeInTheDocument()
    await esperar(500) // el 500 de la búsqueda ya habría llegado
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
