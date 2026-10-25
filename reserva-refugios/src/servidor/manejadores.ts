import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { z } from 'zod'
import { camposReserva } from '../reserva/esquema'
import { gastarProximaReserva, leerAjustes } from './ajustes'
import { nochesDe } from './baseDeDatos'

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
  http.post('/api/reservas', async () => {
    // Qué le pasa a esta reserva se decide al llegar, no al contestar
    const proxima = gastarProximaReserva()
    await delay(leerAjustes().latencia)
    if (proxima === 'error-servidor') {
      return HttpResponse.json({ error: 'Error del servidor (simulado)' }, { status: 500 })
    }

    // TODO (paso 2): el servidor no se fía de nadie.
    // 1. Recibe { request } en el manejador, lee el cuerpo con
    //    request.json() (si no es JSON, que quede en null) y valídalo con
    //    esquemaReserva. Si no pasa: 422 con
    //    { errores: z.flattenError(...).fieldErrors }.
    // 2. Si proxima es 'sin-plazas', llama a otroGrupoSeAdelanta(datos)
    //    (de ./baseDeDatos) antes de mirar las plazas.
    // 3. Con nochesDe(...), busca la primera noche con menos plazas libres
    //    que personas. Si la hay: 409 con { error, noches }. El error dice,
    //    por ejemplo: «Mientras confirmabas, otra reserva se ha adelantado:
    //    en el Refugio de Respomuso solo quedan 2 plazas la noche del domingo
    //    15 de noviembre, y sois 4.» (buscarRefugio y formatearFecha te
    //    dan el nombre y la fecha; cuidado con «1 plaza» y con «ninguna»).
    // 4. Si hay sitio: guardarReserva(datos) y 201 con { reserva, noches },
    //    con las noches ya actualizadas.
    return HttpResponse.json({ error: 'Todavía no se pueden guardar reservas (paso 2)' }, { status: 501 })
  }),
]
