import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { buscarArticulo, listarArticulos } from '~/datos/articulos.server'
import { guardarCarta, leerCartas } from '~/datos/cartas.server'

// La capa de datos ya está hecha: estos tests pasan desde el principio.
describe('Los datos de la revista', () => {
  it('listarArticulos da los seis resúmenes, y buscarArticulo, un artículo entero o nada', () => {
    expect(listarArticulos()).toHaveLength(6)
    expect(buscarArticulo('la-raya-no-es-un-guion')?.cuerpo.length).toBeGreaterThan(0)
    expect(buscarArticulo('no-existe')).toBeUndefined()
  })

  it('guardarCarta guarda el correo, pero leerCartas no lo devuelve', async () => {
    const carpeta = await mkdtemp(path.join(tmpdir(), 'cartas-'))
    process.env.ARCHIVO_CARTAS = path.join(carpeta, 'cartas.json')
    try {
      await guardarCarta('la-raya-no-es-un-guion', {
        nombre: 'Ana Lahoz',
        correo: 'ana@correo.es',
        texto: 'Una carta de prueba para la capa de datos.',
      })
      const [carta] = await leerCartas('la-raya-no-es-un-guion')
      expect(carta).toMatchObject({ nombre: 'Ana Lahoz', texto: 'Una carta de prueba para la capa de datos.' })
      expect(carta).not.toHaveProperty('correo')
    } finally {
      delete process.env.ARCHIVO_CARTAS
      await rm(carpeta, { recursive: true, force: true })
    }
  })
})
