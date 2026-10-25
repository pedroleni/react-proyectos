import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './estilos.css'
import './transiciones.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* React Router hace cada navegación dentro de una transición: es lo que
        activa los <ViewTransition>. No le pongas useTransitions={false}. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
