// Los favoritos: un segundo almacén externo, este sobre localStorage. Es el
// patrón de la lección 46: guardar el texto leído la última vez y devolver el
// mismo Set mientras no cambie, y avisar a mano en esta pestaña, porque el
// evento storage solo llega a las demás.

import { useSyncExternalStore } from 'react'

const CLAVE = 'panel-tiempo-real:favoritos:v1'
const oyentes = new Set<() => void>()

let textoAnterior: string | null = null
let favoritosAnteriores: ReadonlySet<string> = new Set()

function leerTexto(): string {
  try {
    return localStorage.getItem(CLAVE) ?? '[]'
  } catch {
    return '[]' // localStorage bloqueado: sin favoritos, pero sin romperse
  }
}

function aSet(texto: string): ReadonlySet<string> {
  try {
    const datos: unknown = JSON.parse(texto)
    return new Set(Array.isArray(datos) ? datos.filter((s): s is string => typeof s === 'string') : [])
  } catch {
    return new Set()
  }
}

export function leerFavoritos(): ReadonlySet<string> {
  const texto = leerTexto()
  if (texto !== textoAnterior) {
    textoAnterior = texto
    favoritosAnteriores = aSet(texto)
  }
  return favoritosAnteriores
}

export function suscribirFavoritos(avisar: () => void) {
  function alCambiarOtraPestana(evento: StorageEvent) {
    if (evento.key === CLAVE || evento.key === null) avisar()
  }
  oyentes.add(avisar)
  window.addEventListener('storage', alCambiarOtraPestana)
  return () => {
    oyentes.delete(avisar)
    window.removeEventListener('storage', alCambiarOtraPestana)
  }
}

export function alternarFavorito(simbolo: string) {
  const nuevos = new Set(leerFavoritos())
  if (nuevos.has(simbolo)) nuevos.delete(simbolo)
  else nuevos.add(simbolo)
  try {
    localStorage.setItem(CLAVE, JSON.stringify([...nuevos]))
  } catch {
    // Sin localStorage, el favorito no se guarda; la aplicación sigue.
  }
  for (const avisar of oyentes) avisar()
}

export function useFavoritos(): ReadonlySet<string> {
  return useSyncExternalStore(suscribirFavoritos, leerFavoritos)
}
