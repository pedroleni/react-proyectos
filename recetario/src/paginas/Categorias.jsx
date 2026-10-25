import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router'
import { MensajeEstado } from '../componentes/Mensajes.jsx'
import { useCategorias } from '../consultas.js'

// La ruta madre de /categorias y /categorias/:nombre. Su cabecera y la fila de
// categorías se quedan montadas; lo que cambia va en el <Outlet />.
export default function Categorias() {
  const { data: categorias } = useCategorias()

  return (
    <section className="pagina seccion-contenido">
      <p className="antetitulo">Explora a tu manera</p>
      <h1>Categorías</h1>

      {categorias && (
        <nav className="chips" aria-label="Categorías">
          {categorias.map((categoria) => (
            // Enlace relativo: desde /categorias, «Beef» lleva a /categorias/Beef
            <NavLink key={categoria.idCategory} to={categoria.strCategory}>
              {categoria.strCategory}
            </NavLink>
          ))}
        </nav>
      )}

      {/* Un Suspense propio: mientras llega el archivo de una hija, la fila sigue a la vista */}
      <Suspense fallback={<MensajeEstado>Cargando…</MensajeEstado>}>
        <Outlet />
      </Suspense>
    </section>
  )
}
