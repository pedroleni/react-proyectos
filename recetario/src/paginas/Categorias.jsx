import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router'
import { MensajeEstado } from '../componentes/Mensajes.jsx'
import { useCategorias } from '../consultas.js'

// La ruta madre de /categorias y /categorias/:nombre. Su cabecera y la fila de
// categorías se quedan montadas; lo que cambia va en el hueco de la ruta hija.
export default function Categorias() {
  // TODO (paso 8): pide las categorías con useCategorias().

  return (
    <section className="pagina seccion-contenido">
      <p className="antetitulo">Explora a tu manera</p>
      <h1>Categorías</h1>

      {/* TODO (paso 8): cuando lleguen las categorías, una
          <nav className="chips" aria-label="Categorías"> con un NavLink por
          categoría (key: idCategory). El enlace es relativo: to={categoria.strCategory}
          lleva de /categorias a /categorias/Beef. */}

      {/* TODO (paso 8): el hueco donde se pintan las rutas hijas.
          TODO (paso 9): envuélvelo en su propio <Suspense> con
          <MensajeEstado>Cargando…</MensajeEstado>, para que la fila siga a la vista. */}
    </section>
  )
}
