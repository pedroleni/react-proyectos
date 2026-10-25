// Tarifas INVENTADAS para el proyecto, en euros por persona y noche
// (solo dormir). Quien tiene licencia federativa de montaña paga menos,
// como en muchos refugios de verdad.
export const TARIFAS = { general: 22, federado: 12 }

type Estancia = { noches: number; personas: number; federados: number }

export function calcularImporte({ noches, personas, federados }: Estancia): number {
  const porNoche = federados * TARIFAS.federado + (personas - federados) * TARIFAS.general
  return porNoche * noches
}

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

export function formatearEuros(cantidad: number): string {
  return euros.format(cantidad)
}
