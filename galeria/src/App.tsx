import { Activity, ViewTransition, useState, type ReactNode } from 'react'
import { Link, useLocation, type Location } from 'react-router'
import Pestanas from './componentes/Pestanas'
import Galeria from './paginas/Galeria'
import Participa from './paginas/Participa'
import Visita from './paginas/Visita'
import { seccionDe, type Seccion } from './secciones'
import { ENTRADA, SALIDA } from './transiciones'

const PORTADA: Location = { pathname: '/', search: '', hash: '', state: null, key: 'default' }

export default function App() {
  const ubicacion = useLocation()
  const seccion = seccionDe(ubicacion.pathname)

  // La galería recuerda dónde se quedó: si te vas a «Participa» con una foto
  // abierta, al volver sigue abierta. Mientras la galería se ve, su ubicación
  // es la de la URL; se ajusta durante el render, sin efecto (lección 39).
  const [ubicacionGaleria, setUbicacionGaleria] = useState<Location>(
    seccion === 'galeria' ? ubicacion : PORTADA,
  )
  if (seccion === 'galeria' && ubicacion !== ubicacionGaleria) {
    setUbicacionGaleria(ubicacion)
  }

  const destinos: Record<Seccion, string> = {
    galeria: ubicacionGaleria.pathname,
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
        {/* Las tres pestañas están siempre montadas: la URL solo decide cuál
            se ve. Activity esconde las demás sin perder su estado. */}
        <Panel visible={seccion === 'galeria'}>
          <Galeria ubicacion={ubicacionGaleria} />
        </Panel>
        <Panel visible={seccion === 'participa'}>
          <Participa />
        </Panel>
        <Panel visible={seccion === 'visita'}>
          <Visita />
        </Panel>
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

function Panel({ visible, children }: { visible: boolean; children: ReactNode }) {
  return (
    <Activity mode={visible ? 'visible' : 'hidden'}>
      {/* Al mostrarse, entra; al esconderse, sale. Hacia qué lado lo dice el
          tipo de la transición. Si cambia lo de dentro (abrir una foto), un
          fundido: es el update, que por defecto es "auto". */}
      <ViewTransition enter={ENTRADA} exit={SALIDA}>
        <div className="panel">{children}</div>
      </ViewTransition>
    </Activity>
  )
}
