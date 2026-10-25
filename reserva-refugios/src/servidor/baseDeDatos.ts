import type { DatosReserva } from '../reserva/esquema'
import { nochesDeLaEstancia } from '../reserva/fechas'
import { calcularImporte } from '../reserva/importe'
import { buscarRefugio, type IdRefugio, type Refugio } from '../reserva/refugios'
import type { Noche, ReservaConfirmada } from '../reserva/tipos'

// La «base de datos» del servidor simulado: vive en memoria, así que al
// recargar la página vuelve a empezar. Las plazas ocupadas de cada noche son
// INVENTADAS, pero siempre las mismas para el mismo refugio y la misma fecha:
// los fines de semana hay más gente, y alguno está completo.

const ocupadas = new Map<string, number>()
let reservas: ReservaConfirmada[] = []
let siguienteNumero = 1001

function clave(refugio: IdRefugio, fecha: string) {
  return `${refugio}|${fecha}`
}

/** Un número entre 0 y 1 que depende solo del texto (hash FNV-1a). */
function azarFijo(texto: string): number {
  let hash = 2166136261
  for (const letra of texto) {
    hash ^= letra.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967296
}

function ocupadasAlEmpezar(refugio: Refugio, fecha: string): number {
  const diaDeLaSemana = new Date(`${fecha}T00:00:00Z`).getUTCDay()
  const finDeSemana = diaDeLaSemana === 5 || diaDeLaSemana === 6
  const proporcion = (finDeSemana ? 0.7 : 0.3) + (azarFijo(clave(refugio.id, fecha)) - 0.5) * 0.6
  return Math.max(0, Math.min(refugio.plazas, Math.round(refugio.plazas * proporcion)))
}

function leerOcupadas(refugio: Refugio, fecha: string): number {
  return ocupadas.get(clave(refugio.id, fecha)) ?? ocupadasAlEmpezar(refugio, fecha)
}

export function nochesDe(id: IdRefugio, llegada: string, noches: number): Noche[] {
  const refugio = buscarRefugio(id)!
  return nochesDeLaEstancia(llegada, noches).map((fecha) => ({
    fecha,
    plazas: refugio.plazas,
    libres: refugio.plazas - leerOcupadas(refugio, fecha),
  }))
}

/** Guarda la reserva, ocupa sus plazas y le pone un localizador. */
export function guardarReserva(datos: DatosReserva): ReservaConfirmada {
  const refugio = buscarRefugio(datos.refugio)!
  for (const fecha of nochesDeLaEstancia(datos.llegada, datos.noches)) {
    ocupadas.set(clave(refugio.id, fecha), leerOcupadas(refugio, fecha) + datos.personas)
  }
  const prefijo = refugio.id.slice(0, 3).toUpperCase()
  const reserva = {
    ...datos,
    localizador: `${prefijo}-${siguienteNumero++}`,
    importe: calcularImporte(datos),
  }
  reservas = [...reservas, reserva]
  return reserva
}

/** Otro grupo reserva justo antes que tú y deja menos plazas de las que
 * necesitas en cada noche de tu estancia. */
export function otroGrupoSeAdelanta(datos: DatosReserva) {
  const refugio = buscarRefugio(datos.refugio)!
  const quedan = Math.floor(datos.personas / 2)
  for (const fecha of nochesDeLaEstancia(datos.llegada, datos.noches)) {
    const libres = refugio.plazas - leerOcupadas(refugio, fecha)
    if (libres > quedan) ocupadas.set(clave(refugio.id, fecha), refugio.plazas - quedan)
  }
}

/** Para los tests: cuántas plazas hay ocupadas una noche. */
export function fijarOcupadas(id: IdRefugio, fecha: string, cuantas: number) {
  ocupadas.set(clave(id, fecha), cuantas)
}

export function contarReservas(): number {
  return reservas.length
}

export function reiniciarBaseDeDatos() {
  ocupadas.clear()
  reservas = []
  siguienteNumero = 1001
}
