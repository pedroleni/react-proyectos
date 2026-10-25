import { describe, expect, it } from 'vitest'
import { cambiarAjustes } from '../servidor/ajustes'
import { contarReservas, fijarOcupadas } from '../servidor/baseDeDatos'

// El servidor simulado, probado como lo usaría cualquiera: con fetch. Sin
// React de por medio. Respomuso tiene 60 plazas (inventadas).

const reserva = {
  refugio: 'respomuso',
  llegada: '2026-11-14',
  noches: 2,
  personas: 4,
  nombre: 'Lucía Ferrer',
  correo: 'lucia@ejemplo.es',
  telefono: '612345678',
  federados: 1,
  observaciones: '',
  acepto: 'on',
}

function reservar(cuerpo: unknown) {
  return fetch('/api/reservas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  })
}

describe('GET /api/disponibilidad', () => {
  it('da las plazas libres de cada noche de la estancia', async () => {
    fijarOcupadas('respomuso', '2026-11-14', 50)
    fijarOcupadas('respomuso', '2026-11-15', 20)

    const respuesta = await fetch('/api/disponibilidad?refugio=respomuso&llegada=2026-11-14&noches=2')

    expect(respuesta.status).toBe(200)
    expect(await respuesta.json()).toEqual({
      noches: [
        { fecha: '2026-11-14', plazas: 60, libres: 10 },
        { fecha: '2026-11-15', plazas: 60, libres: 40 },
      ],
    })
  })

  it('responde 400 si el refugio no existe', async () => {
    const respuesta = await fetch('/api/disponibilidad?refugio=goriz&llegada=2026-11-14&noches=1')

    expect(respuesta.status).toBe(400)
    expect(await respuesta.json()).toEqual({ errores: { refugio: ['Elige un refugio.'] } })
  })
})

describe('POST /api/reservas', () => {
  it('guarda una reserva válida, le pone localizador y ocupa sus plazas', async () => {
    fijarOcupadas('respomuso', '2026-11-14', 50)
    fijarOcupadas('respomuso', '2026-11-15', 20)

    const respuesta = await reservar(reserva)

    expect(respuesta.status).toBe(201)
    const cuerpo = await respuesta.json()
    // 1 federado a 12 € y 3 personas a 22 €, dos noches
    expect(cuerpo.reserva).toMatchObject({ localizador: 'RES-1001', importe: 156 })
    expect(cuerpo.noches).toEqual([
      { fecha: '2026-11-14', plazas: 60, libres: 6 },
      { fecha: '2026-11-15', plazas: 60, libres: 36 },
    ])
    expect(contarReservas()).toBe(1)
  })

  it('valida con el mismo esquema que el formulario y responde 422', async () => {
    const respuesta = await reservar({ ...reserva, correo: 'lucia@', federados: 6 })

    expect(respuesta.status).toBe(422)
    expect(await respuesta.json()).toEqual({
      errores: {
        correo: ['Ese correo no parece válido.'],
        federados: ['No puede haber más federados que personas en el grupo.'],
      },
    })
    expect(contarReservas()).toBe(0)
  })

  it('responde 409 si no quedan plazas, con las que quedan de verdad', async () => {
    fijarOcupadas('respomuso', '2026-11-15', 58)

    const respuesta = await reservar(reserva)

    expect(respuesta.status).toBe(409)
    const cuerpo = await respuesta.json()
    expect(cuerpo.error).toBe(
      'Mientras confirmabas, otra reserva se ha adelantado: en el Refugio de Respomuso solo quedan 2 plazas la noche del domingo 15 de noviembre, y sois 4.',
    )
    expect(cuerpo.noches[1]).toEqual({ fecha: '2026-11-15', plazas: 60, libres: 2 })
    expect(contarReservas()).toBe(0)
  })

  it('con «Falla el servidor», la siguiente reserva da 500 y la de después ya no', async () => {
    cambiarAjustes({ proximaReserva: 'error-servidor' })

    expect((await reservar(reserva)).status).toBe(500)
    expect((await reservar(reserva)).status).toBe(201)
  })

  it('con «Otro grupo se adelanta», responde 409 aunque hubiera sitio', async () => {
    fijarOcupadas('respomuso', '2026-11-14', 0)
    fijarOcupadas('respomuso', '2026-11-15', 0)
    cambiarAjustes({ proximaReserva: 'sin-plazas' })

    const respuesta = await reservar(reserva)

    expect(respuesta.status).toBe(409)
    // Sois 4: el otro grupo deja 2 plazas en cada noche
    expect((await respuesta.json()).noches.map((noche: { libres: number }) => noche.libres)).toEqual([2, 2])
  })
})
