import { Link } from 'react-router'
import { MensajeError, MensajeEstado } from '../componentes/Mensajes.jsx'
import { useCategorias } from '../consultas.js'

// La ruta índice de /categorias: todas las categorías con su foto.
export default function ListaCategorias() {
  // TODO (paso 8): pide las categorías con useCategorias(), lo mismo que su
  // madre. Mira en la pestaña Red cuántas peticiones salen.

  return (
    <>
      <title>Categorías · Recetario</title>
      {/* TODO (paso 8): cargando, «Cargando categorías…»; error, MensajeError; y si
          no, un <div className="rejilla-categorias"> con un Link por categoría:
          <Link key={…} className="tarjeta-categoria" to={categoria.strCategory}>
            <img src={categoria.strCategoryThumb} alt="" loading="lazy" />
            <h2>{categoria.strCategory}</h2>
          </Link> */}
      <MensajeEstado>Aquí irán las categorías (paso 8).</MensajeEstado>
    </>
  )
}
