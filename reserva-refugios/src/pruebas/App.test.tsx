import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { cambiarAjustes } from '../servidor/ajustes'
import { contarReservas, fijarOcupadas } from '../servidor/baseDeDatos'
import { escribir, llegarAConfirmar, montarApp, rellenarGrupo, rellenarRefugio } from './ayudas'

// Respomuso tiene 60 plazas (inventadas). En los tests, la noche del sábado
// 14 de noviembre quedan 10 libres y la del domingo 15, 40.
function plazasDeEjemplo() {
  fijarOcupadas('respomuso', '2026-11-14', 50)
  fijarOcupadas('respomuso', '2026-11-15', 20)
}

describe('paso 1: refugio y fechas', () => {
  it('empieza en el paso 1, marcado en la lista de pasos, sin mover el foco', () => {
    montarApp()

    expect(screen.getByRole('heading', { name: 'Paso 1 de 3: Refugio y fechas' })).toBeInTheDocument()
    const pasos = within(screen.getByRole('list', { name: 'Pasos de la reserva' })).getAllByRole('listitem')
    expect(pasos[0]).toHaveAttribute('aria-current', 'step')
    expect(pasos[1]).not.toHaveAttribute('aria-current')
    expect(document.title).toBe('Paso 1 de 3: Refugio y fechas · Reserva de refugios')
    expect(document.body).toHaveFocus()
  })

  it('sin refugio ni fecha, lo dice en cada campo y lleva el foco al primero', async () => {
    const usuario = montarApp()

    await usuario.click(screen.getByRole('button', { name: 'Ver plazas y seguir' }))

    expect(await screen.findByText('Hay 2 campos por corregir.')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Respomuso/ })).toHaveFocus()
    expect(screen.getByRole('group', { name: 'Refugio' })).toHaveAccessibleDescription('Elige un refugio.')
    expect(screen.getByLabelText('Llegada')).toHaveAccessibleDescription(
      'Desde mañana y hasta 90 días vista. Elige el día de llegada.',
    )
    expect(screen.getByLabelText('Llegada')).toBeInvalid()
  })

  it('después de un error conserva lo elegido, también en el desplegable', async () => {
    const usuario = montarApp()

    await rellenarRefugio(usuario, { refugio: /Estós/, noches: '3', personas: '' })

    expect(await screen.findByText('Como mínimo, una persona.')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Estós/ })).toBeChecked()
    expect(screen.getByLabelText('Llegada')).toHaveValue('2026-11-14')
    expect(screen.getByLabelText('Noches')).toHaveValue('3')
    expect(screen.getByLabelText('Personas')).toHaveFocus()
  })

  it('si no hay plazas para todos, lo dice en «Personas»', async () => {
    fijarOcupadas('respomuso', '2026-11-15', 58)
    const usuario = montarApp()

    await rellenarRefugio(usuario)

    expect(await screen.findByText('La noche del domingo 15 de noviembre solo quedan 2 plazas.')).toBeInTheDocument()
    expect(screen.getByLabelText('Personas')).toHaveFocus()
  })

  it('mientras busca plazas, lo anuncia y el botón lo dice', async () => {
    cambiarAjustes({ latencia: 300 })
    const usuario = montarApp()

    await rellenarRefugio(usuario)

    expect(screen.getByRole('status')).toHaveTextContent('Buscando plazas libres…')
    expect(screen.getByRole('button', { name: 'Buscando plazas…' })).toHaveAttribute('aria-disabled', 'true')
    expect(await screen.findByRole('heading', { name: 'Paso 2 de 3: Quién viene' })).toBeInTheDocument()
  })

  it('con plazas, pasa al paso 2, le da el foco a su título y enseña las plazas', async () => {
    plazasDeEjemplo()
    const usuario = montarApp()

    await rellenarRefugio(usuario)

    const titulo = await screen.findByRole('heading', { name: 'Paso 2 de 3: Quién viene' })
    expect(titulo).toHaveFocus()
    expect(document.title).toBe('Paso 2 de 3: Quién viene · Reserva de refugios')
    const tuReserva = screen.getByRole('complementary', { name: 'Tu reserva' })
    expect(within(tuReserva).getByText('Refugio de Respomuso')).toBeInTheDocument()
    expect(within(tuReserva).getByText('10 de 60 libres')).toBeInTheDocument()
    expect(within(tuReserva).getByText('40 de 60 libres')).toBeInTheDocument()
  })
})

describe('paso 2: quién viene', () => {
  it('«Atrás» conserva lo escrito en los dos pasos', async () => {
    const usuario = montarApp()
    await rellenarRefugio(usuario, { refugio: /Pineta/, personas: '3' })
    await screen.findByRole('heading', { name: 'Paso 2 de 3: Quién viene' })
    await escribir(usuario, 'Nombre y apellidos', 'Iñaki Garmendia')

    await usuario.click(screen.getByRole('button', { name: 'Atrás' }))

    expect(await screen.findByRole('heading', { name: 'Paso 1 de 3: Refugio y fechas' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: /Pineta/ })).toBeChecked()
    expect(screen.getByLabelText('Personas')).toHaveValue(3)

    await usuario.click(screen.getByRole('button', { name: 'Ver plazas y seguir' }))

    await screen.findByRole('heading', { name: 'Paso 2 de 3: Quién viene' })
    expect(screen.getByLabelText('Nombre y apellidos')).toHaveValue('Iñaki Garmendia')
  })

  it('compara los federados con las personas que se eligieron en el paso 1', async () => {
    const usuario = montarApp()
    await rellenarRefugio(usuario, { personas: '2' })

    await rellenarGrupo(usuario, { federados: '3' })

    expect(await screen.findByText('No puede haber más federados que personas en el grupo.')).toBeInTheDocument()
    expect(screen.getByLabelText('Personas con licencia federativa de montaña')).toHaveFocus()
  })

  it('Intro en un campo sigue adelante, no vuelve atrás', async () => {
    const usuario = montarApp()
    await rellenarRefugio(usuario)
    await screen.findByRole('heading', { name: 'Paso 2 de 3: Quién viene' })
    await escribir(usuario, 'Nombre y apellidos', 'Lucía Ferrer')
    await escribir(usuario, 'Correo electrónico', 'lucia@ejemplo.es')
    await escribir(usuario, 'Personas con licencia federativa de montaña', '0')

    await usuario.type(screen.getByLabelText('Teléfono móvil'), '612345678{Enter}')

    expect(await screen.findByRole('heading', { name: 'Paso 3 de 3: Revisar y confirmar' })).toBeInTheDocument()
  })
})

describe('paso 3: confirmar', () => {
  it('sin aceptar las normas, no retiene plazas ni llama al servidor', async () => {
    plazasDeEjemplo()
    const usuario = montarApp()
    await llegarAConfirmar(usuario)

    await usuario.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    expect(await screen.findByText('Para reservar, tienes que aceptar las normas del refugio.')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'He leído y acepto las normas del refugio' })).toHaveFocus()
    expect(screen.getByText('10 de 60 libres')).toBeInTheDocument()
    expect(contarReservas()).toBe(0)
  })

  it('retiene las plazas mientras confirma y después enseña el localizador', async () => {
    plazasDeEjemplo()
    cambiarAjustes({ latencia: 300 })
    const usuario = montarApp()
    await llegarAConfirmar(usuario)
    await usuario.click(screen.getByRole('checkbox', { name: 'He leído y acepto las normas del refugio' }))

    await usuario.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    // Al instante, antes de que conteste el servidor
    expect(screen.getByText('6 de 60 libres · 4 retenidas para ti')).toBeInTheDocument()
    expect(screen.getByText('36 de 60 libres · 4 retenidas para ti')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Plazas retenidas. Confirmando tu reserva…')

    expect(await screen.findByRole('heading', { name: 'Reserva confirmada' })).toHaveFocus()
    expect(screen.getByText('RES-1001')).toBeInTheDocument()
    // Las plazas, ahora sí, las de verdad
    expect(screen.getByText('6 de 60 libres')).toBeInTheDocument()
    expect(screen.queryByText(/retenidas para ti/)).not.toBeInTheDocument()
  })

  it('si el servidor falla, las plazas retenidas vuelven solas', async () => {
    plazasDeEjemplo()
    cambiarAjustes({ latencia: 300, proximaReserva: 'error-servidor' })
    const usuario = montarApp()
    await llegarAConfirmar(usuario)
    await usuario.click(screen.getByRole('checkbox', { name: 'He leído y acepto las normas del refugio' }))

    await usuario.click(screen.getByRole('button', { name: 'Confirmar reserva' }))
    expect(screen.getByText('6 de 60 libres · 4 retenidas para ti')).toBeInTheDocument()

    expect(await screen.findByText(/No se ha podido confirmar la reserva/)).toBeInTheDocument()
    expect(screen.getByText('10 de 60 libres')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveFocus()
    // La casilla sigue marcada: para reintentar basta con volver a pulsar
    expect(screen.getByRole('checkbox', { name: 'He leído y acepto las normas del refugio' })).toBeChecked()
  })

  it('si desmarcas la casilla después de un fallo, ya no reserva', async () => {
    plazasDeEjemplo()
    cambiarAjustes({ proximaReserva: 'error-servidor' })
    const usuario = montarApp()
    await llegarAConfirmar(usuario)
    await usuario.click(screen.getByRole('checkbox', { name: 'He leído y acepto las normas del refugio' }))
    await usuario.click(screen.getByRole('button', { name: 'Confirmar reserva' }))
    await screen.findByText(/No se ha podido confirmar la reserva/)

    // La casilla vuelve marcada (su valor inicial es lo que se envió). Desmárcala:
    await usuario.click(screen.getByRole('checkbox', { name: 'He leído y acepto las normas del refugio' }))
    await usuario.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    expect(await screen.findByText('Para reservar, tienes que aceptar las normas del refugio.')).toBeInTheDocument()
    expect(contarReservas()).toBe(0)
  })

  it('si otro grupo se adelanta, enseña las plazas que quedan de verdad', async () => {
    plazasDeEjemplo()
    cambiarAjustes({ proximaReserva: 'sin-plazas' })
    const usuario = montarApp()
    await llegarAConfirmar(usuario)
    await usuario.click(screen.getByRole('checkbox', { name: 'He leído y acepto las normas del refugio' }))

    await usuario.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    expect(await screen.findByText(/Mientras confirmabas, otra reserva se ha adelantado/)).toBeInTheDocument()
    // Ni las 10 y 40 de antes ni las optimistas: las 2 que quedan de verdad
    expect(screen.getAllByText('2 de 60 libres')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Paso 3 de 3: Revisar y confirmar' })).toBeInTheDocument()
    expect(contarReservas()).toBe(0)
  })

  it('«Hacer otra reserva» vuelve al principio', async () => {
    plazasDeEjemplo()
    const usuario = montarApp()
    await llegarAConfirmar(usuario)
    await usuario.click(screen.getByRole('checkbox', { name: 'He leído y acepto las normas del refugio' }))
    await usuario.click(screen.getByRole('button', { name: 'Confirmar reserva' }))
    await screen.findByRole('heading', { name: 'Reserva confirmada' })

    await usuario.click(screen.getByRole('button', { name: 'Hacer otra reserva' }))

    expect(await screen.findByRole('heading', { name: 'Paso 1 de 3: Refugio y fechas' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Refugio de Respomuso' })).not.toBeChecked()
    expect(screen.queryByRole('complementary', { name: 'Tu reserva' })).not.toBeInTheDocument()
  })
})
