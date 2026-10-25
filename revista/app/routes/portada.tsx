import TarjetaArticulo from '~/componentes/TarjetaArticulo'
import Metadatos from '~/componentes/Metadatos'
import { origenPublico } from '~/config.server'
import { listarArticulos } from '~/datos/articulos.server'
import type { Route } from './+types/portada'

// Se ejecuta en el servidor antes de pintar la portada: en la primera visita,
// para generar el HTML; al volver a ella navegando, cuando React Router pide
// los datos con un fetch.
export async function loader({ request }: Route.LoaderArgs) {
  return {
    articulos: listarArticulos(),
    origen: origenPublico(request),
  }
}

export default function Portada({ loaderData }: Route.ComponentProps) {
  const { articulos, origen } = loaderData
  const [destacado, ...resto] = articulos

  return (
    <main className="portada">
      <Metadatos
        tituloPagina="Caja Baja · Revista de tipografía e imprenta"
        titulo="Caja Baja"
        descripcion="Revista de tipografía e imprenta hecha desde un taller de tipos móviles: el oficio, su historia y la letra en la pantalla."
        url={`${origen}/`}
        imagen={`${origen}/og/portada.png`}
        tipo="website"
      />

      <h1 className="visualmente-oculto">Últimos artículos</h1>
      <TarjetaArticulo articulo={destacado} destacado />
      <div className="rejilla">
        {resto.map((articulo) => (
          <TarjetaArticulo key={articulo.slug} articulo={articulo} />
        ))}
      </div>
    </main>
  )
}
