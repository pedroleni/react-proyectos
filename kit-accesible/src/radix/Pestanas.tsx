import { Tabs } from 'radix-ui'
import type { Pestana } from '../kit/Pestanas'

type PropsPestanas = {
  etiqueta: string
  pestanas: Pestana[]
  inicial?: string
}

export function Pestanas({ etiqueta, pestanas, inicial = pestanas[0]?.id }: PropsPestanas) {
  return (
    <Tabs.Root defaultValue={inicial} className="kit-pestanas">
      <Tabs.List aria-label={etiqueta} className="kit-pestanas-lista">
        {pestanas.map((p) => (
          <Tabs.Trigger key={p.id} value={p.id} className="kit-pestana">
            {p.titulo}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {pestanas.map((p) => (
        <Tabs.Content key={p.id} value={p.id} className="kit-pestanas-panel">
          {p.contenido}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
