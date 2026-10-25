import { useEffect, useId, useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import { normalizar } from './normalizar'

type PropsCombobox = {
  etiqueta: string
  opciones: string[]
  /** La opción elegida, o null si no hay ninguna. */
  valor: string | null
  onCambiar: (valor: string | null) => void
  ayuda?: string
}

// Patrón Combobox de la APG, con autocompletado de lista:
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
export function Combobox({ etiqueta, opciones, valor, onCambiar, ayuda }: PropsCombobox) {
  const id = useId()
  const [texto, setTexto] = useState(valor ?? '')
  const [abierto, setAbierto] = useState(false)
  // La opción marcada con las flechas: el foco del DOM no se mueve
  // del campo, se señala con aria-activedescendant.
  const [activa, setActiva] = useState(-1)

  // Si el campo muestra la opción ya elegida, la lista las enseña todas.
  const consulta = texto === valor ? '' : normalizar(texto)
  const filtradas = opciones.filter((opcion) => normalizar(opcion).includes(consulta))
  const listaVisible = abierto && filtradas.length > 0

  const idCampo = `${id}-campo`
  const idLista = `${id}-lista`
  const idAyuda = `${id}-ayuda`
  const idOpcion = (indice: number) => `${id}-opcion-${indice}`
  const idActiva = listaVisible && activa >= 0 ? idOpcion(activa) : undefined

  // aria-activedescendant no desplaza la lista como lo haría el foco:
  // la opción marcada se trae a la vista a mano (jsdom no tiene scrollIntoView).
  useEffect(() => {
    if (idActiva) document.getElementById(idActiva)?.scrollIntoView?.({ block: 'nearest' })
  }, [idActiva])

  function elegir(opcion: string) {
    setTexto(opcion)
    setAbierto(false)
    setActiva(-1)
    onCambiar(opcion)
  }

  function cerrarLista() {
    setAbierto(false)
    setActiva(-1)
  }

  function manejarCambio(evento: ChangeEvent<HTMLInputElement>) {
    setTexto(evento.target.value)
    setAbierto(true)
    setActiva(-1)
    if (evento.target.value.trim() === '') onCambiar(null)
  }

  function manejarTeclas(evento: KeyboardEvent<HTMLInputElement>) {
    const ultima = filtradas.length - 1
    switch (evento.key) {
      case 'ArrowDown':
        setAbierto(true)
        if (!evento.altKey) setActiva(listaVisible && activa < ultima ? activa + 1 : 0)
        break
      case 'ArrowUp':
        setAbierto(true)
        setActiva(listaVisible && activa > 0 ? activa - 1 : ultima)
        break
      case 'Enter':
        if (listaVisible && activa >= 0) elegir(filtradas[activa])
        else if (abierto) cerrarLista()
        else return
        break
      case 'Escape':
        if (abierto) cerrarLista()
        else if (texto !== '') {
          setTexto('')
          onCambiar(null)
        } else return // nada que hacer aquí: que siga subiendo (a un diálogo, por ejemplo)
        evento.stopPropagation()
        break
      default:
        return
    }
    evento.preventDefault()
  }

  let resumen = ''
  if (abierto) {
    if (filtradas.length === 0) resumen = 'Sin resultados'
    else resumen = filtradas.length === 1 ? '1 resultado' : `${filtradas.length} resultados`
  }

  return (
    <div className="kit-combobox">
      <label htmlFor={idCampo} className="kit-combobox-etiqueta">
        {etiqueta}
      </label>
      <div className="kit-combobox-caja">
        <input
          id={idCampo}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={listaVisible}
          aria-controls={idLista}
          aria-activedescendant={idActiva}
          aria-describedby={ayuda ? idAyuda : undefined}
          className="kit-combobox-campo"
          value={texto}
          onChange={manejarCambio}
          onKeyDown={manejarTeclas}
          onBlur={cerrarLista}
        />
        {/* Fuera del recorrido del Tab, como en el ejemplo de la APG:
            sirve para abrir la lista con el dedo o el ratón. */}
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Mostrar opciones de ${etiqueta.toLowerCase()}`}
          aria-expanded={listaVisible}
          aria-controls={idLista}
          className="kit-combobox-boton"
          onMouseDown={(evento) => evento.preventDefault()}
          onClick={() => {
            document.getElementById(idCampo)?.focus()
            setAbierto(!abierto)
          }}
        >
          ▾
        </button>
        <ul
          id={idLista}
          role="listbox"
          aria-label={etiqueta}
          hidden={!listaVisible}
          className="kit-combobox-lista"
          // Sin esto, el mousedown quita el foco al campo, el onBlur cierra
          // la lista y el clic ya no llega a la opción.
          onMouseDown={(evento) => evento.preventDefault()}
        >
          {filtradas.map((opcion, indice) => (
            <li
              key={opcion}
              id={idOpcion(indice)}
              role="option"
              aria-selected={indice === activa}
              className="kit-combobox-opcion"
              onClick={() => elegir(opcion)}
            >
              {opcion}
            </li>
          ))}
        </ul>
      </div>
      {ayuda && (
        <p id={idAyuda} className="kit-combobox-ayuda">
          {ayuda}
        </p>
      )}
      {/* La región viva existe desde el principio; solo cambia su texto (lección 37). */}
      <p role="status" className="kit-combobox-resumen">
        {resumen}
      </p>
    </div>
  )
}
