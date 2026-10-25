// Las cartas al director: se validan y se guardan aquí, en el servidor. Usa
// node:fs, que no existe en el navegador, y guarda el correo de cada lector,
// que no se publica: dos motivos para que este módulo sea .server.
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { CamposCarta, CartaPublica } from '~/tipos'

type Carta = CartaPublica & { articulo: string; correo: string }

/** Las cartas que ya estaban publicadas antes de que llegaras. */
const CARTAS_INICIALES: Carta[] = [
  {
    id: 'pilar-gracia',
    articulo: 'caja-alta-y-caja-baja',
    nombre: 'Pilar Gracia',
    correo: 'pilar.gracia@correo.example',
    texto:
      'Mi abuelo fue cajista en una imprenta de Huesca y hablaba de «la caja de abajo» sin pensar en minúsculas. Ahora entiendo de dónde le venía.',
    fecha: '2026-10-21T13:12:00+02:00',
  },
  {
    id: 'andres-royo',
    articulo: 'caja-alta-y-caja-baja',
    nombre: 'Andrés Royo',
    correo: 'andres.royo@correo.example',
    texto:
      'En la imprenta de mi instituto la caja estaba tan gastada que los cajetines de la e y la a se reconocían por el brillo de la madera.',
    fecha: '2026-10-22T08:47:00+02:00',
  },
  {
    id: 'lucia-monge',
    articulo: 'las-comillas-que-pide-la-ortografia',
    nombre: 'Lucía Monge',
    correo: 'lucia.monge@correo.example',
    texto: 'Desde que leí este artículo uso las latinas también en los correos. Cuesta poco y se lee mejor.',
    fecha: '2026-10-02T19:05:00+02:00',
  },
]

/** El archivo donde se guardan. Los tests usan otro, con la variable de entorno. */
function archivo(): string {
  return process.env.ARCHIVO_CARTAS ?? path.resolve('datos', 'cartas.json')
}

async function leerTodas(): Promise<Carta[]> {
  try {
    return JSON.parse(await readFile(archivo(), 'utf8')) as Carta[]
  } catch (error) {
    // La primera vez todavía no hay archivo: solo las cartas iniciales.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return CARTAS_INICIALES
    throw error
  }
}

/** Las cartas publicadas de un artículo, de la más antigua a la más reciente, sin el correo. */
export async function leerCartas(articulo: string): Promise<CartaPublica[]> {
  const todas = await leerTodas()
  return todas
    .filter((carta) => carta.articulo === articulo)
    .sort((a, b) => Date.parse(a.fecha) - Date.parse(b.fecha))
    .map(({ id, nombre, texto, fecha }) => ({ id, nombre, texto, fecha }))
}

/** Guarda una carta ya validada y la devuelve con su id. */
export async function guardarCarta(
  articulo: string,
  datos: Record<CamposCarta, string>,
): Promise<CartaPublica> {
  const carta: Carta = { id: randomUUID(), articulo, fecha: new Date().toISOString(), ...datos }
  const todas = await leerTodas()
  await mkdir(path.dirname(archivo()), { recursive: true })
  await writeFile(archivo(), JSON.stringify([...todas, carta], null, 2))
  return { id: carta.id, nombre: carta.nombre, texto: carta.texto, fecha: carta.fecha }
}

// ------------------------------------------------------------- la validación

export const LIMITES = { nombre: 60, textoMinimo: 20, texto: 800 }

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ResultadoValidacion =
  | { ok: true; carta: Record<CamposCarta, string> }
  | { ok: false; errores: Partial<Record<CamposCarta, string>>; valores: Record<CamposCarta, string> }

/**
 * Comprueba la carta que llega del formulario. Todo lo que llega en una
 * petición lo controla quien la envía: los required y maxLength del HTML
 * ayudan a quien usa la página, pero esta es la comprobación que cuenta.
 */
export function validarCarta(formData: FormData): ResultadoValidacion {
  const leer = (campo: CamposCarta) => {
    const valor = formData.get(campo)
    return typeof valor === 'string' ? valor.trim() : ''
  }
  const valores = { nombre: leer('nombre'), correo: leer('correo'), texto: leer('texto') }
  const errores: Partial<Record<CamposCarta, string>> = {}

  if (!valores.nombre) {
    errores.nombre = 'Escribe tu nombre: firmamos todas las cartas.'
  } else if (valores.nombre.length > LIMITES.nombre) {
    errores.nombre = `El nombre puede tener como mucho ${LIMITES.nombre} caracteres.`
  }

  if (!CORREO.test(valores.correo)) {
    errores.correo = 'Escribe un correo válido, como nombre@ejemplo.es. No lo publicaremos.'
  }

  if (valores.texto.length < LIMITES.textoMinimo) {
    errores.texto = `La carta tiene que tener al menos ${LIMITES.textoMinimo} caracteres.`
  } else if (valores.texto.length > LIMITES.texto) {
    errores.texto = `La carta puede tener como mucho ${LIMITES.texto} caracteres.`
  }

  return Object.keys(errores).length > 0 ? { ok: false, errores, valores } : { ok: true, carta: valores }
}
