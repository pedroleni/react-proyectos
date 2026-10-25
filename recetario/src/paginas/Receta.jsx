import { Link, useParams } from 'react-router'
import { MensajeError, MensajeEstado } from '../componentes/Mensajes.jsx'
import { useReceta } from '../consultas.js'
import { normalizarIngredientes } from '../utilidades.js'

export default function Receta() {
  const { id } = useParams()
  const { data: receta, isPending, error, refetch } = useReceta(id)

  return (
    <section className="pagina seccion-contenido">
      {isPending ? (
        <MensajeEstado>Cargando la receta…</MensajeEstado>
      ) : error ? (
        <MensajeError error={error} onReintentar={refetch} />
      ) : receta === null ? (
        // La ruta /receta/:id encaja con cualquier id; la receta puede no existir.
        <>
          <title>Receta no encontrada · Recetario</title>
          <MensajeEstado>No hemos encontrado esa receta.</MensajeEstado>
          <Link to="/buscar">Buscar otra receta</Link>
        </>
      ) : (
        <DetalleReceta receta={receta} />
      )}
    </section>
  )
}

function DetalleReceta({ receta }) {
  const ingredientes = normalizarIngredientes(receta)

  return (
    <article className="detalle-receta">
      <title>{`${receta.strMeal} · Recetario`}</title>
      <img className="detalle-imagen" src={receta.strMealThumb} alt={`Fotografía de ${receta.strMeal}`} />
      <div className="detalle-contenido">
        <p className="antetitulo">
          <Link to={`/categorias/${receta.strCategory}`}>{receta.strCategory}</Link>
          {receta.strArea && ` · ${receta.strArea}`}
        </p>
        <h1>{receta.strMeal}</h1>

        <h2>Ingredientes</h2>
        <ul className="lista-ingredientes">
          {ingredientes.map(({ ingrediente, medida }, indice) => (
            // Un mismo ingrediente puede salir dos veces en una receta, así que
            // su nombre no sirve de key. La lista no cambia de orden: vale el índice.
            <li key={indice}>
              <span>{ingrediente}</span>
              <strong>{medida || 'Al gusto'}</strong>
            </li>
          ))}
        </ul>

        <h2>Preparación</h2>
        <p className="instrucciones">{receta.strInstructions || 'Esta receta no incluye instrucciones.'}</p>

        {receta.strYoutube && (
          <a className="boton boton-video" href={receta.strYoutube} target="_blank" rel="noreferrer">
            Ver vídeo en YouTube ↗
          </a>
        )}
      </div>
    </article>
  )
}
