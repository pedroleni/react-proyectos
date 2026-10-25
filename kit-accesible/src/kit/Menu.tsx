import { Fragment, createContext, use, useEffect, useId, useRef, useState } from 'react'
import type { FragmentInstance, KeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'

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

type Foco = 'primera' | 'ultima'

// Patrón Menu Button de la APG (el menú, con el patrón Menu):
// https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
// https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
export function Menu({ etiqueta, 'aria-label': nombre, children }: PropsMenu) {
  const idBoton = useId()
  const idMenu = useId()
  const boton = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const opciones = useRef<FragmentInstance>(null)
  // null: cerrado. Si no, a qué opción va el foco al abrir.
  const [abierto, setAbierto] = useState<Foco | null>(null)
  const [posicion, setPosicion] = useState({ top: 0, right: 0 })

  function abrir(foco: Foco) {
    // Se mide en el manejador: es cuando se sabe dónde está el botón.
    const caja = boton.current!.getBoundingClientRect()
    setPosicion({
      top: caja.bottom + window.scrollY + 4,
      right: document.documentElement.clientWidth - caja.right - window.scrollX,
    })
    setAbierto(foco)
  }

  function cerrar() {
    setAbierto(null)
    boton.current?.focus()
  }

  useEffect(() => {
    if (!abierto) return
    // El menú no sabe qué opciones le han pasado: el Fragment sí sabe
    // cuál es la primera y la última que se pueden enfocar.
    if (abierto === 'ultima') opciones.current?.focusLast()
    else opciones.current?.focus()

    // Un clic fuera cierra sin robar el foco: va a donde se ha pulsado.
    function pulsarFuera(evento: PointerEvent) {
      const objetivo = evento.target as Node
      if (!menu.current?.contains(objetivo) && !boton.current?.contains(objetivo)) setAbierto(null)
    }
    document.addEventListener('pointerdown', pulsarFuera)
    return () => document.removeEventListener('pointerdown', pulsarFuera)
  }, [abierto])

  function manejarTeclasBoton(evento: KeyboardEvent<HTMLButtonElement>) {
    if (evento.key === 'ArrowDown') abrir('primera')
    else if (evento.key === 'ArrowUp') abrir('ultima')
    else return
    evento.preventDefault()
  }

  function manejarTeclasMenu(evento: KeyboardEvent<HTMLDivElement>) {
    const items = [...menu.current!.querySelectorAll<HTMLElement>('[role="menuitem"]')]
    const actual = items.indexOf(document.activeElement as HTMLElement)
    switch (evento.key) {
      case 'ArrowDown':
        items[actual === items.length - 1 ? 0 : actual + 1]?.focus()
        break
      case 'ArrowUp':
        items[actual <= 0 ? items.length - 1 : actual - 1]?.focus()
        break
      case 'Home':
        opciones.current?.focus()
        break
      case 'End':
        opciones.current?.focusLast()
        break
      case 'Escape':
        cerrar()
        break
      case 'Tab':
        // Sin preventDefault: el foco vuelve al botón y el navegador
        // sigue el Tab desde ahí, al siguiente elemento de la página.
        cerrar()
        return
      default:
        return
    }
    evento.preventDefault()
  }

  return (
    <>
      <button
        ref={boton}
        id={idBoton}
        type="button"
        aria-haspopup="menu"
        aria-expanded={abierto !== null}
        aria-controls={abierto ? idMenu : undefined}
        aria-label={nombre}
        className="kit-menu-boton"
        onClick={() => (abierto ? setAbierto(null) : abrir('primera'))}
        onKeyDown={manejarTeclasBoton}
      >
        {etiqueta}
      </button>
      {abierto &&
        createPortal(
          <div
            ref={menu}
            id={idMenu}
            role="menu"
            aria-labelledby={idBoton}
            className="kit-menu"
            style={{ position: 'absolute', ...posicion }}
            onKeyDown={manejarTeclasMenu}
          >
            <MenuContext value={{ cerrar }}>
              <Fragment ref={opciones}>{children}</Fragment>
            </MenuContext>
          </div>,
          document.body,
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

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
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
