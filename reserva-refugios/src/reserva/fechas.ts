// Las fechas viajan como texto 'AAAA-MM-DD', igual que las da un
// <input type="date">. Para sumar días y darles formato se tratan en UTC:
// así un cambio de hora (o la zona horaria del ordenador) no mueve ningún día.

const MS_POR_DIA = 24 * 60 * 60 * 1000

/** Hoy, en el calendario de quien usa la página. */
export function hoy(): string {
  const ahora = new Date()
  const mes = String(ahora.getMonth() + 1).padStart(2, '0')
  const dia = String(ahora.getDate()).padStart(2, '0')
  return `${ahora.getFullYear()}-${mes}-${dia}`
}

function aFecha(texto: string): Date {
  const [anio, mes, dia] = texto.split('-').map(Number)
  return new Date(Date.UTC(anio, mes - 1, dia))
}

export function sumarDias(fecha: string, dias: number): string {
  return new Date(aFecha(fecha).getTime() + dias * MS_POR_DIA).toISOString().slice(0, 10)
}

/** Las noches de una estancia: la de llegada y las siguientes. */
export function nochesDeLaEstancia(llegada: string, noches: number): string[] {
  return Array.from({ length: noches }, (_, i) => sumarDias(llegada, i))
}

/** Se reserva desde mañana y hasta 90 días vista. */
export const DIAS_DE_ANTELACION = 90

export function primeraLlegada(): string {
  return sumarDias(hoy(), 1)
}

export function ultimaLlegada(): string {
  return sumarDias(hoy(), DIAS_DE_ANTELACION)
}

const larga = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const corta = new Intl.DateTimeFormat('es-ES', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

/** «sábado 14 de noviembre» o «sáb 14 nov» */
export function formatearFecha(fecha: string, estilo: 'larga' | 'corta' = 'larga'): string {
  // Intl pone una coma tras el día de la semana («sábado, 14...»): fuera.
  return (estilo === 'larga' ? larga : corta).format(aFecha(fecha)).replace(',', '')
}
