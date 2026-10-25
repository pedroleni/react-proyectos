import { useState } from 'react'
import type { ReactNode } from 'react'

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
//
// Ahora funciona con el ratón, pero para un lector de pantalla son botones
// sueltos y un texto, y con el teclado solo se llega a ellos con Tab.
export function Pestanas({ pestanas, inicial = pestanas[0]?.id }: PropsPestanas) {
  const [activa, setActiva] = useState(inicial)

  // TODO (paso 1): un prefijo con useId para los ids de pestañas y paneles,
  // para que dos grupos de pestañas en la misma página no choquen.

  // TODO (paso 1): manejarTeclas. Flecha derecha e izquierda pasan a la
  // pestaña siguiente o anterior, dando la vuelta en los extremos; Inicio y
  // Fin van a la primera y a la última. Además de activarla, hay que
  // enfocarla (la pestaña ya está en el DOM: puedes enfocarla en el acto).

  return (
    <div className="kit-pestanas">
      {/* TODO (paso 1): role="tablist", la prop etiqueta como aria-label y onKeyDown */}
      <div className="kit-pestanas-lista">
        {pestanas.map((p) => (
          // TODO (paso 1): role="tab", id, aria-selected, aria-controls y
          // tabIndex: 0 en la activa y -1 en las demás (foco itinerante).
          <button key={p.id} type="button" className="kit-pestana" onClick={() => setActiva(p.id)}>
            {p.titulo}
          </button>
        ))}
      </div>
      {/* TODO (paso 1): pinta todos los paneles con role="tabpanel", id,
          aria-labelledby y tabIndex={0}, y oculta con hidden los que no tocan. */}
      {pestanas
        .filter((p) => p.id === activa)
        .map((p) => (
          <div key={p.id} className="kit-pestanas-panel">
            {p.contenido}
          </div>
        ))}
    </div>
  )
}
