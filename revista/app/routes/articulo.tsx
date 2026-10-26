import { Link } from 'react-router'
import FechaPublicacion from '~/componentes/FechaPublicacion'
import { buscarArticulo, otrosArticulos } from '~/datos/articulos.server'
import type { Route } from './+types/articulo'

export async function loader() {
  // TODO (paso 3): de momento, cualquier /articulos/<lo-que-sea> enseña el
  // mismo artículo, y con un 200. Recibe { params } y busca el artículo de
  // params.slug con buscarArticulo. Si no existe, lanza un 404 de verdad:
  // throw data({ otros: otrosArticulos(params.slug) }, { status: 404 }).
  // TODO (paso 4): devuelve también url e imagen: las URL absolutas de la
  // página y de su tarjeta (/og/<slug>.png), con origenPublico(request).
  // TODO (paso 5): y las cartas del artículo (leerCartas, de
  // ~/datos/cartas.server) y cartaNueva, el id que llega en ?carta=.
  // TODO (paso 10): mide lo que tarda leerCartas y apúntalo en los tiempos que
  // deja el middleware: medir(context.get(tiemposContext), 'cartas', () => …),
  // de ~/tiempos.server.
  const articulo = buscarArticulo('caja-alta-y-caja-baja')!
  return { articulo, otros: otrosArticulos(articulo.slug) }
}

// TODO (paso 5): la action. Valida la carta con validarCarta; si tiene
// errores, devuelve data({ errores, valores }, { status: 400 }); si no, la
// guarda con guardarCarta y redirige a /articulos/<slug>?carta=<id>#cartas.

export default function Articulo({ loaderData }: Route.ComponentProps) {
  const { articulo, otros } = loaderData

  return (
    <main className="articulo">
      {/* TODO (paso 4): el <head> del artículo, con el componente Metadatos. */}

      <header className="articulo-cabecera">
        <p className="seccion">{articulo.seccion}</p>
        <h1>{articulo.titulo}</h1>
        <p className="entradilla">{articulo.entradilla}</p>
        <p className="firma">
          Por {articulo.autoria} · <FechaPublicacion fecha={articulo.publicado} /> · {articulo.minutos} min de
          lectura
        </p>
      </header>

      <div className="cuerpo">
        {articulo.cuerpo.map((parrafo, indice) => (
          <p key={indice}>{parrafo}</p>
        ))}
      </div>

      {/* TODO (paso 5): la sección de las cartas, con id="cartas": el aviso
          de «Gracias», la lista de cartas y el FormularioCarta.
          TODO (paso 6): con JavaScript, el formulario sigue lleno después de
          publicar la carta. Dale una key que cambie con cartaNueva. */}

      <nav className="otros" aria-labelledby="titulo-otros">
        <h2 id="titulo-otros">Sigue leyendo</h2>
        <ul>
          {otros.map((otro) => (
            <li key={otro.slug}>
              <Link to={`/articulos/${otro.slug}`}>{otro.titulo}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  )
}

// TODO (paso 3): un ErrorBoundary para el 404 del artículo, con su <title>,
// <meta name="robots" content="noindex"> y los enlaces de error.data.otros.
