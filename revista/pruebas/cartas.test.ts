import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { leerCartas, validarCarta } from '~/datos/cartas.server'
import { action, loader } from '~/routes/articulo'
import { argumentos, envio } from './peticion'

type ArgsAccion = Parameters<typeof action>[0]
type ArgsLoader = Parameters<typeof loader>[0]
const SLUG = 'la-raya-no-es-un-guion'
const CARTA = {
  nombre: 'Ana Lahoz',
  correo: 'ana@correo.es',
  texto: 'Llevo años escribiendo menos con un guion. Desde hoy, con el signo de verdad.',
}

// Cada test guarda las cartas en un archivo propio, en una carpeta temporal.
let carpeta: string
beforeEach(async () => {
  carpeta = await mkdtemp(path.join(tmpdir(), 'cartas-'))
  process.env.ARCHIVO_CARTAS = path.join(carpeta, 'cartas.json')
})
afterEach(async () => {
  delete process.env.ARCHIVO_CARTAS
  await rm(carpeta, { recursive: true, force: true })
})

describe('Paso 5: cartas al director, validadas en el servidor', () => {
  it('el loader del artículo da sus cartas publicadas, sin el correo de quien las escribe', async () => {
    const SLUG_CON_CARTAS = 'caja-alta-y-caja-baja'
    const datos = await loader(argumentos<ArgsLoader>(`/articulos/${SLUG_CON_CARTAS}`, { slug: SLUG_CON_CARTAS }))
    expect(datos.cartas.map((c) => c.nombre)).toEqual(['Pilar Gracia', 'Andrés Royo'])
    for (const carta of datos.cartas) expect(carta).not.toHaveProperty('correo')
  })

  it('una carta con errores responde 400, con un mensaje por campo y lo que se escribió', async () => {
    const respuesta = await action(
      argumentos<ArgsAccion>(`/articulos/${SLUG}`, { slug: SLUG }, envio({ nombre: '   ', correo: 'ana@correo', texto: 'Muy bien' })),
    )
    expect(respuesta).toMatchObject({
      init: { status: 400 },
      data: {
        errores: {
          nombre: 'Escribe tu nombre: firmamos todas las cartas.',
          correo: 'Escribe un correo válido, como nombre@ejemplo.es. No lo publicaremos.',
          texto: 'La carta tiene que tener al menos 20 caracteres.',
        },
        valores: { nombre: '', correo: 'ana@correo', texto: 'Muy bien' },
      },
    })
    expect(await leerCartas(SLUG)).toEqual([])
  })

  it('una carta válida se guarda y redirige al artículo, con ?carta= y el ancla de las cartas', async () => {
    const respuesta = await action(argumentos<ArgsAccion>(`/articulos/${SLUG}`, { slug: SLUG }, envio(CARTA)))
    expect(respuesta).toBeInstanceOf(Response)
    const redireccion = respuesta as Response
    expect(redireccion.status).toBe(302)

    const [guardada] = await leerCartas(SLUG)
    expect(guardada).toMatchObject({ nombre: 'Ana Lahoz', texto: CARTA.texto })
    expect(redireccion.headers.get('Location')).toBe(`/articulos/${SLUG}?carta=${guardada.id}#cartas`)
  })

  it('una carta para un artículo que no existe responde 404, aunque sea válida', async () => {
    await expect(
      action(argumentos<ArgsAccion>('/articulos/no-existe', { slug: 'no-existe' }, envio(CARTA))),
    ).rejects.toMatchObject({ init: { status: 404 } })
  })

  it('validarCarta no se fía del HTML: los espacios no cuentan y los límites se comprueban', () => {
    const datos = new FormData()
    datos.set('nombre', 'x'.repeat(61))
    datos.set('correo', 'ana@correo.es')
    datos.set('texto', ' '.repeat(30))
    const resultado = validarCarta(datos)
    expect(resultado.ok).toBe(false)
    if (!resultado.ok) {
      expect(resultado.errores.nombre).toBe('El nombre puede tener como mucho 60 caracteres.')
      expect(resultado.errores.texto).toBe('La carta tiene que tener al menos 20 caracteres.')
      expect(resultado.errores.correo).toBeUndefined()
    }
  })
})
