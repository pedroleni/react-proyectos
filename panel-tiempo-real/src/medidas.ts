// Las medidas del <Profiler>. Se guardan fuera de React: un setState dentro
// de onRender provocaría otro commit, que volvería a llamar a onRender...
// (lección 65). El medidor las lee una vez por segundo.

import type { ProfilerOnRenderCallback } from 'react'

const VENTANA = 10_000 // el resumen cubre los últimos 10 segundos

interface Medida {
  real: number // actualDuration: lo que ha tardado este commit
  base: number // baseDuration: lo que tardaría sin saltarse nada
  hora: number // commitTime
}

export interface Resumen {
  commits: number
  mediaReal: number
  maximaReal: number
  mediaBase: number
}

const medidas: Medida[] = []
let resumen: Resumen | null = null

export const registrarRender: ProfilerOnRenderCallback = (_id, fase, duracionReal, duracionBase, _inicio, commit) => {
  // El montaje inicial no cuenta: se mide lo que cuesta cada segundo de mercado.
  if (fase === 'mount') return
  medidas.push({ real: duracionReal, base: duracionBase, hora: commit })
}

function calcularResumen(): Resumen | null {
  const desde = performance.now() - VENTANA
  while (medidas.length > 0 && medidas[0].hora < desde) medidas.shift()
  if (medidas.length === 0) return null
  let real = 0
  let base = 0
  let maxima = 0
  for (const m of medidas) {
    real += m.real
    base += m.base
    maxima = Math.max(maxima, m.real)
  }
  return {
    commits: medidas.length,
    mediaReal: real / medidas.length,
    maximaReal: maxima,
    mediaBase: base / medidas.length,
  }
}

export function suscribirCadaSegundo(avisar: () => void) {
  const intervalo = setInterval(() => {
    resumen = calcularResumen()
    avisar()
  }, 1000)
  return () => clearInterval(intervalo)
}

export function leerResumen(): Resumen | null {
  return resumen
}
