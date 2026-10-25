import { ViewTransition, useLayoutEffect, useRef } from 'react'
import { Link, useParams } from 'react-router'
import EnlaceConTipo from '../componentes/EnlaceConTipo'
import Foto from '../componentes/Foto'
import { FOTOS, buscarFoto, fechaLarga, vecinas } from '../datos'
import { ADELANTE, ATRAS, ENTRADA, SALIDA, nombreFoto } from '../transiciones'
import NoEncontrada from './NoEncontrada'

export default function Detalle() {
  const { id } = useParams()
  const foto = buscarFoto(id)
  const titulo = useRef<HTMLHeadingElement>(null)

  // Cada foto se abre arriba del todo, también al pasar a la siguiente. En un
  // efecto de layout, para que React mida la foto ya en su sitio.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // Al llegar a la ficha, el foco va a su título: el enlace que pulsaste ya
  // no existe (lección 37). Solo al montarse: con «Siguiente» se queda donde está.
  useLayoutEffect(() => {
    titulo.current?.focus({ preventScroll: true })
  }, [])

  if (!foto) return <NoEncontrada mensaje="No encontramos esa foto." />

  const { anterior, siguiente } = vecinas(foto)
  const posicion = FOTOS.indexOf(foto) + 1

  return (
    <article className="detalle" aria-labelledby="titulo-foto">
      {/* Con key, cada foto es otro ViewTransition: al pasar a la siguiente,
          la de antes sale (exit) y la nueva entra (enter), cada una hacia el
          lado que diga el tipo. Al venir de la cuadrícula, gana share. */}
      <ViewTransition
        key={foto.id}
        name={nombreFoto(foto.id)}
        share="foto-compartida"
        enter={ENTRADA}
        exit={SALIDA}
      >
        <figure className="detalle-foto">
          <Foto foto={foto} forma="entera" />
        </figure>
      </ViewTransition>

      <ViewTransition key={`ficha-${foto.id}`} enter={ENTRADA} exit={SALIDA} default="none">
        <div className="detalle-ficha">
          <p className="detalle-contador">
            {foto.categoria} · {posicion} de {FOTOS.length}
          </p>
          <h1 id="titulo-foto" ref={titulo} tabIndex={-1}>
            {foto.titulo}
          </h1>
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
      </ViewTransition>

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
