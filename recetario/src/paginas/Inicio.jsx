import { Link } from 'react-router'
import { MensajeError, MensajeEstado } from '../componentes/Mensajes.jsx'
import TarjetaReceta from '../componentes/TarjetaReceta.jsx'
import { useRecetasDestacadas } from '../consultas.js'

export default function Inicio() {
  const { data: recetas, isPending, error, refetch } = useRecetasDestacadas()

  return (
    <>
      {/* Sin <title>: en la portada vale el de index.html */}
      <section className="hero">
        <div className="hero-contenido">
          <p className="antetitulo">Cocina sin complicaciones</p>
          <h1>Recetas que saben a casa</h1>
          <p>Encuentra ideas, ingredientes y pasos para tu próxima comida.</p>
          <Link className="boton boton-claro" to="/buscar">
            Buscar una receta
          </Link>
        </div>
      </section>

      <section className="seccion-contenido">
        <div className="cabecera-seccion">
          <p className="antetitulo">Inspiración diaria</p>
          <h2>Tres recetas para descubrir</h2>
        </div>

        {isPending ? (
          <MensajeEstado>Buscando recetas apetitosas…</MensajeEstado>
        ) : error ? (
          <MensajeError error={error} onReintentar={refetch} />
        ) : recetas.length === 0 ? (
          <MensajeEstado>No hay recetas destacadas disponibles.</MensajeEstado>
        ) : (
          <div className="rejilla-recetas rejilla-destacadas">
            {recetas.map((receta) => (
              <TarjetaReceta key={receta.idMeal} receta={receta} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
