import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { z } from 'zod'
import { camposReserva, esquemaReserva } from '../reserva/esquema'
import { formatearFecha } from '../reserva/fechas'
import { buscarRefugio } from '../reserva/refugios'
import { gastarProximaReserva, leerAjustes } from './ajustes'
import { guardarReserva, nochesDe, otroGrupoSeAdelanta } from './baseDeDatos'

// El servidor simulado: los manejadores de MSW (lección 84). Los mismos
// responden en el navegador con npm run dev (main.tsx) y en Node con los
// tests (pruebas/servidorDePruebas.ts). La aplicación no sabe cuál de los
// dos le contesta, ni que no es un servidor de verdad.

const consultaDisponibilidad = camposReserva.pick({ refugio: true, llegada: true, noches: true })

export const manejadores = [
  // GET /api/disponibilidad?refugio=respomuso&llegada=2026-11-14&noches=2
  http.get('/api/disponibilidad', async ({ request }) => {
    await delay(leerAjustes().latencia)
    const parametros = Object.fromEntries(new URL(request.url).searchParams)
    const consulta = consultaDisponibilidad.safeParse(parametros)
    if (!consulta.success) {
      return HttpResponse.json({ errores: z.flattenError(consulta.error).fieldErrors }, { status: 400 })
    }
    const { refugio, llegada, noches } = consulta.data
    return HttpResponse.json({ noches: nochesDe(refugio, llegada, noches) })
  }),

  // POST /api/reservas con la reserva en JSON
  http.post('/api/reservas', async ({ request }) => {
    // Qué le pasa a esta reserva se decide al llegar, no al contestar
    const proxima = gastarProximaReserva()
    await delay(leerAjustes().latencia)
    if (proxima === 'error-servidor') {
      return HttpResponse.json({ error: 'Error del servidor (simulado)' }, { status: 500 })
    }

    // Paso 2 de la lección: el servidor no se fía de nadie. Vuelve a
    // validar con el mismo esquema que el formulario: lo que llega puede
    // no venir de tu formulario, o venir de una pestaña abierta desde ayer.
    const cuerpo = await request.json().catch(() => null)
    const resultado = esquemaReserva.safeParse(cuerpo)
    if (!resultado.success) {
      return HttpResponse.json({ errores: z.flattenError(resultado.error).fieldErrors }, { status: 422 })
    }
    const datos = resultado.data

    if (proxima === 'sin-plazas') otroGrupoSeAdelanta(datos)

    // Las plazas se comprueban aquí, en el momento de guardar: lo que vio
    // el formulario hace un rato puede haber cambiado.
    const noches = nochesDe(datos.refugio, datos.llegada, datos.noches)
    const corta = noches.find((noche) => noche.libres < datos.personas)
    if (corta) {
      const refugio = buscarRefugio(datos.refugio)!
      const quedan =
        corta.libres === 0
          ? 'no queda ninguna plaza'
          : corta.libres === 1
            ? 'solo queda 1 plaza'
            : `solo quedan ${corta.libres} plazas`
      return HttpResponse.json(
        {
          error: `Mientras confirmabas, otra reserva se ha adelantado: en el ${refugio.nombre} ${quedan} la noche del ${formatearFecha(corta.fecha)}, y sois ${datos.personas}.`,
          noches,
        },
        { status: 409 },
      )
    }

    const reserva = guardarReserva(datos)
    return HttpResponse.json(
      { reserva, noches: nochesDe(datos.refugio, datos.llegada, datos.noches) },
      { status: 201 },
    )
  }),
]
