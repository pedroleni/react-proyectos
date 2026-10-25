import { Fragment, useId, useLayoutEffect, useRef } from 'react'
import type { FragmentInstance, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'

type PropsDialogo = {
  abierto: boolean
  onCerrar: () => void
  titulo: string
  descripcion?: string
  children: ReactNode
}

// Patrón Dialog (Modal) de la APG:
// https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
export function Dialogo({ abierto, ...props }: PropsDialogo): ReactNode {
  if (!abierto) return null
  // Fuera de su sitio: al final de <body>, donde ningún overflow ni
  // z-index de los antepasados lo recorta (lección 36).
  return createPortal(<VentanaDialogo {...props} />, document.body)
}

function VentanaDialogo({ onCerrar, titulo, descripcion, children }: Omit<PropsDialogo, 'abierto'>) {
  const idTitulo = useId()
  const idDescripcion = useId()
  const capa = useRef<HTMLDivElement>(null)
  const ventana = useRef<HTMLDivElement>(null)
  const contenido = useRef<FragmentInstance>(null)

  // Al abrir: el resto de la página, inerte, y el foco, dentro.
  // Al cerrar: lo contrario y en ese orden, o el foco no podría volver.
  // Es de layout para que no haya ni un fotograma con el diálogo
  // pintado y el foco todavía fuera (lección 45).
  useLayoutEffect(() => {
    const anterior = document.activeElement
    const fuera = [...document.body.children].filter(
      (elemento) => elemento !== capa.current && !elemento.hasAttribute('inert'),
    )
    fuera.forEach((elemento) => elemento.toggleAttribute('inert', true))

    // El primer elemento enfocable de lo que te hayan pasado, sea cual sea.
    contenido.current?.focus()
    // Si no había ninguno, el propio diálogo (tiene tabIndex={-1}).
    if (!ventana.current?.contains(document.activeElement)) ventana.current?.focus()

    return () => {
      fuera.forEach((elemento) => elemento.toggleAttribute('inert', false))
      if (anterior instanceof HTMLElement) anterior.focus()
    }
  }, [])

  function manejarTeclas(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Escape') {
      evento.stopPropagation()
      onCerrar()
    }
  }

  function manejarFondo(evento: MouseEvent<HTMLDivElement>) {
    // mousedown y no click: si alguien selecciona texto dentro y suelta
    // fuera, el click llegaría al fondo y cerraría sin querer.
    if (evento.target === evento.currentTarget) onCerrar()
  }

  return (
    <div ref={capa} className="kit-dialogo-fondo" onMouseDown={manejarFondo}>
      {/* Centinela de entrada: con Mayús+Tab desde el primer control se
          llega aquí, y el foco salta al último. */}
      <span tabIndex={0} className="kit-centinela" onFocus={() => contenido.current?.focusLast()} />
      <div
        ref={ventana}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={descripcion ? idDescripcion : undefined}
        tabIndex={-1}
        className="kit-dialogo"
        onKeyDown={manejarTeclas}
      >
        <h2 id={idTitulo} className="kit-dialogo-titulo">
          {titulo}
        </h2>
        {descripcion && (
          <p id={idDescripcion} className="kit-dialogo-descripcion">
            {descripcion}
          </p>
        )}
        <Fragment ref={contenido}>{children}</Fragment>
      </div>
      {/* Centinela de salida: con Tab desde el último control se llega
          aquí, y el foco vuelve al primero. */}
      <span tabIndex={0} className="kit-centinela" onFocus={() => contenido.current?.focus()} />
    </div>
  )
}
