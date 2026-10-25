import { data, isRouteErrorResponse, Link, redirect } from 'react-router'
import FechaPublicacion from '~/componentes/FechaPublicacion'
import FormularioCarta from '~/componentes/FormularioCarta'
import Metadatos from '~/componentes/Metadatos'
import { origenPublico } from '~/config.server'
import { buscarArticulo, otrosArticulos } from '~/datos/articulos.server'
import { guardarCarta, leerCartas, validarCarta } from '~/datos/cartas.server'
import type { Route } from './+types/articulo'

export async function loader({ params, request }: Route.LoaderArgs) {
  const articulo = buscarArticulo(params.slug)
  if (!articulo) {
    // Un 404 de verdad: el estado HTTP de la respuesta y el ErrorBoundary de
    // abajo. Lo que va dentro de data() llega a ese ErrorBoundary.
    throw data({ otros: otrosArticulos(params.slug) }, { status: 404 })
  }

  const url = new URL(request.url)
  const origen = origenPublico(request)
  return {
    articulo,
    cartas: await leerCartas(articulo.slug),
    // Tras enviar una carta, la action redirige aquí con ?carta=<id>.
    cartaNueva: url.searchParams.get('carta'),
    otros: otrosArticulos(articulo.slug),
    url: `${origen}/articulos/${articulo.slug}`,
    imagen: `${origen}/og/${articulo.slug}.png`,
  }
}

export async function action({ params, request }: Route.ActionArgs) {
  // La URL también llega de fuera: el artículo tiene que existir.
  const articulo = buscarArticulo(params.slug)
  if (!articulo) throw data({ otros: otrosArticulos(params.slug) }, { status: 404 })

  const resultado = validarCarta(await request.formData())
  if (!resultado.ok) {
    // 400: los datos no valen. Se devuelven los errores y lo que se escribió,
    // para volver a pintar el formulario con todo en su sitio.
    return data({ errores: resultado.errores, valores: resultado.valores }, { status: 400 })
  }

  const carta = await guardarCarta(articulo.slug, resultado.carta)
  // Después de un POST que ha ido bien, una redirección (POST/redirección/GET):
  // si quien la ha enviado recarga la página, no la envía otra vez.
  return redirect(`/articulos/${articulo.slug}?carta=${carta.id}#cartas`)
}

export default function Articulo({ loaderData, actionData }: Route.ComponentProps) {
  const { articulo, cartas, cartaNueva, otros, url, imagen } = loaderData
  const publicada = cartas.find((carta) => carta.id === cartaNueva)

  return (
    <main className="articulo">
      <Metadatos
        titulo={articulo.titulo}
        descripcion={articulo.entradilla}
        url={url}
        imagen={imagen}
        tipo="article"
        articulo={articulo}
      />

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

      <section className="cartas" id="cartas" aria-labelledby="titulo-cartas">
        <h2 id="titulo-cartas">Cartas de los lectores</h2>
        <p role="status" className="aviso">
          {publicada ? `Gracias, ${publicada.nombre}: tu carta ya está publicada.` : ''}
        </p>
        {cartas.length === 0 ? (
          <p>Todavía no hay cartas sobre este artículo. ¿Escribes la primera?</p>
        ) : (
          <ol className="lista-cartas">
            {cartas.map((carta) => (
              <li key={carta.id} className={carta.id === cartaNueva ? 'carta carta-nueva' : 'carta'}>
                <blockquote>{carta.texto}</blockquote>
                <p className="firma">
                  {carta.nombre} · <FechaPublicacion fecha={carta.fecha} />
                </p>
              </li>
            ))}
          </ol>
        )}

        <h3>Escribe al director</h3>
        {/* Con key: cuando se publica una carta nueva, el formulario se monta
            de nuevo y queda vacío (lección 26). */}
        <FormularioCarta key={cartaNueva ?? 'nueva'} resultado={actionData} />
      </section>

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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    const otros: { slug: string; titulo: string }[] = error.data?.otros ?? []
    return (
      <main className="no-encontrada">
        <title>Artículo no encontrado · Caja Baja</title>
        <meta name="robots" content="noindex" />
        <h1>Este artículo no existe</h1>
        <p>Puede que la dirección esté mal escrita o que el artículo se haya retirado.</p>
        {otros.length > 0 && (
          <>
            <h2>Lo último de la revista</h2>
            <ul>
              {otros.map((otro) => (
                <li key={otro.slug}>
                  <Link to={`/articulos/${otro.slug}`}>{otro.titulo}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <p>
          <Link to="/">Volver a la portada</Link>
        </p>
      </main>
    )
  }
  return (
    <main className="no-encontrada">
      <title>Error · Caja Baja</title>
      <h1>No hemos podido cargar este artículo</h1>
      <p>Inténtalo de nuevo dentro de un rato.</p>
      <p>
        <Link to="/">Volver a la portada</Link>
      </p>
    </main>
  )
}
