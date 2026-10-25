import { useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

export type Pestana = {
  id: string
  titulo: string
  contenido: ReactNode
}

type PropsPestanas = {
  /** Nombre accesible de la lista de pestañas (no se ve en pantalla). */
  etiqueta: string
  pestanas: Pestana[]
  /** id de la pestaña activa al empezar; por defecto, la primera. */
  inicial?: string
}

// Patrón Tabs de la APG, con activación automática:
// https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
export function Pestanas({ etiqueta, pestanas, inicial = pestanas[0]?.id }: PropsPestanas) {
  const base = useId()
  const [activa, setActiva] = useState(inicial)
  const lista = useRef<HTMLDivElement>(null)

  const idPestana = (id: string) => `${base}-pestana-${id}`
  const idPanel = (id: string) => `${base}-panel-${id}`

  function activar(indice: number) {
    const pestana = pestanas[indice]
    setActiva(pestana.id)
    // La pestaña ya existe en el DOM: se puede enfocar sin esperar al render.
    lista.current?.querySelectorAll<HTMLElement>('[role="tab"]')[indice]?.focus()
  }

  function manejarTeclas(evento: KeyboardEvent<HTMLDivElement>) {
    const actual = pestanas.findIndex((p) => p.id === activa)
    const ultima = pestanas.length - 1
    switch (evento.key) {
      case 'ArrowRight':
        activar(actual === ultima ? 0 : actual + 1)
        break
      case 'ArrowLeft':
        activar(actual === 0 ? ultima : actual - 1)
        break
      case 'Home':
        activar(0)
        break
      case 'End':
        activar(ultima)
        break
      default:
        return
    }
    evento.preventDefault()
  }

  return (
    <div className="kit-pestanas">
      <div
        ref={lista}
        role="tablist"
        aria-label={etiqueta}
        className="kit-pestanas-lista"
        onKeyDown={manejarTeclas}
      >
        {pestanas.map((p) => (
          <button
            key={p.id}
            id={idPestana(p.id)}
            type="button"
            role="tab"
            aria-selected={p.id === activa}
            aria-controls={idPanel(p.id)}
            tabIndex={p.id === activa ? 0 : -1}
            className="kit-pestana"
            onClick={() => setActiva(p.id)}
          >
            {p.titulo}
          </button>
        ))}
      </div>
      {pestanas.map((p) => (
        <div
          key={p.id}
          id={idPanel(p.id)}
          role="tabpanel"
          aria-labelledby={idPestana(p.id)}
          tabIndex={0}
          hidden={p.id !== activa}
          className="kit-pestanas-panel"
        >
          {p.contenido}
        </div>
      ))}
    </div>
  )
}
