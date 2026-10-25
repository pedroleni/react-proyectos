import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { esquemaConfirmacion, esquemaPasoGrupo, esquemaPasoRefugio, esquemaReserva } from '../reserva/esquema'

// Hoy es el lunes 2 de noviembre de 2026 (pruebas/preparacion.ts).

/** Una reserva completa y válida, tal como llega de los formularios: todo texto. */
const valida = {
  refugio: 'respomuso',
  llegada: '2026-11-14',
  noches: '2',
  personas: '4',
  nombre: '  Lucía Ferrer ',
  correo: 'lucia@ejemplo.es',
  telefono: '612345678',
  federados: '1',
  observaciones: '',
  acepto: 'on',
}

/** Los mensajes de cada campo, como los recibe el formulario (lección 61). */
function errores(resultado: { error?: z.ZodError }): Record<string, string[] | undefined> {
  return resultado.error ? z.flattenError(resultado.error).fieldErrors : {}
}

describe('el esquema de la reserva', () => {
  it('acepta una reserva válida y devuelve los datos limpios', () => {
    const resultado = esquemaReserva.safeParse(valida)

    expect(resultado.success).toBe(true)
    expect(resultado.data).toEqual({
      ...valida,
      nombre: 'Lucía Ferrer',
      noches: 2,
      personas: 4,
      federados: 1,
    })
  })

  it('el paso 1 solo mira sus cuatro campos', () => {
    const resultado = esquemaPasoRefugio.safeParse({ refugio: 'estos', llegada: '2026-11-03', noches: '1', personas: '2' })

    expect(resultado.data).toEqual({ refugio: 'estos', llegada: '2026-11-03', noches: 1, personas: 2 })
  })

  it('el paso 1 explica cada campo vacío con su mensaje', () => {
    const resultado = esquemaPasoRefugio.safeParse({ llegada: '', noches: '1', personas: '' })

    expect(errores(resultado)).toEqual({
      refugio: ['Elige un refugio.'],
      llegada: ['Elige el día de llegada.'],
      personas: ['Como mínimo, una persona.'],
    })
  })

  it('no deja llegar hoy ni más allá de 90 días', () => {
    const hoy = esquemaPasoRefugio.safeParse({ ...valida, llegada: '2026-11-02' })
    const ultimoDia = esquemaPasoRefugio.safeParse({ ...valida, llegada: '2027-01-31' })
    const tarde = esquemaPasoRefugio.safeParse({ ...valida, llegada: '2027-02-01' })

    expect(errores(hoy).llegada).toEqual(['Se reserva desde mañana y hasta 90 días vista.'])
    expect(ultimoDia.success).toBe(true)
    expect(errores(tarde).llegada).toEqual(['Se reserva desde mañana y hasta 90 días vista.'])
  })

  it('pone límites a las noches y a las personas', () => {
    const resultado = esquemaPasoRefugio.safeParse({ ...valida, noches: '4', personas: '13' })

    expect(errores(resultado)).toEqual({
      noches: ['Como máximo, tres noches seguidas.'],
      personas: ['Para más de 12 personas, llama al refugio.'],
    })
  })

  it('el paso 2 comprueba el contacto', () => {
    const resultado = esquemaPasoGrupo.safeParse({ ...valida, nombre: ' L ', correo: 'lucia@', telefono: '612 34 56 78' })

    expect(errores(resultado)).toEqual({
      nombre: ['Escribe el nombre de quien hace la reserva.'],
      correo: ['Ese correo no parece válido.'],
      telefono: ['Nueve cifras, sin prefijo ni espacios.'],
    })
  })

  it('no puede haber más federados que personas, aunque se elijan en pasos distintos', () => {
    const resultado = esquemaPasoGrupo.safeParse({ ...valida, personas: '2', federados: '3' })

    expect(errores(resultado)).toEqual({
      federados: ['No puede haber más federados que personas en el grupo.'],
    })
  })

  it('la casilla de las normas tiene que estar marcada', () => {
    // Una casilla sin marcar no viaja en el FormData: llega como undefined
    const resultado = esquemaConfirmacion.safeParse({ acepto: undefined })

    expect(errores(resultado)).toEqual({ acepto: ['Para reservar, tienes que aceptar las normas del refugio.'] })
  })

  it('la reserva entera aplica también la regla de los federados', () => {
    const resultado = esquemaReserva.safeParse({ ...valida, federados: '5' })

    expect(errores(resultado)).toEqual({
      federados: ['No puede haber más federados que personas en el grupo.'],
    })
  })
})
