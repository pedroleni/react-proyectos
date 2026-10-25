import { Link, useParams } from 'react-router'
import EnlaceConTipo from '../componentes/EnlaceConTipo'
import Foto from '../componentes/Foto'
import { FOTOS, buscarFoto, fechaLarga, vecinas } from '../datos'
import { ADELANTE, ATRAS } from '../transiciones'
import NoEncontrada from './NoEncontrada'

export default function Detalle() {
  const { id } = useParams()
  const foto = buscarFoto(id)

  // TODO (paso 4): dos efectos de layout, antes del return de NoEncontrada.
  // - Con [id]: window.scrollTo(0, 0), para que cada foto se abra arriba.
  // - Con []: el foco al <h1> (ponle una ref y tabIndex={-1}), con
  //   focus({ preventScroll: true }): el enlace que pulsaste ya no existe.

  if (!foto) return <NoEncontrada mensaje="No encontramos esa foto." />

  const { anterior, siguiente } = vecinas(foto)
  const posicion = FOTOS.indexOf(foto) + 1

  return (
    <article className="detalle" aria-labelledby="titulo-foto">
      {/* TODO (paso 3): envuelve la figura en un <ViewTransition> con el mismo
          name que la miniatura, nombreFoto(foto.id), y share="foto-compartida".

          TODO (paso 5): a ese ViewTransition, añádele key={foto.id},
          enter={ENTRADA} y exit={SALIDA}, y envuelve también la ficha en otro,
          con key={`ficha-${foto.id}`}, enter={ENTRADA}, exit={SALIDA} y
          default="none". */}
      <figure className="detalle-foto">
        <Foto foto={foto} forma="entera" />
      </figure>

      <div className="detalle-ficha">
        <p className="detalle-contador">
          {foto.categoria} · {posicion} de {FOTOS.length}
        </p>
        <h1 id="titulo-foto">{foto.titulo}</h1>
        <p className="detalle-autoria">{foto.autoria}</p>
        <p className="detalle-descripcion">{foto.descripcion}</p>
        <dl className="detalle-datos">
          <div>
            <dt>Lugar</dt>
            <dd>{foto.lugar}</dd>
          </div>
          <div>
            <dt>Fecha</dt>
            <dd>{fechaLarga(foto.fecha)}</dd>
          </div>
          <div>
            <dt>Técnica</dt>
            <dd>{foto.tecnica}</dd>
          </div>
        </dl>
      </div>

      <nav className="detalle-nav" aria-label="Fotos de la muestra">
        <EnlaceConTipo to={`/foto/${anterior.id}`} tipo={ATRAS} replace className="boton">
          <span aria-hidden="true">←</span> Foto anterior
        </EnlaceConTipo>
        <Link to="/" state={{ desde: foto.id }} className="boton boton-volver">
          Volver a la galería
        </Link>
        <EnlaceConTipo to={`/foto/${siguiente.id}`} tipo={ADELANTE} replace className="boton">
          Foto siguiente <span aria-hidden="true">→</span>
        </EnlaceConTipo>
      </nav>
    </article>
  )
}
