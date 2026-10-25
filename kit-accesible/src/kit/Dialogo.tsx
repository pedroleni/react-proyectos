import type { ReactNode } from 'react'

type PropsDialogo = {
  abierto: boolean
  onCerrar: () => void
  titulo: string
  descripcion?: string
  children: ReactNode
}

// Patrón Dialog (Modal) de la APG:
// https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
//
// Ahora se ve encima de todo, pero no es un diálogo: no tiene rol ni
// nombre, Escape no lo cierra, el foco se queda detrás y con Tab se sale.
export function Dialogo({ abierto, ...props }: PropsDialogo): ReactNode {
  if (!abierto) return null
  // TODO (paso 2): píntalo con createPortal al final de document.body.
  return <VentanaDialogo {...props} />
}

function VentanaDialogo({ titulo, descripcion, children }: Omit<PropsDialogo, 'abierto'>) {
  // TODO (paso 2): ids con useId para el título y la descripción.

  // TODO (paso 3): con useLayoutEffect, al abrir: pon inert en todos los
  // hijos de document.body menos el del diálogo, y mete el foco dentro
  // con el método focus() de un <Fragment ref> que envuelva a children
  // (si no hay nada enfocable, enfoca el propio diálogo). Al cerrar, en la
  // limpieza: quita inert y devuelve el foco a quien lo tenía, en ese orden.

  // TODO (paso 2): manejarTeclas (Escape llama a onCerrar) y manejarFondo
  // (un mousedown en el propio fondo, no en la ventana, también cierra).

  return (
    <div className="kit-dialogo-fondo">
      {/* TODO (paso 3): centinela de entrada, un <span tabIndex={0}> que
          al recibir el foco lo manda al último control (focusLast). */}
      {/* TODO (paso 2): role="dialog", aria-modal="true", aria-labelledby,
          aria-describedby si hay descripción, tabIndex={-1} y onKeyDown. */}
      <div className="kit-dialogo">
        <h2 className="kit-dialogo-titulo">{titulo}</h2>
        {descripcion && <p className="kit-dialogo-descripcion">{descripcion}</p>}
        {children}
      </div>
      {/* TODO (paso 3): centinela de salida: al recibir el foco, lo manda
          al primer control (focus). */}
    </div>
  )
}
