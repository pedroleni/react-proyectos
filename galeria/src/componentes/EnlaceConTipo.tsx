import { addTransitionType, startTransition, type ComponentProps, type MouseEvent } from 'react'
import { useHref, useLinkClickHandler, type To } from 'react-router'
import type { Direccion } from '../transiciones'

type Props = Omit<ComponentProps<'a'>, 'href' | 'onClick'> & {
  to: To
  /** El tipo de transición que se añade a la navegación (addTransitionType). */
  tipo: Direccion
  replace?: boolean
  state?: unknown
}

// Un <Link> que, además de navegar, dice hacia dónde: la navegación va dentro
// de una transición con su tipo, y los <ViewTransition> eligen la animación
// según ese tipo. Sigue siendo un enlace de verdad: Ctrl o Cmd + clic lo abren
// en otra pestaña, porque de eso se encarga useLinkClickHandler.
export default function EnlaceConTipo({ to, tipo, replace, state, ...resto }: Props) {
  const href = useHref(to)
  const navegarSegunElClic = useLinkClickHandler<HTMLAnchorElement>(to, { replace, state })

  function manejarClic(evento: MouseEvent<HTMLAnchorElement>) {
    startTransition(() => {
      addTransitionType(tipo)
      // React Router actualiza su estado dentro de otro startTransition, que
      // hereda el tipo de este.
      navegarSegunElClic(evento)
    })
  }

  return <a {...resto} href={href} onClick={manejarClic} />
}
