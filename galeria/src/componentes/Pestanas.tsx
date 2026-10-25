import { Link } from 'react-router'
import { SECCIONES, type Seccion } from '../secciones'

interface Props {
  actual: Seccion
  /** Adónde lleva cada pestaña: la galería, a la foto que estabas mirando. */
  destinos: Record<Seccion, string>
}

export default function Pestanas({ actual, destinos }: Props) {
  return (
    <nav className="pestanas" aria-label="Secciones">
      <ul>
        {SECCIONES.map((seccion) => {
          const activa = seccion.id === actual

          // TODO (paso 6): las pestañas, con dirección.
          // 1. Cambia el <Link> por un <EnlaceConTipo> con tipo ADELANTE si la
          //    pestaña está a la derecha de la actual (compara posicionDe) y
          //    ATRAS si está a la izquierda.
          // 2. Envuelve la raya en <ViewTransition name={NOMBRE_INDICADOR}
          //    share="raya" default="none">: solo hay una montada a la vez, y al
          //    cambiar de pestaña se desliza de una a otra.
          return (
            <li key={seccion.id}>
              <Link to={destinos[seccion.id]} className="pestana" aria-current={activa ? 'page' : undefined}>
                {seccion.nombre}
                {activa && <span className="pestana-indicador" aria-hidden="true" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
