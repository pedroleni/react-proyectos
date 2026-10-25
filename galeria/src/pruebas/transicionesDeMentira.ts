// jsdom no tiene la View Transition API, y sin ella React aplica los cambios
// sin animar (como un navegador antiguo). Esta imitación hace lo justo para
// que React la use: apunta los tipos de cada transición y llama a update,
// que es donde React cambia el DOM. No anima nada ni mide nada: los
// elementos compartidos y las animaciones se comprueban en el navegador.

export interface TransicionApuntada {
  tipos: string[]
}

export function imitarViewTransitions(): { apuntadas: TransicionApuntada[]; quitar: () => void } {
  const apuntadas: TransicionApuntada[] = []
  const raiz = document.documentElement

  document.startViewTransition = ((opciones: StartViewTransitionOptions) => {
    apuntadas.push({ tipos: opciones.types ?? [] })
    const hecho = Promise.resolve().then(() => opciones.update?.())
    return {
      ready: hecho,
      finished: hecho,
      updateCallbackDone: hecho,
      skipTransition() {},
      types: new Set(opciones.types ?? []),
    } as unknown as ViewTransition
  }) as typeof document.startViewTransition

  // Lo demás que React toca durante una transición y jsdom no tiene.
  Object.defineProperty(document, 'fonts', {
    value: { status: 'loaded', ready: Promise.resolve() },
    configurable: true,
  })
  raiz.getAnimations = () => []
  raiz.animate = (() => ({})) as unknown as typeof raiz.animate

  return {
    apuntadas,
    quitar() {
      // @ts-expect-error: se borra para volver a un jsdom sin la API
      delete document.startViewTransition
      // @ts-expect-error: ídem
      delete document.fonts
      // @ts-expect-error: ídem
      delete raiz.getAnimations
      // @ts-expect-error: ídem
      delete raiz.animate
    },
  }
}
