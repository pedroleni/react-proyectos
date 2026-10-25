// Los hooks de TareasContext.js, probados con renderHook y la opción
// wrapper (lección 84): el Hook se monta dentro de <ProveedorTareas>, como
// en la aplicación, pero sin pintar ningún componente.
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProveedorTareas } from './ProveedorTareas'
import { useFiltro, useTareas, useTareasDispatch, useTareasVisibles } from './TareasContext'

// Un Hook de mentira que junta los cuatro, para leerlos de una vez.
function useTodo() {
  return {
    tareas: useTareas(),
    filtro: useFiltro(),
    visibles: useTareasVisibles(),
    dispatch: useTareasDispatch(),
  }
}

describe('hooks de las tareas', () => {
  it('fuera de <ProveedorTareas> lanzan un error que dice qué falta', () => {
    // React escribe el error en la consola antes de lanzarlo: se silencia.
    const consola = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderHook(() => useTareas())).toThrow('dentro de <ProveedorTareas>')
    expect(() => renderHook(() => useTareasDispatch())).toThrow('dentro de <ProveedorTareas>')

    consola.mockRestore()
  })

  it('dentro del proveedor leen el estado, y dispatch lo cambia', () => {
    const { result } = renderHook(() => useTodo(), { wrapper: ProveedorTareas })
    expect(result.current.tareas).toEqual([])
    expect(result.current.filtro).toBe('todas')

    act(() => {
      result.current.dispatch({ type: 'anadida', id: 'a1', texto: 'Comprar pan', creadaEn: '2026-10-20T09:00:00.000Z' })
    })
    act(() => {
      result.current.dispatch({ type: 'filtro_cambiado', filtro: 'completadas' })
    })

    expect(result.current.tareas).toHaveLength(1)
    expect(result.current.filtro).toBe('completadas')
    expect(result.current.visibles).toEqual([])
  })

  it('dispatch es siempre la misma función', () => {
    const { result } = renderHook(() => useTodo(), { wrapper: ProveedorTareas })
    const primero = result.current.dispatch

    act(() => {
      result.current.dispatch({ type: 'filtro_cambiado', filtro: 'pendientes' })
    })

    expect(result.current.dispatch).toBe(primero)
  })
})
