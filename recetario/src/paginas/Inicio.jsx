import { Link } from 'react-router'
import { MensajeError, MensajeEstado } from '../componentes/Mensajes.jsx'
import TarjetaReceta from '../componentes/TarjetaReceta.jsx'
import { useRecetasDestacadas } from '../consultas.js'

export default function Inicio() {
  // TODO (paso 5): pide las tres recetas destacadas con useRecetasDestacadas().

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

        {/* TODO (paso 5): pinta un estado por rama:
            - mientras no hay datos, <MensajeEstado>Buscando recetas apetitosas…</MensajeEstado>;
            - si falla, <MensajeError error={error} onReintentar={refetch} />;
            - si llega vacía, <MensajeEstado>No hay recetas destacadas disponibles.</MensajeEstado>;
            - con recetas, un <div className="rejilla-recetas rejilla-destacadas">
              con una <TarjetaReceta> por receta (key: receta.idMeal). */}
        <MensajeEstado>Aquí irán tres recetas al azar (paso 5).</MensajeEstado>
      </section>
    </>
  )
}
