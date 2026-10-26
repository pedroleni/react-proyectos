// Los correos del boletín. Como los de las cartas, no salen nunca del servidor.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { CORREO } from './cartas.server'

/** El archivo donde se guardan. Los tests usan otro, con la variable de entorno. */
function archivo(): string {
  return process.env.ARCHIVO_BOLETIN ?? path.resolve('datos', 'boletin.json')
}

/** Los correos apuntados, en el orden en que llegaron. */
export async function leerSuscripciones(): Promise<string[]> {
  try {
    return JSON.parse(await readFile(archivo(), 'utf8')) as string[]
  } catch (error) {
    // Hasta que se apunta el primero, no hay archivo.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

/** Apunta un correo ya validado. Si ya estaba, no lo repite. */
export async function apuntarAlBoletin(correo: string): Promise<void> {
  const correos = await leerSuscripciones()
  if (correos.includes(correo)) return
  await mkdir(path.dirname(archivo()), { recursive: true })
  await writeFile(archivo(), JSON.stringify([...correos, correo], null, 2))
}

export type ResultadoSuscripcion = { ok: true; correo: string } | { ok: false; error: string; correo: string }

/** Comprueba el correo que llega del formulario, sin espacios a los lados. */
export function validarSuscripcion(formData: FormData): ResultadoSuscripcion {
  const valor = formData.get('correo')
  const correo = typeof valor === 'string' ? valor.trim() : ''
  if (!CORREO.test(correo)) {
    return { ok: false, error: 'Escribe un correo válido, como nombre@ejemplo.es.', correo }
  }
  return { ok: true, correo }
}
