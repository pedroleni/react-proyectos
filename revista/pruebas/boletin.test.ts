import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { leerSuscripciones } from '~/datos/boletin.server'
import rutas from '~/routes'
import { action } from '~/routes/boletin'
import { argumentos, envio } from './peticion'

type Args = Parameters<typeof action>[0]

// Cada test guarda los correos en un archivo propio, en una carpeta temporal.
let carpeta: string
beforeEach(async () => {
  carpeta = await mkdtemp(path.join(tmpdir(), 'boletin-'))
  process.env.ARCHIVO_BOLETIN = path.join(carpeta, 'boletin.json')
})
afterEach(async () => {
  delete process.env.ARCHIVO_BOLETIN
  await rm(carpeta, { recursive: true, force: true })
})

describe('Paso 7: el boletín, sin cambiar de página', () => {
  it('la action del boletín está en /boletin', () => {
    expect(rutas).toContainEqual(expect.objectContaining({ path: 'boletin', file: 'routes/boletin.tsx' }))
  })

  it('un correo mal escrito responde 400, con su error, y no se apunta', async () => {
    const respuesta = await action(argumentos<Args>('/boletin', {}, envio({ correo: 'ana@correo' })))
    expect(respuesta).toMatchObject({
      init: { status: 400 },
      data: { ok: false, error: 'Escribe un correo válido, como nombre@ejemplo.es.', correo: 'ana@correo' },
    })
    expect(await leerSuscripciones()).toEqual([])
  })

  it('un correo válido se apunta una sola vez, y la action responde con datos, sin redirigir', async () => {
    const respuesta = await action(argumentos<Args>('/boletin', {}, envio({ correo: '  ana@correo.es ' })))
    expect(respuesta).toEqual({ ok: true, correo: 'ana@correo.es' })

    await action(argumentos<Args>('/boletin', {}, envio({ correo: 'ana@correo.es' })))
    expect(await leerSuscripciones()).toEqual(['ana@correo.es'])
  })
})
