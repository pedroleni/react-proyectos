import { ViewTransition, useLayoutEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import Foto from '../componentes/Foto'
import { FOTOS } from '../datos'
import { nombreFoto } from '../transiciones'

export default function Cuadricula() {
  // «Volver a la galería» deja aquí qué foto estabas mirando.
  const desde = (useLocation().state as { desde?: string } | null)?.desde
  const enlaceDesde = useRef<HTMLAnchorElement>(null)

  // Al volver de una foto, su miniatura tiene que estar a la vista: si no, la
  // foto grande no tiene dónde aterrizar y no hay elemento compartido. Va en
  // un efecto de layout porque React mide la página justo después de ellos;
  // un useEffect llegaría cuando la animación ya ha terminado.
  useLayoutEffect(() => {
    const enlace = enlaceDesde.current
    if (!enlace) return
    enlace.scrollIntoView({ block: 'center' })
    // Y el foco, al enlace de la foto de la que vienes (lección 37).
    enlace.focus({ preventScroll: true })
  }, [desde])

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
            <Link
              to={`/foto/${foto.id}`}
              className="miniatura"
              ref={foto.id === desde ? enlaceDesde : undefined}
            >
              {/* El mismo name que la foto grande de Detalle: al abrirla, React
                  forma la pareja y el navegador la hace crecer hasta allí. */}
              <ViewTransition name={nombreFoto(foto.id)} share="foto-compartida">
                <Foto foto={foto} forma="recorte" />
              </ViewTransition>
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
