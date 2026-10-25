import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './estilos.css'

// Este proyecto no tiene servidor: lo simula MSW (lección 84). Con
// npm run dev, el plugin msw() de vite.config.ts sirve el service worker y
// virtual:msw lo pone en marcha con los mismos manejadores que usan los
// tests. Hay que esperar a que esté listo antes de pintar nada: si la app
// pidiera algo antes, la petición saldría a la red de verdad.
let PanelServidor: ComponentType | null = null

if (import.meta.env.DEV) {
  const { network } = await import('virtual:msw')
  const { manejadores } = await import('./servidor/manejadores')
  // Cualquier otra petición (el código de la app, el favicon...) sigue su camino.
  network.configure({ handlers: manejadores, onUnhandledFrame: 'bypass' })
  await network.enable()
  PanelServidor = (await import('./servidor/PanelServidor')).default
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {PanelServidor && <PanelServidor />}
  </StrictMode>,
)
