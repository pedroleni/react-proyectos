import { useEffect, useRef } from 'react'
import { useFetcher } from 'react-router'
import type { action } from '~/routes/boletin'

/**
 * El boletín, en el pie de todas las páginas. Con un fetcher, apuntarse no es
 * una navegación: la URL, el historial y la página se quedan como estaban.
 * Sin JavaScript, es un formulario normal que lleva a /boletin.
 */
export default function FormularioBoletin() {
  // Un envío con su propio estado. typeof action le da el tipo de fetcher.data.
  const fetcher = useFetcher<typeof action>()
  const enviando = fetcher.state !== 'idle'
  const resultado = fetcher.data
  const error = resultado && !resultado.ok ? resultado.error : undefined
  const formulario = useRef<HTMLFormElement>(null)

  // Apuntado: el campo se vacía. Nadie lo hace por ti, porque no hay navegación
  // y el formulario sigue montado.
  useEffect(() => {
    if (resultado?.ok) formulario.current?.reset()
  }, [resultado])

  // defaultShouldRevalidate={false}: apuntarse no cambia nada de lo que enseña
  // la página, así que no hace falta volver a pedir sus datos.
  return (
    <fetcher.Form
      method="post"
      action="/boletin"
      defaultShouldRevalidate={false}
      noValidate
      ref={formulario}
      className="boletin"
    >
      <label htmlFor="boletin-correo">Recibe el boletín: un correo al mes con los artículos nuevos</label>
      <div className="boletin-fila">
        <input
          id="boletin-correo"
          name="correo"
          type="email"
          autoComplete="email"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'boletin-respuesta' : undefined}
        />
        <button type="submit" disabled={enviando}>
          {enviando ? 'Apuntándote…' : 'Apuntarme'}
        </button>
      </div>
      <p id="boletin-respuesta" role="status" className={error ? 'boletin-respuesta error' : 'boletin-respuesta'}>
        {resultado?.ok ? `Hecho: te escribiremos a ${resultado.correo}.` : error}
      </p>
    </fetcher.Form>
  )
}
