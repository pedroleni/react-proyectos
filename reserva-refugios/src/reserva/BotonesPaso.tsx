import type { MouseEvent } from 'react'
import { useFormStatus } from 'react-dom'
import type { Paso } from './tipos'

const TEXTOS: Record<Paso, [normal: string, enviando: string]> = {
  refugio: ['Ver plazas y seguir', 'Buscando plazas…'],
  grupo: ['Seguir', 'Comprobando…'],
  confirmar: ['Confirmar reserva', 'Confirmando…'],
  hecha: ['Hacer otra reserva', 'Un momento…'],
}

// Va dentro del <form>: useFormStatus lee el envío del formulario que lo
// envuelve (lección 59).
export default function BotonesPaso({ paso }: { paso: Paso }) {
  const { pending, data } = useFormStatus()
  const volviendo = data?.get('intencion') === 'atras'
  const [texto, textoEnviando] = TEXTOS[paso]

  // Mientras se envía, los botones no hacen nada. Con aria-disabled en vez
  // de disabled: un botón desactivado pierde el foco, y quien usa el teclado
  // o un lector de pantalla se quedaría sin saber dónde está.
  function siEstaOcupado(evento: MouseEvent<HTMLButtonElement>) {
    if (pending) evento.preventDefault()
  }

  return (
    <div className="botones">
      {/* «Seguir» va el primero en el DOM: Intro en un campo envía con el
          primer botón del formulario, y no queremos que Intro te lleve atrás. */}
      <button
        type="submit"
        name="intencion"
        value="seguir"
        className="boton-principal"
        aria-disabled={pending || undefined}
        onClick={siEstaOcupado}
      >
        {pending && !volviendo ? textoEnviando : texto}
      </button>
      {(paso === 'grupo' || paso === 'confirmar') && (
        <button
          type="submit"
          name="intencion"
          value="atras"
          className="boton-secundario"
          aria-disabled={pending || undefined}
          onClick={siEstaOcupado}
        >
          Atrás
        </button>
      )}
    </div>
  )
}
