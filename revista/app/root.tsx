import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import type { Route } from './+types/root'
import './app.css'

export const links: Route.LinksFunction = () => [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]

// El documento entero: lo renderiza el servidor en cada petición y lo hidrata
// el navegador. Envuelve tanto a las páginas como a los ErrorBoundary.
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="cabecera">
          <Link to="/" className="cabecera-marca">
            Caja Baja
          </Link>
          <p className="cabecera-lema">Revista de tipografía e imprenta</p>
        </header>
        {children}
        <footer className="pie">
          <p>Caja Baja se escribe y se compone en el Taller La Minerva, en Zaragoza.</p>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

// Un error inesperado en cualquier página (un 500). Las direcciones que no
// existen tienen su propia ruta, no-encontrada.tsx.
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const noExiste = isRouteErrorResponse(error) && error.status === 404
  let detalle: string | undefined
  if (import.meta.env.DEV && error instanceof Error) detalle = error.stack

  return (
    <main className="no-encontrada">
      <title>{noExiste ? 'Página no encontrada · Caja Baja' : 'Error · Caja Baja'}</title>
      <meta name="robots" content="noindex" />
      <h1>{noExiste ? 'Esta página no existe' : 'Algo ha fallado'}</h1>
      <p>
        {noExiste
          ? 'Puede que la dirección esté mal escrita.'
          : 'No hemos podido preparar esta página. Inténtalo de nuevo dentro de un rato.'}
      </p>
      {detalle && <pre>{detalle}</pre>}
      <p>
        <Link to="/">Volver a la portada</Link>
      </p>
    </main>
  )
}
