import { useParams } from 'react-router'
import { MensajeError, MensajeEstado } from '../componentes/Mensajes.jsx'
import TarjetaReceta from '../componentes/TarjetaReceta.jsx'
import { useRecetasDeCategoria } from '../consultas.js'

// La ruta hija /categorias/:nombre: las recetas de una categoría.
export default function Categoria() {
  // TODO (paso 8): lee nombre con useParams y pide sus recetas con useRecetasDeCategoria.
  const nombre = '…'

  return (
    <div className="categoria">
      <title>{`${nombre} · Recetario`}</title>
      <h2>{nombre}</h2>
      {/* TODO (paso 8): cargando, «Cargando recetas…»; error, MensajeError; sin
          recetas, «No hay recetas disponibles en esta categoría.»; y si no, un
          <div className="rejilla-recetas"> con una TarjetaReceta por receta. */}
      <MensajeEstado>Aquí irán las recetas de la categoría (paso 8).</MensajeEstado>
    </div>
  )
}
