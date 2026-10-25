import { useId } from 'react'
import Campo from './Campo'
import { primeraLlegada, ultimaLlegada } from './fechas'
import FotoRefugio from './FotoRefugio'
import { REFUGIOS } from './refugios'
import type { Errores, Valores } from './tipos'

type Props = { valores: Valores; errores: Errores }

export default function PasoRefugio({ valores, errores }: Props) {
  const id = useId()
  const idErrorRefugio = `${id}-error`

  return (
    <>
      {/* Un grupo de opciones de radio: el fieldset y su legend le dan nombre
          al grupo.
          TODO (paso 4): que el error se lea al entrar en el grupo:
          aria-describedby en el fieldset, apuntando a idErrorRefugio, solo
          cuando hay error. */}
      <fieldset className="refugios">
        <legend>Refugio</legend>
        {errores.refugio && (
          <p id={idErrorRefugio} className="error">
            {errores.refugio[0]}
          </p>
        )}
        <div className="tarjetas">
          {REFUGIOS.map((refugio) => (
            <label key={refugio.id} className="tarjeta-refugio">
              <FotoRefugio refugio={refugio} className="tarjeta-foto" />
              <span className="tarjeta-pie">
                {/* El nombre de la opción es el del refugio; la zona y la
                    altitud, su descripción. */}
                <input
                  type="radio"
                  name="refugio"
                  value={refugio.id}
                  defaultChecked={valores.refugio === refugio.id}
                  // TODO (paso 4): aria-invalid, solo cuando hay error en refugio
                  aria-labelledby={`${id}-${refugio.id}`}
                  aria-describedby={`${id}-${refugio.id}-zona`}
                />
                <span className="tarjeta-texto">
                  <span id={`${id}-${refugio.id}`} className="tarjeta-nombre">
                    {refugio.nombre}
                  </span>
                  <span id={`${id}-${refugio.id}-zona`} className="tarjeta-zona">
                    {refugio.zona} · <span className="sin-cortes">{refugio.altitud} m</span>
                  </span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="fila-campos">
        <Campo etiqueta="Llegada" ayuda="Desde mañana y hasta 90 días vista." error={errores.llegada}>
          {(props) => (
            <input
              type="date"
              name="llegada"
              min={primeraLlegada()}
              max={ultimaLlegada()}
              defaultValue={valores.llegada}
              {...props}
            />
          )}
        </Campo>
        <Campo etiqueta="Noches" error={errores.noches}>
          {(props) => (
            // Un select no actualiza la opción marcada cuando cambia su
            // defaultValue: con la key, se vuelve a crear ya con la buena (lección 61).
            <select key={valores.noches} name="noches" defaultValue={valores.noches} {...props}>
              <option value="1">1 noche</option>
              <option value="2">2 noches</option>
              <option value="3">3 noches</option>
            </select>
          )}
        </Campo>
        <Campo etiqueta="Personas" error={errores.personas}>
          {(props) => (
            <input
              type="number"
              name="personas"
              min={1}
              max={12}
              inputMode="numeric"
              defaultValue={valores.personas}
              {...props}
            />
          )}
        </Campo>
      </div>
    </>
  )
}
