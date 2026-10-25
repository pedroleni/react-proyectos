import { Link } from 'react-router'
import { MensajeError, MensajeEstado } from '../componentes/Mensajes.jsx'
import { useCategorias } from '../consultas.js'

// La ruta índice de /categorias: todas las categorías con su foto.
// Pide lo mismo que la fila de su madre (useCategorias): una sola petición.
export default function ListaCategorias() {
  const { data: categorias, isPending, error, refetch } = useCategorias()

  return (
    <>
      <title>Categorías · Recetario</title>
      {isPending ? (
        <MensajeEstado>Cargando categorías…</MensajeEstado>
      ) : error ? (
        <MensajeError error={error} onReintentar={refetch} />
      ) : (
        <div className="rejilla-categorias">
          {categorias.map((categoria) => (
            <Link key={categoria.idCategory} className="tarjeta-categoria" to={categoria.strCategory}>
              <img src={categoria.strCategoryThumb} alt="" loading="lazy" />
              <h2>{categoria.strCategory}</h2>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
