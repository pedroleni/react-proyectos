import { useEffect, useRef } from 'react'
import { Form, useLocation, useNavigation } from 'react-router'
import type { CamposCarta } from '~/tipos'

type Resultado = {
  errores: Partial<Record<CamposCarta, string>>
  valores: Record<CamposCarta, string>
}

/**
 * El formulario de las cartas. Es un formulario HTML de verdad: sin
 * JavaScript, el navegador lo envía con un POST normal y el servidor responde
 * con la página entera. Con JavaScript, React Router lo intercepta y lo envía
 * sin recargar.
 */
export default function FormularioCarta({ resultado }: { resultado?: Resultado }) {
  const navegacion = useNavigation()
  const enviando = navegacion.state === 'submitting'
  const errores = resultado?.errores ?? {}
  const valores = resultado?.valores
  const formulario = useRef<HTMLFormElement>(null)
  // Sin JavaScript, la respuesta es una página nueva que se abre arriba del
  // todo. Con el ancla, el navegador baja hasta las cartas, y los errores se ven.
  const { pathname } = useLocation()

  // Tras un envío con errores, el foco va al primer campo que hay que corregir.
  useEffect(() => {
    formulario.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [resultado])

  const describir = (campo: CamposCarta) => (errores[campo] ? `carta-${campo}-error` : undefined)

  return (
    <Form method="post" action={`${pathname}#cartas`} noValidate ref={formulario} className="formulario-carta">
      <div className="campo">
        <label htmlFor="carta-nombre">Nombre</label>
        <input
          id="carta-nombre"
          name="nombre"
          autoComplete="name"
          required
          maxLength={60}
          defaultValue={valores?.nombre}
          aria-invalid={errores.nombre ? true : undefined}
          aria-describedby={describir('nombre')}
        />
        {errores.nombre && (
          <p id="carta-nombre-error" className="error">
            {errores.nombre}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor="carta-correo">Correo (no se publica)</label>
        <input
          id="carta-correo"
          name="correo"
          type="email"
          autoComplete="email"
          required
          defaultValue={valores?.correo}
          aria-invalid={errores.correo ? true : undefined}
          aria-describedby={describir('correo')}
        />
        {errores.correo && (
          <p id="carta-correo-error" className="error">
            {errores.correo}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor="carta-texto">Tu carta</label>
        <textarea
          id="carta-texto"
          name="texto"
          rows={5}
          required
          defaultValue={valores?.texto}
          aria-invalid={errores.texto ? true : undefined}
          aria-describedby={describir('texto')}
        />
        {errores.texto && (
          <p id="carta-texto-error" className="error">
            {errores.texto}
          </p>
        )}
      </div>

      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar la carta'}
      </button>
    </Form>
  )
}
