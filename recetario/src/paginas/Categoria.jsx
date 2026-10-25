import { useParams } from 'react-router'
import { MensajeError, MensajeEstado } from '../componentes/Mensajes.jsx'
import TarjetaReceta from '../componentes/TarjetaReceta.jsx'
import { useRecetasDeCategoria } from '../consultas.js'

// La ruta hija /categorias/:nombre: las recetas de una categoría.
export default function Categoria() {
  const { nombre } = useParams()
  const { data: recetas, isPending, error, refetch } = useRecetasDeCategoria(nombre)

  return (
    <div className="categoria">
      <title>{`${nombre} · Recetario`}</title>
      <h2>{nombre}</h2>
      {isPending ? (
        <MensajeEstado>Cargando recetas…</MensajeEstado>
      ) : error ? (
        <MensajeError error={error} onReintentar={refetch} />
      ) : recetas.length === 0 ? (
        <MensajeEstado>No hay recetas disponibles en esta categoría.</MensajeEstado>
      ) : (
        <div className="rejilla-recetas">
          {recetas.map((receta) => (
            <TarjetaReceta key={receta.idMeal} receta={receta} />
          ))}
        </div>
      )}
    </div>
  )
}
