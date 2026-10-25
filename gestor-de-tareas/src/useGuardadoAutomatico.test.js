// Un Hook propio se prueba con renderHook (lección 84): lo monta en un
// componente invisible y deja volver a renderizarlo con otros valores.
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useGuardadoAutomatico } from './useGuardadoAutomatico'

const leerGuardado = () => JSON.parse(localStorage.getItem('gestor-de-tareas:v1'))

const pan = { id: 'a1', texto: 'Comprar pan', completada: false, creadaEn: '2026-10-20T09:00:00.000Z' }
const dni = { id: 'b2', texto: 'Renovar el DNI', completada: false, creadaEn: '2026-10-21T18:30:00.000Z' }

describe('useGuardadoAutomatico', () => {
  it('guarda las tareas al montar', () => {
    renderHook(() => useGuardadoAutomatico([pan]))

    expect(leerGuardado()).toEqual([pan])
  })

  it('vuelve a guardar cuando cambian las tareas', () => {
    const { rerender } = renderHook(({ tareas }) => useGuardadoAutomatico(tareas), {
      initialProps: { tareas: [pan] },
    })

    rerender({ tareas: [pan, dni] })

    expect(leerGuardado()).toEqual([pan, dni])
  })

  it('no vuelve a guardar si se renderiza con la misma lista', () => {
    const tareas = [pan]
    const { rerender } = renderHook(({ lista }) => useGuardadoAutomatico(lista), {
      initialProps: { lista: tareas },
    })
    // Alguien escribe en localStorage por su cuenta después del primer guardado...
    localStorage.setItem('gestor-de-tareas:v1', '"tocado"')

    rerender({ lista: tareas })

    // ...y el Hook no lo pisa: la dependencia [tareas] no ha cambiado.
    expect(leerGuardado()).toBe('tocado')
  })
})
