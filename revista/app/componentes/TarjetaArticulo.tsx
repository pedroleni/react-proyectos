import { Link } from 'react-router'
import type { ResumenArticulo } from '~/tipos'
import FechaPublicacion from './FechaPublicacion'
import HaceCuanto from './HaceCuanto'

export default function TarjetaArticulo({
  articulo,
  destacado = false,
}: {
  articulo: ResumenArticulo
  destacado?: boolean
}) {
  return (
    <article className={destacado ? 'tarjeta tarjeta-destacada' : 'tarjeta'}>
      <p className="seccion">{articulo.seccion}</p>
      <h2 className="tarjeta-titulo">
        <Link to={`/articulos/${articulo.slug}`}>{articulo.titulo}</Link>
      </h2>
      <p className="entradilla">{articulo.entradilla}</p>
      <p className="firma">
        {articulo.autoria} · <FechaPublicacion fecha={articulo.publicado} />
        <HaceCuanto fecha={articulo.publicado} />
      </p>
    </article>
  )
}
