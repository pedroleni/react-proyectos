import { Link } from 'react-router'
import Foto from '../componentes/Foto'
import { FOTOS } from '../datos'

export default function Cuadricula() {
  // TODO (paso 4): al volver de una foto, su miniatura, a la vista y con el foco.
  // «Volver a la galería» deja en el state de la ubicación qué foto mirabas:
  // (useLocation().state as { desde?: string } | null)?.desde
  // Ponle una ref al enlace de esa foto y, en un useLayoutEffect que dependa
  // de desde, llama a scrollIntoView({ block: 'center' }) y a
  // focus({ preventScroll: true }). Tiene que ser de layout: un useEffect se
  // ejecutaría cuando la animación ya ha terminado.

  return (
    <section className="galeria" aria-labelledby="titulo-galeria">
      <div className="galeria-intro">
        <h1 id="titulo-galeria">Doce fotos del invierno asturiano</h1>
        <p>
          Costa, montaña y pueblos, de noviembre a marzo. Las fotos de nueve socios de Cuarto
          Oscuro que forman la muestra de este año.
        </p>
      </div>

      <ul className="cuadricula">
        {FOTOS.map((foto) => (
          <li key={foto.id}>
            <Link to={`/foto/${foto.id}`} className="miniatura">
              {/* TODO (paso 3): el elemento compartido. Envuelve la foto en un
                  <ViewTransition name={nombreFoto(foto.id)} share="foto-compartida">:
                  el mismo name que la foto grande de Detalle. */}
              <Foto foto={foto} forma="recorte" />
              <span className="miniatura-texto">
                <span className="miniatura-titulo">{foto.titulo}</span>
                <span className="miniatura-autoria">{foto.autoria}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
