import TarjetaArticulo from '~/componentes/TarjetaArticulo'
import type { ResumenArticulo } from '~/tipos'
import type { Route } from './+types/portada'

export async function loader() {
  // TODO (paso 2): devuelve los artículos de la revista, con listarArticulos()
  // de ~/datos/articulos.server. Este loader se ejecuta en el servidor: lo que
  // devuelve llega al componente como loaderData.
  const articulos: ResumenArticulo[] = []
  return { articulos }
}

export default function Portada({ loaderData }: Route.ComponentProps) {
  const { articulos } = loaderData
  const [destacado, ...resto] = articulos

  // TODO (paso 4): el título, la descripción y Open Graph de la portada, con
  // el componente Metadatos. El loader tendrá que devolver también el origen
  // de la web (origenPublico, de ~/config.server) para las URL absolutas.

  if (!destacado) {
    return (
      <main className="portada">
        <p>La portada está vacía: le falta su loader (paso 2).</p>
      </main>
    )
  }

  return (
    <main className="portada">
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
