import { Suspense, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigationType } from 'react-router'
import { MensajeEstado } from './Mensajes.jsx'

export default function Maquetacion() {
  const { pathname } = useLocation()
  const tipoDeNavegacion = useNavigationType()

  // Al abrir otra página, arriba del todo. Con Atrás y Adelante (POP) no:
  // el navegador ya devuelve el scroll a donde estaba.
  useEffect(() => {
    if (tipoDeNavegacion !== 'POP') window.scrollTo(0, 0)
  }, [pathname, tipoDeNavegacion])

  return (
    <>
      <header className="cabecera-sitio">
        <nav className="navbar" aria-label="Navegación principal">
          <Link className="navbar-marca" to="/">
            Recetario
          </Link>
          <div className="navbar-enlaces">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/buscar">Buscar</NavLink>
            <NavLink to="/categorias">Categorías</NavLink>
          </div>
        </nav>
      </header>
      <main>
        {/* Mientras llega el archivo de una página con lazy */}
        <Suspense
          fallback={
            <div className="pagina seccion-contenido">
              <MensajeEstado>Cargando la página…</MensajeEstado>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <footer className="pie">
        Recetas e imágenes de <a href="https://www.themealdb.com">TheMealDB</a>
      </footer>
    </>
  )
}
