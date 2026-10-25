import { createContext, use, useState } from 'react'
import type { ReactNode } from 'react'

type ContextoMenu = { cerrar: () => void }

const MenuContext = createContext<ContextoMenu | null>(null)
MenuContext.displayName = 'Menu'

type PropsMenu = {
  /** Texto visible del botón. */
  etiqueta: string
  /** Nombre accesible, si el texto visible no basta («Opciones» de qué). */
  'aria-label'?: string
  children: ReactNode
}

// Patrón Menu Button de la APG (el menú, con el patrón Menu):
// https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
// https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
//
// Ahora se abre con un clic, pero la tarjeta lo recorta (tiene
// overflow: hidden), no se maneja con el teclado y no se anuncia como menú.
export function Menu({ etiqueta, children }: PropsMenu) {
  const [abierto, setAbierto] = useState(false)

  // TODO (paso 4): useId para el botón y el menú; refs al botón, al menú y
  // a un <Fragment> que envuelva las opciones (para focus y focusLast).

  // TODO (paso 4): abrir(foco). Mide el botón con getBoundingClientRect,
  // guarda la posición (top y right) y abre recordando a qué opción va el
  // foco: la primera o la última.

  // TODO (paso 4): cerrar() también devuelve el foco al botón.
  function cerrar() {
    setAbierto(false)
  }

  // TODO (paso 4): un efecto que, al abrir, enfoca la primera o la última
  // opción, y escucha pointerdown en document: un clic fuera del menú y
  // del botón cierra sin devolver el foco.

  // TODO (paso 4): teclas en el botón (flecha abajo abre en la primera,
  // flecha arriba en la última) y en el menú (flechas con vuelta, Inicio,
  // Fin, Escape cierra; Tab cierra sin preventDefault).

  return (
    <>
      {/* TODO (paso 4): aria-haspopup="menu", aria-expanded, aria-controls
          (solo con el menú abierto), aria-label y onKeyDown. */}
      <button type="button" className="kit-menu-boton" onClick={() => setAbierto(!abierto)}>
        {etiqueta}
      </button>
      {/* TODO (paso 4): llévalo con createPortal a document.body, colocado
          bajo el botón con la posición medida, con role="menu",
          aria-labelledby (el id del botón) y onKeyDown. */}
      {abierto && (
        <div className="kit-menu" style={{ position: 'absolute', top: '3.5rem', right: '1rem' }}>
          <MenuContext value={{ cerrar }}>{children}</MenuContext>
        </div>
      )}
    </>
  )
}

type PropsOpcionMenu = {
  onSeleccionar: () => void
  children: ReactNode
}

export function OpcionMenu({ onSeleccionar, children }: PropsOpcionMenu) {
  const menu = use(MenuContext)
  if (!menu) throw new Error('OpcionMenu tiene que ir dentro de un Menu')

  // TODO (paso 4): role="menuitem" y tabIndex={-1}: el foco lo mueve el menú.
  return (
    <button
      type="button"
      className="kit-menu-opcion"
      onClick={() => {
        // Primero se cierra (el foco vuelve al botón) y después se actúa:
        // si la opción abre un diálogo, al cerrarlo el foco volverá al botón.
        menu.cerrar()
        onSeleccionar()
      }}
    >
      {children}
    </button>
  )
}
