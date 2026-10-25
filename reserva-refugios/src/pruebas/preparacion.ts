import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest'
import { cambiarAjustes } from '../servidor/ajustes'
import { reiniciarBaseDeDatos } from '../servidor/baseDeDatos'
import { servidor } from './servidorDePruebas'

// Una petición sin manejador es un error: nada sale a internet.
beforeAll(() => servidor.listen({ onUnhandledFrame: 'error' }))

beforeEach(() => {
  // Hoy es siempre el lunes 2 de noviembre de 2026. Solo se falsea la
  // fecha: los temporizadores siguen siendo de verdad, y user-event y las
  // esperas de MSW funcionan como siempre (lección 84).
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-02T10:00:00'))
  // Cada test empieza con el servidor recién arrancado y sin esperas
  reiniciarBaseDeDatos()
  cambiarAjustes({ latencia: 0, proximaReserva: 'normal' })
})

afterEach(() => {
  servidor.resetHandlers()
  vi.useRealTimers()
})

afterAll(() => servidor.close())
