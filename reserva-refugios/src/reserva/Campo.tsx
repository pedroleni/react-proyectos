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

// Paso 4 de la lección: un campo que se entiende sin verlo (lecciones 37 y 61).
export default function Campo({ etiqueta, ayuda, error, enLinea = false, children }: PropsCampo) {
  const id = useId()
  const idAyuda = `${id}-ayuda`
  const idError = `${id}-error`

  // La ayuda y el error se leen junto al nombre del campo. aria-invalid y la
  // referencia al error solo existen cuando hay error.
  const describe = [ayuda ? idAyuda : null, error ? idError : null].filter(Boolean).join(' ')
  const control = children({
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describe || undefined,
  })

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
