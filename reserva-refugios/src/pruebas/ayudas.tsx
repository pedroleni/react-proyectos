import { render, screen } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import App from '../App'

// Lo que repiten casi todos los tests: montar la aplicación y rellenar los
// pasos como lo haría una persona. Hoy es el lunes 2 de noviembre de 2026.

export function montarApp() {
  const usuario = userEvent.setup()
  // Dentro de StrictMode, como en main.tsx (lección 83)
  render(<App />, { reactStrictMode: true })
  return usuario
}

export async function escribir(usuario: UserEvent, etiqueta: string, texto: string) {
  const campo = screen.getByLabelText(etiqueta)
  await usuario.clear(campo)
  if (texto !== '') await usuario.type(campo, texto)
}

type PasoRefugio = { refugio?: RegExp; llegada?: string; noches?: string; personas?: string }

export async function rellenarRefugio(
  usuario: UserEvent,
  { refugio = /Respomuso/, llegada = '2026-11-14', noches = '2', personas = '4' }: PasoRefugio = {},
) {
  await usuario.click(screen.getByRole('radio', { name: refugio }))
  await escribir(usuario, 'Llegada', llegada)
  await usuario.selectOptions(screen.getByLabelText('Noches'), noches)
  await escribir(usuario, 'Personas', personas)
  await usuario.click(screen.getByRole('button', { name: 'Ver plazas y seguir' }))
}

type PasoGrupo = { nombre?: string; correo?: string; telefono?: string; federados?: string }

export async function rellenarGrupo(
  usuario: UserEvent,
  { nombre = 'Lucía Ferrer', correo = 'lucia@ejemplo.es', telefono = '612345678', federados = '1' }: PasoGrupo = {},
) {
  await screen.findByRole('heading', { name: 'Paso 2 de 3: Quién viene' })
  await escribir(usuario, 'Nombre y apellidos', nombre)
  await escribir(usuario, 'Correo electrónico', correo)
  await escribir(usuario, 'Teléfono móvil', telefono)
  await escribir(usuario, 'Personas con licencia federativa de montaña', federados)
  await usuario.click(screen.getByRole('button', { name: 'Seguir' }))
}

/** Del principio al paso 3, con los datos de ejemplo. */
export async function llegarAConfirmar(usuario: UserEvent) {
  await rellenarRefugio(usuario)
  await rellenarGrupo(usuario)
  await screen.findByRole('heading', { name: 'Paso 3 de 3: Revisar y confirmar' })
}
