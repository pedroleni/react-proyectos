import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.jsx'
import './style.css'

// TODO (paso 1): crea aquí, fuera de cualquier componente, la caché de toda la
// aplicación: un QueryClient cuyas consultas den los datos por buenos 5 minutos
// (staleTime) y reintenten una sola vez (retry).

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* TODO (paso 1): envuelve <App /> en un QueryClientProvider con tu cliente y,
        dentro, en un BrowserRouter. Pon <ReactQueryDevtools /> dentro del
        proveedor, al lado del router, para ver la caché por dentro. */}
    <App />
  </StrictMode>,
)
