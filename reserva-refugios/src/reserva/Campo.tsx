import { useId, type ReactNode } from 'react'

/** Lo que Campo le da al control que pinta: el id que une la etiqueta con
 * el campo y lo que necesita un lector de pantalla para leer su error. */
export type PropsControl = {
  id: string
  'aria-invalid'?: true
  'aria-describedby'?: string
}

type PropsCampo = {
  etiqueta: string
  ayuda?: string
  error?: string[]
  /** Casillas: el control va delante de la etiqueta, en la misma línea. */
  enLinea?: boolean
  children: (props: PropsControl) => ReactNode
}

export default function Campo({ etiqueta, ayuda, error, enLinea = false, children }: PropsCampo) {
  const id = useId()
  const idAyuda = `${id}-ayuda`
  const idError = `${id}-error`

  // TODO (paso 4): la ayuda y el error se ven, pero un lector de pantalla
  // no sabe que son de este campo. Pásale también al control:
  // - aria-invalid: true, solo cuando hay error;
  // - aria-describedby: los ids de la ayuda y del error que existan,
  //   separados por un espacio (undefined si no hay ninguno).
  const control = children({ id })

  return (
    <div className={['campo', enLinea && 'en-linea', error && 'con-error'].filter(Boolean).join(' ')}>
      {enLinea && control}
      <label htmlFor={id}>{etiqueta}</label>
      {ayuda && (
        <p id={idAyuda} className="ayuda">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="error">
          {error[0]}
        </p>
      )}
      {!enLinea && control}
    </div>
  )
}
