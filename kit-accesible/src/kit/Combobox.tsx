import { useState } from 'react'
import type { ChangeEvent } from 'react'
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
//
// Ahora filtra mientras escribes y se elige con el ratón. Pero el
// teclado no llega a las opciones y un lector de pantalla solo ve un
// campo de texto y una lista que aparece y desaparece en silencio.
export function Combobox({ etiqueta, opciones, valor, onCambiar, ayuda }: PropsCombobox) {
  const [texto, setTexto] = useState(valor ?? '')
  const [abierto, setAbierto] = useState(false)

  // TODO (paso 5): la opción marcada con las flechas, en un estado
  // (activa, -1 si no hay ninguna). El foco no sale del campo: la opción
  // marcada se señala con aria-activedescendant.

  // Si el campo muestra la opción ya elegida, la lista las enseña todas.
  const consulta = texto === valor ? '' : normalizar(texto)
  const filtradas = opciones.filter((opcion) => normalizar(opcion).includes(consulta))
  const listaVisible = abierto && filtradas.length > 0

  // TODO (paso 5): ids con useId. Este id fijo se repetiría si hubiera dos
  // combobox en la misma página. Hacen falta para el campo, la lista, la
  // ayuda y cada opción.
  const idCampo = 'combobox-campo'

  // TODO (paso 5): un efecto que trae a la vista la opción marcada
  // (scrollIntoView con block: 'nearest'; jsdom no lo tiene: usa ?.).

  function elegir(opcion: string) {
    setTexto(opcion)
    setAbierto(false)
    onCambiar(opcion)
  }

  function manejarCambio(evento: ChangeEvent<HTMLInputElement>) {
    setTexto(evento.target.value)
    setAbierto(true)
    if (evento.target.value.trim() === '') onCambiar(null)
  }

  // TODO (paso 5): manejarTeclas. Flecha abajo y arriba abren la lista y
  // marcan la siguiente o la anterior, dando la vuelta (Alt + flecha abajo
  // solo abre); Intro elige la marcada o cierra; Escape cierra la lista y,
  // si ya estaba cerrada, vacía el campo. Si Escape no hace nada, deja que
  // el evento siga subiendo (por ejemplo, a un diálogo).

  // TODO (paso 5): cerrar la lista cuando el campo pierde el foco (onBlur).
  // Cuando lo hagas, pulsar una opción con el ratón dejará de funcionar en
  // el navegador: el mousedown quita el foco al campo antes del clic. La
  // lista necesita onMouseDown con preventDefault.

  return (
    <div className="kit-combobox">
      <label htmlFor={idCampo} className="kit-combobox-etiqueta">
        {etiqueta}
      </label>
      <div className="kit-combobox-caja">
        {/* TODO (paso 5): role="combobox", aria-autocomplete="list",
            aria-expanded, aria-controls, aria-activedescendant,
            aria-describedby (la ayuda), onKeyDown y onBlur. */}
        <input
          id={idCampo}
          type="text"
          autoComplete="off"
          className="kit-combobox-campo"
          value={texto}
          onChange={manejarCambio}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Mostrar opciones de ${etiqueta.toLowerCase()}`}
          className="kit-combobox-boton"
          onMouseDown={(evento) => evento.preventDefault()}
          onClick={() => {
            document.getElementById(idCampo)?.focus()
            setAbierto(!abierto)
          }}
        >
          ▾
        </button>
        {/* TODO (paso 5): role="listbox" con nombre (aria-label) y, en cada
            opción, role="option", id y aria-selected (la marcada). */}
        <ul hidden={!listaVisible} className="kit-combobox-lista">
          {filtradas.map((opcion) => (
            <li key={opcion} className="kit-combobox-opcion" onClick={() => elegir(opcion)}>
              {opcion}
            </li>
          ))}
        </ul>
      </div>
      {ayuda && <p className="kit-combobox-ayuda">{ayuda}</p>}
      {/* TODO (paso 5): una región viva (role="status"), siempre en el DOM,
          que diga cuántos resultados hay mientras la lista está abierta:
          «Sin resultados», «1 resultado», «3 resultados». */}
    </div>
  )
}
