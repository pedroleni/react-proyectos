import { useId, useSyncExternalStore } from 'react'
import { cambiarAjustes, leerAjustes, suscribirseAAjustes, type ProximaReserva } from './ajustes'
import { reiniciarBaseDeDatos } from './baseDeDatos'

const LATENCIAS = [0, 400, 1000, 2000, 3000]

const PROXIMAS: { valor: ProximaReserva; texto: string }[] = [
  { valor: 'normal', texto: 'Se confirma si hay plazas' },
  { valor: 'error-servidor', texto: 'Falla el servidor (500)' },
  { valor: 'sin-plazas', texto: 'Otro grupo se adelanta (409)' },
]

// Los mandos del servidor simulado, solo con npm run dev. No es parte de la
// aplicación: es el equivalente al panel de red de las lecciones de la web.
export default function PanelServidor() {
  const ajustes = useSyncExternalStore(suscribirseAAjustes, leerAjustes)
  const idLatencia = useId()

  return (
    <aside className="panel-servidor" aria-label="Servidor simulado">
      <details open>
        <summary>Servidor simulado (MSW)</summary>
        <div className="panel-contenido">
          <label htmlFor={idLatencia}>Cada respuesta tarda</label>
          <select
            id={idLatencia}
            value={ajustes.latencia}
            onChange={(evento) => cambiarAjustes({ latencia: Number(evento.target.value) })}
          >
            {LATENCIAS.map((ms) => (
              <option key={ms} value={ms}>
                {ms === 0 ? 'nada' : `${ms / 1000} s`.replace('.', ',')}
              </option>
            ))}
          </select>
          <fieldset>
            <legend>La próxima reserva</legend>
            {PROXIMAS.map(({ valor, texto }) => (
              <label key={valor} className="panel-opcion">
                <input
                  type="radio"
                  name="proxima-reserva"
                  value={valor}
                  checked={ajustes.proximaReserva === valor}
                  onChange={() => cambiarAjustes({ proximaReserva: valor })}
                />
                {texto}
              </label>
            ))}
          </fieldset>
          <button type="button" onClick={reiniciarBaseDeDatos}>
            Borrar las reservas guardadas
          </button>
        </div>
      </details>
    </aside>
  )
}
