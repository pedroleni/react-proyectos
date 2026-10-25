import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.jsx'
import './style.css'

// La caché de toda la aplicación: una sola, fuera de cualquier componente.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Una receta no cambia de un minuto para otro: se da por buena 5 minutos.
      staleTime: 5 * 60_000,
      // Un solo reintento: si TheMealDB no responde, mejor decirlo pronto.
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* El panel para ver la caché por dentro. No entra en el build de producción. */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
