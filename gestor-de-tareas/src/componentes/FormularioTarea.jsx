import { useId } from 'react'

export default function FormularioTarea() {
  const idEntrada = useId()

  // TODO (paso 3): consigue dispatch con useTareasDispatch() (de
  // '../TareasContext').
  // TODO (paso 3): convierte el campo en un input controlado: un estado
  // `texto` con useState, value={texto} y un onChange que lo actualice.
  // TODO (paso 3): crea una ref con useRef(null) y pásasela al input con
  // ref={...}, para poder devolverle el foco después de añadir.

  function manejarEnvio(evento) {
    evento.preventDefault()
    // TODO (paso 3): despacha la acción de añadir. Lo que no puede ir en
    // el reductor (un id aleatorio y la hora de ahora) se calcula aquí:
    //   dispatch({ type: 'anadida', id: crypto.randomUUID(), texto, creadaEn: new Date().toISOString() })
    // Después vacía el campo y devuélvele el foco con la ref.
  }

  return (
    <form className="formulario-tarea" onSubmit={manejarEnvio}>
      <label htmlFor={idEntrada} className="sr-only">
        Nueva tarea
      </label>
      <input id={idEntrada} type="text" placeholder="¿Qué hay que hacer?" autoComplete="off" required />
      <button type="submit">Añadir</button>
    </form>
  )
}
