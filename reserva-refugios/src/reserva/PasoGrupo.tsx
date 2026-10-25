import Campo from './Campo'
import { TARIFAS } from './importe'
import type { Errores, Valores } from './tipos'

type Props = { valores: Valores; errores: Errores }

export default function PasoGrupo({ valores, errores }: Props) {
  return (
    <>
      <Campo etiqueta="Nombre y apellidos" error={errores.nombre}>
        {(props) => <input name="nombre" autoComplete="name" defaultValue={valores.nombre} {...props} />}
      </Campo>
      <div className="fila-campos">
        <Campo etiqueta="Correo electrónico" error={errores.correo}>
          {(props) => (
            <input name="correo" type="email" autoComplete="email" defaultValue={valores.correo} {...props} />
          )}
        </Campo>
        <Campo etiqueta="Teléfono móvil" ayuda="Nueve cifras, sin prefijo." error={errores.telefono}>
          {(props) => (
            <input
              name="telefono"
              type="tel"
              autoComplete="tel-national"
              inputMode="numeric"
              defaultValue={valores.telefono}
              {...props}
            />
          )}
        </Campo>
      </div>
      <Campo
        etiqueta="Personas con licencia federativa de montaña"
        ayuda={`Pagan ${TARIFAS.federado} € por noche en vez de ${TARIFAS.general} €. Tendrán que enseñar la licencia al llegar.`}
        error={errores.federados}
      >
        {(props) => (
          <input
            name="federados"
            type="number"
            min={0}
            max={12}
            inputMode="numeric"
            defaultValue={valores.federados}
            {...props}
          />
        )}
      </Campo>
      <Campo
        etiqueta="Observaciones (opcional)"
        ayuda="Alergias, dietas o a qué hora más o menos llegaréis."
        error={errores.observaciones}
      >
        {(props) => <textarea name="observaciones" rows={3} defaultValue={valores.observaciones} {...props} />}
      </Campo>
    </>
  )
}
