import { ViewTransition } from 'react'
import { SECCIONES, posicionDe, type Seccion } from '../secciones'
import { ADELANTE, ATRAS, NOMBRE_INDICADOR } from '../transiciones'
import EnlaceConTipo from './EnlaceConTipo'

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
          // La dirección sale de la posición: una pestaña a la derecha de la
          // actual entra por la derecha.
          const tipo = posicionDe(seccion.id) > posicionDe(actual) ? ADELANTE : ATRAS

          return (
            <li key={seccion.id}>
              <EnlaceConTipo
                to={destinos[seccion.id]}
                tipo={tipo}
                className="pestana"
                aria-current={activa ? 'page' : undefined}
              >
                {seccion.nombre}
                {/* Solo la pestaña activa tiene raya. Al cambiar de pestaña, se
                    desmonta en una y se monta en otra con el mismo name:
                    un elemento compartido que se desliza de una a otra. */}
                {activa && (
                  <ViewTransition name={NOMBRE_INDICADOR} share="raya" default="none">
                    <span className="pestana-indicador" aria-hidden="true" />
                  </ViewTransition>
                )}
              </EnlaceConTipo>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
