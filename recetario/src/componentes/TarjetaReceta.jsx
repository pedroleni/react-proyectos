import { Link } from 'react-router'

export default function TarjetaReceta({ receta }) {
  return (
    <article className="tarjeta-receta">
      <Link className="tarjeta-receta-enlace" to={`/receta/${receta.idMeal}`}>
        {/* alt vacío: el nombre del enlace ya lo da el título de debajo.
            /medium pide la miniatura de 350 px que ofrece TheMealDB. */}
        <img
          src={`${receta.strMealThumb}/medium`}
          alt=""
          loading="lazy"
          width="350"
          height="350"
        />
        <h3>{receta.strMeal}</h3>
      </Link>
    </article>
  )
}
