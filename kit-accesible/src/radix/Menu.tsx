import { DropdownMenu } from 'radix-ui'
import type { ReactNode } from 'react'

type PropsMenu = {
  etiqueta: string
  'aria-label'?: string
  children: ReactNode
}

export function Menu({ etiqueta, 'aria-label': nombre, children }: PropsMenu) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="kit-menu-boton" aria-label={nombre}>
        {etiqueta}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        {/* loop: que las flechas den la vuelta, como en tu kit (por defecto, no). */}
        <DropdownMenu.Content className="kit-menu" align="end" sideOffset={4} loop>
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

type PropsOpcionMenu = {
  onSeleccionar: () => void
  children: ReactNode
}

export function OpcionMenu({ onSeleccionar, children }: PropsOpcionMenu) {
  return (
    <DropdownMenu.Item className="kit-menu-opcion" onSelect={onSeleccionar}>
      {children}
    </DropdownMenu.Item>
  )
}
