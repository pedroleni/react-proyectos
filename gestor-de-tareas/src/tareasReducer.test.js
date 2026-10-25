// El reductor es una función normal: se prueba llamándola, sin montar
// ningún componente y sin Testing Library.
import { describe, expect, it } from 'vitest'
import { ESTADO_VACIO, filtrarTareas, tareasReducer } from './tareasReducer'

const pan = { id: 'a1', texto: 'Comprar pan', completada: false, creadaEn: '2026-10-20T09:00:00.000Z' }
const dni = { id: 'b2', texto: 'Renovar el DNI', completada: true, creadaEn: '2026-10-21T18:30:00.000Z' }
const conDos = { tareas: [pan, dni], filtro: 'todas' }

describe('tareasReducer', () => {
  it('añade una tarea pendiente al final, con el id y la fecha de la acción', () => {
    const estado = tareasReducer(ESTADO_VACIO, {
      type: 'anadida',
      id: 'c3',
      texto: 'Llamar al fontanero',
      creadaEn: '2026-10-22T10:00:00.000Z',
    })

    expect(estado.tareas).toEqual([
      { id: 'c3', texto: 'Llamar al fontanero', completada: false, creadaEn: '2026-10-22T10:00:00.000Z' },
    ])
  })

  it('recorta los espacios del texto', () => {
    const estado = tareasReducer(ESTADO_VACIO, { type: 'anadida', id: 'c3', texto: '  Regar  ', creadaEn: '' })

    expect(estado.tareas[0].texto).toBe('Regar')
  })

  it('no añade una tarea vacía: devuelve el mismo estado', () => {
    const estado = tareasReducer(conDos, { type: 'anadida', id: 'c3', texto: '   ', creadaEn: '' })

    expect(estado).toBe(conDos)
  })

  it('alterna una tarea sin modificar el estado anterior', () => {
    const estado = tareasReducer(conDos, { type: 'alternada', id: 'a1' })

    expect(estado.tareas[0].completada).toBe(true)
    expect(estado.tareas[1]).toBe(dni)
    // Si el reductor hiciera tarea.completada = !tarea.completada, esta
    // línea fallaría: la tarea del estado anterior habría cambiado.
    expect(pan.completada).toBe(false)
  })

  it('borra la tarea con ese id', () => {
    const estado = tareasReducer(conDos, { type: 'borrada', id: 'a1' })

    expect(estado.tareas).toEqual([dni])
    expect(conDos.tareas).toHaveLength(2)
  })

  it('cambia el filtro y deja las tareas como estaban', () => {
    const estado = tareasReducer(conDos, { type: 'filtro_cambiado', filtro: 'pendientes' })

    expect(estado.filtro).toBe('pendientes')
    expect(estado.tareas).toBe(conDos.tareas)
  })

  it('lanza un error con una acción desconocida', () => {
    expect(() => tareasReducer(conDos, { type: 'añadida' })).toThrow('Acción desconocida: añadida')
  })
})

describe('filtrarTareas', () => {
  it('devuelve las pendientes, las completadas o todas', () => {
    expect(filtrarTareas(conDos.tareas, 'pendientes')).toEqual([pan])
    expect(filtrarTareas(conDos.tareas, 'completadas')).toEqual([dni])
    expect(filtrarTareas(conDos.tareas, 'todas')).toEqual([pan, dni])
  })
})
