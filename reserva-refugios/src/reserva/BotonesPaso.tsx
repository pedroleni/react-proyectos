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

  // TODO (paso 4): mientras se envía, los botones están desactivados con
  // disabled, y un botón desactivado pierde el foco: va a parar al <body>.
  // Cámbialo por aria-disabled={pending || undefined} y un onClick que, si
  // pending, llame a evento.preventDefault(): así no se envía dos veces y el
  // foco se queda en el botón.

  return (
    <div className="botones">
      {/* «Seguir» va el primero en el DOM: Intro en un campo envía con el
          primer botón del formulario, y no queremos que Intro te lleve atrás. */}
      <button
        type="submit"
        name="intencion"
        value="seguir"
        className="boton-principal"
        disabled={pending}
      >
        {pending && !volviendo ? textoEnviando : texto}
      </button>
      {(paso === 'grupo' || paso === 'confirmar') && (
        <button
          type="submit"
          name="intencion"
          value="atras"
          className="boton-secundario"
          disabled={pending}
        >
          Atrás
        </button>
      )}
    </div>
  )
}
