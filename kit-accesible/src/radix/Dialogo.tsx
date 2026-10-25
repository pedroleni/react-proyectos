import { useRef } from 'react'
import { Dialog } from 'radix-ui'
import type { ReactNode } from 'react'

type PropsDialogo = {
  abierto: boolean
  onCerrar: () => void
  titulo: string
  descripcion?: string
  children: ReactNode
}

export function Dialogo({ abierto, onCerrar, titulo, descripcion, children }: PropsDialogo) {
  // Radix devuelve el foco a su Dialog.Trigger. Aquí no hay Trigger (el
  // diálogo se abre desde un menú), así que se guarda quién tenía el foco.
  const anterior = useRef<Element | null>(null)

  function recordarFoco() {
    const activo = document.activeElement
    // El menú de Radix devuelve el foco a su botón un instante después de
    // cerrarse: cuando el diálogo se abre, el foco aún está en la opción,
    // que va a desaparecer. El que abrió el diálogo es el botón del menú.
    const menu = activo?.closest('[role="menu"]')
    anterior.current = menu ? document.getElementById(menu.getAttribute('aria-labelledby') ?? '') : activo
  }

  return (
    <Dialog.Root open={abierto} onOpenChange={(abrir) => !abrir && onCerrar()}>
      <Dialog.Portal>
        <Dialog.Overlay className="kit-dialogo-fondo">
          <Dialog.Content
            className="kit-dialogo"
            // Sin descripción, Radix avisa en la consola salvo que se diga así.
            {...(descripcion ? {} : { 'aria-describedby': undefined })}
            onOpenAutoFocus={recordarFoco}
            onCloseAutoFocus={(evento) => {
              evento.preventDefault()
              if (anterior.current instanceof HTMLElement) anterior.current.focus()
            }}
          >
            <Dialog.Title className="kit-dialogo-titulo">{titulo}</Dialog.Title>
            {descripcion && <Dialog.Description className="kit-dialogo-descripcion">{descripcion}</Dialog.Description>}
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
