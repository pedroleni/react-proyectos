import { useId, useRef, useState } from 'react'
import { useTareasDispatch } from '../TareasContext'

export default function FormularioTarea() {
  const dispatch = useTareasDispatch()
  const [texto, setTexto] = useState('')
  const entradaRef = useRef(null)
  const idEntrada = useId()

  function manejarEnvio(evento) {
    evento.preventDefault()
    // Lo que no puede ir en el reductor (un id aleatorio, la hora de
    // ahora) se calcula aquí, una sola vez por envío, y viaja en la acción.
    dispatch({
      type: 'anadida',
      id: crypto.randomUUID(),
      texto,
      creadaEn: new Date().toISOString(),
    })
    setTexto('')
    entradaRef.current.focus()
  }

  return (
    <form className="formulario-tarea" onSubmit={manejarEnvio}>
      <label htmlFor={idEntrada} className="sr-only">
        Nueva tarea
      </label>
      <input
        id={idEntrada}
        ref={entradaRef}
        type="text"
        placeholder="¿Qué hay que hacer?"
        autoComplete="off"
        required
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
      />
      <button type="submit">Añadir</button>
    </form>
  )
}
