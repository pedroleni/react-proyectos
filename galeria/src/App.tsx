import { Link, useLocation } from 'react-router'
import Pestanas from './componentes/Pestanas'
import Galeria from './paginas/Galeria'
import Participa from './paginas/Participa'
import Visita from './paginas/Visita'
import { seccionDe, type Seccion } from './secciones'

export default function App() {
  const ubicacion = useLocation()
  const seccion = seccionDe(ubicacion.pathname)

  // TODO (paso 2): que la galería recuerde dónde se quedó.
  // Guarda en un estado la última ubicación de la galería (useState<Location>,
  // con PORTADA como valor inicial si la app arranca en otra pestaña) y
  // ajústala durante el render mientras la sección sea 'galeria' (lección 39).
  // Pásasela a <Galeria> en vez de `ubicacion`, y usa su pathname como
  // destino de la pestaña «Galería».
  const destinos: Record<Seccion, string> = {
    galeria: '/',
    participa: '/participa',
    visita: '/visita',
  }

  return (
    <>
      <header className="cabecera">
        <Link to="/" className="marca">
          <span className="marca-asociacion">Asociación Fotográfica Cuarto Oscuro</span>
          <span className="marca-muestra">Luz del Norte</span>
        </Link>
        <Pestanas actual={seccion} destinos={destinos} />
      </header>

      <main className="contenido">
        {/* TODO (paso 1): las tres secciones, siempre montadas.
            Con estos condicionales, la sección que no se ve se desmonta y
            pierde su estado: lo escrito en «Participa», por ejemplo.
            Escribe un componente Panel({ visible, children }) que envuelva a
            sus hijos en <Activity mode={visible ? 'visible' : 'hidden'}>,
            con un <div className="panel"> dentro, y úsalo para las tres.

            TODO (paso 6): dentro del Activity de Panel, un <ViewTransition>
            con enter={ENTRADA} y exit={SALIDA} (de transiciones.ts) alrededor
            del <div className="panel">. */}
        {seccion === 'galeria' && <Galeria ubicacion={ubicacion} />}
        {seccion === 'participa' && <Participa />}
        {seccion === 'visita' && <Visita />}
      </main>

      <footer className="pie">
        <p>Luz del Norte · Sala Cuarto Oscuro, Gijón · del 7 de noviembre de 2026 al 10 de enero de 2027</p>
        <p className="pie-aviso">
          La exposición, la asociación y sus autores son inventados: es un proyecto de práctica de React. Las fotos
          están generadas con inteligencia artificial.
        </p>
      </footer>
    </>
  )
}
