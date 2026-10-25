export const IDIOMAS = [
  'Alemán',
  'Árabe',
  'Catalán',
  'Chino mandarín',
  'Coreano',
  'Español para extranjeros',
  'Euskera',
  'Francés',
  'Gallego',
  'Griego',
  'Inglés',
  'Italiano',
  'Japonés',
  'Neerlandés',
  'Polaco',
  'Portugués',
  'Ruso',
  'Sueco',
  'Turco',
  'Ucraniano',
]

export type Grupo = {
  id: string
  nivel: string
  horario: string
  plazas: number
}

export type Modalidad = {
  id: string
  titulo: string
  descripcion: string
  grupos: Grupo[]
}

export const MODALIDADES: Modalidad[] = [
  {
    id: 'intensivo',
    titulo: 'Intensivo',
    descripcion: 'De lunes a jueves, dos horas al día. Un nivel por trimestre.',
    grupos: [
      { id: 'intensivo-a1', nivel: 'A1', horario: 'De lunes a jueves, de 9:00 a 11:00', plazas: 4 },
      { id: 'intensivo-b1', nivel: 'B1', horario: 'De lunes a jueves, de 11:30 a 13:30', plazas: 7 },
    ],
  },
  {
    id: 'extensivo',
    titulo: 'Extensivo',
    descripcion: 'Dos tardes por semana, de octubre a junio.',
    grupos: [
      { id: 'extensivo-a2', nivel: 'A2', horario: 'Lunes y miércoles, de 18:00 a 19:30', plazas: 6 },
      { id: 'extensivo-b2', nivel: 'B2', horario: 'Martes y jueves, de 19:30 a 21:00', plazas: 2 },
      { id: 'extensivo-c1', nivel: 'C1', horario: 'Viernes, de 17:00 a 20:00', plazas: 9 },
    ],
  },
  {
    id: 'en-linea',
    titulo: 'En línea',
    descripcion: 'Clases en directo por videollamada; cada grabación se queda disponible una semana.',
    grupos: [
      { id: 'en-linea-a1', nivel: 'A1', horario: 'Martes y jueves, de 20:00 a 21:30', plazas: 12 },
      { id: 'en-linea-b1', nivel: 'B1', horario: 'Sábados, de 10:00 a 13:00', plazas: 5 },
    ],
  },
]
