// El catálogo de refugios. Lo comparten la interfaz y el servidor simulado.
//
// Los nombres, la zona y la altitud son reales (Wikipedia, octubre de 2026).
// Las plazas son INVENTADAS para el proyecto: no son las de cada refugio.
// Las imágenes (FotoRefugio.tsx) están generadas con IA: no son fotos de los
// refugios reales.

export const IDS_REFUGIOS = ['respomuso', 'pineta', 'estos', 'angel-orus', 'renclusa'] as const

export type IdRefugio = (typeof IDS_REFUGIOS)[number]

export type Refugio = {
  id: IdRefugio
  nombre: string
  zona: string
  altitud: number
  plazas: number
}

export const REFUGIOS: Refugio[] = [
  {
    id: 'respomuso',
    nombre: 'Refugio de Respomuso',
    zona: 'Valle de Tena',
    altitud: 2220,
    plazas: 60,
  },
  {
    id: 'pineta',
    nombre: 'Refugio de Pineta',
    zona: 'Valle de Pineta',
    altitud: 1240,
    plazas: 48,
  },
  {
    id: 'estos',
    nombre: 'Refugio de Estós',
    zona: 'Valle de Estós',
    altitud: 1859,
    plazas: 56,
  },
  {
    id: 'angel-orus',
    nombre: 'Refugio Ángel Orús',
    zona: 'Valle de Eriste',
    altitud: 2148,
    plazas: 40,
  },
  {
    id: 'renclusa',
    nombre: 'Refugio de la Renclusa',
    zona: 'Macizo de la Maladeta',
    altitud: 2140,
    plazas: 80,
  },
]

export function buscarRefugio(id: string): Refugio | undefined {
  return REFUGIOS.find((refugio) => refugio.id === id)
}
