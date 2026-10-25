// Fechas que se pintan igual en el servidor y en el navegador.

/**
 * «21 de octubre de 2026 a las 9:30». Con el idioma y la zona horaria fijos:
 * la revista se publica en hora peninsular, y así el servidor (en UTC, en
 * Virginia o donde sea) y el navegador (en Madrid o en Buenos Aires) escriben
 * exactamente el mismo texto.
 */
export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Europe/Madrid',
  })
}

const MINUTO = 60_000
const HORA = 60 * MINUTO
const DIA = 24 * HORA

const relativa = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

/** «hace 5 minutos», «ayer», «hace 3 semanas»... entre una fecha y un instante. */
export function haceCuanto(iso: string, ahora: number): string {
  const diferencia = Date.parse(iso) - ahora // negativa: es del pasado
  const distancia = Math.abs(diferencia)
  if (distancia < MINUTO) return 'ahora mismo'
  if (distancia < HORA) return relativa.format(Math.round(diferencia / MINUTO), 'minute')
  if (distancia < DIA) return relativa.format(Math.round(diferencia / HORA), 'hour')
  if (distancia < 7 * DIA) return relativa.format(Math.round(diferencia / DIA), 'day')
  if (distancia < 30 * DIA) return relativa.format(Math.round(diferencia / (7 * DIA)), 'week')
  if (distancia < 365 * DIA) return relativa.format(Math.round(diferencia / (30 * DIA)), 'month')
  return relativa.format(Math.round(diferencia / (365 * DIA)), 'year')
}
