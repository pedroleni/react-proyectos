import { Suspense, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigationType } from 'react-router'
import { MensajeEstado } from './Mensajes.jsx'

export default function Maquetacion() {
  // TODO (paso 3): al cambiar de página (pathname), vuelve arriba del todo con
  // window.scrollTo(0, 0), salvo si se ha llegado con Atrás o Adelante: en ese
  // caso useNavigationType() vale 'POP' y el navegador ya recoloca el scroll.

  return (
    <>
      <header className="cabecera-sitio">
        <nav className="navbar" aria-label="Navegación principal">
          {/* TODO (paso 3): cambia estos <a> por Link (la marca) y NavLink (el menú),
              para navegar sin recargar y marcar la página actual. */}
          <a className="navbar-marca" href="/">
            Recetario
          </a>
          <div className="navbar-enlaces">
            <a href="/">Inicio</a>
            <a href="/buscar">Buscar</a>
            <a href="/categorias">Categorías</a>
          </div>
        </nav>
      </header>
      <main>
        {/* TODO (paso 3): aquí va el hueco donde se pinta la página de cada ruta.
            TODO (paso 9): envuelve ese hueco en un <Suspense> cuyo fallback sea
            <div className="pagina seccion-contenido"><MensajeEstado>Cargando la página…</MensajeEstado></div> */}
      </main>
      <footer className="pie">
        Recetas e imágenes de <a href="https://www.themealdb.com">TheMealDB</a>
      </footer>
    </>
  )
}
