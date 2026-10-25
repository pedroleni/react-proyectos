import type { ComponentProps } from 'react'
import { Link, type To } from 'react-router'
import type { Direccion } from '../transiciones'

type Props = Omit<ComponentProps<'a'>, 'href' | 'onClick'> & {
  to: To
  /** El tipo de transición que se añade a la navegación (addTransitionType). */
  tipo: Direccion
  replace?: boolean
  state?: unknown
}

// Un <Link> que, además de navegar, dice hacia dónde.
export default function EnlaceConTipo({ to, tipo, replace, state, ...resto }: Props) {
  // TODO (paso 5): de momento es un <Link> normal y el tipo no llega a ninguna
  // parte (solo se queda en data-tipo, para que lo veas en las DevTools).
  // Devuelve un <a> con href={useHref(to)} y un onClick que haga, dentro de
  // startTransition, addTransitionType(tipo) y después navegue con el
  // manejador que te da useLinkClickHandler(to, { replace, state }).
  return <Link {...resto} to={to} replace={replace} state={state} data-tipo={tipo} />
}
