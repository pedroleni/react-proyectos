export type Categoria = 'Costa' | 'Montaña' | 'Pueblo'

export interface Foto {
  id: string
  titulo: string
  autoria: string
  lugar: string
  fecha: string
  categoria: Categoria
  descripcion: string
  /** Velocidad, diafragma, ISO y focal */
  tecnica: string
  /** Tamaño del archivo en píxeles (public/fotos/<id>.jpg) */
  ancho: number
  alto: number
  /** Texto alternativo: lo que se ve en la foto */
  alt: string
  /** Los tonos de la foto: un degradado con ellos ocupa su hueco mientras carga. */
  colores: [string, string, string]
}

export const FOTOS: Foto[] = [
  {
    id: 'bufones-de-pria',
    titulo: 'Los bufones de Pría en temporal',
    autoria: 'Marta Iglesias',
    lugar: 'Llanes',
    fecha: '2025-12-14',
    categoria: 'Costa',
    descripcion:
      'Con mar de fondo del noroeste, el agua entra por las galerías de la roca y sale por arriba con un bramido. Marta esperó dos horas a que coincidieran la ola y el claro.',
    tecnica: '1/1000 s · f/8 · ISO 400 · 70 mm',
    ancho: 1400,
    alto: 934,
    alt: 'Chorros de agua blanca salen disparados hacia el cielo entre las grietas de un acantilado, bajo nubes de tormenta.',
    colores: ['#0b2433', '#2f6f86', '#d9eef2'],
  },
  {
    id: 'urriellu-entre-nubes',
    titulo: 'El Urriellu entre nubes',
    autoria: 'Xuan Álvarez',
    lugar: 'Picos de Europa',
    fecha: '2026-01-03',
    categoria: 'Montaña',
    descripcion:
      'La pared oeste del Naranjo de Bulnes asoma un momento por encima del mar de nubes. Diez minutos después ya no se veía nada.',
    tecnica: '1/500 s · f/11 · ISO 200 · 135 mm',
    ancho: 934,
    alto: 1400,
    alt: 'Un pico de roca caliza, vertical y anaranjado, sobresale de un mar de nubes blancas.',
    colores: ['#1d2a2c', '#6c7f86', '#f1efe9'],
  },
  {
    id: 'cudillero-desde-el-muelle',
    titulo: 'Cudillero desde el muelle',
    autoria: 'Lucía Menéndez',
    lugar: 'Cudillero',
    fecha: '2025-11-22',
    categoria: 'Pueblo',
    descripcion:
      'Las casas de colores bajan por la ladera hasta el puerto. La foto está hecha a última hora, cuando se encienden las primeras ventanas.',
    tecnica: '1/60 s · f/5,6 · ISO 800 · 35 mm',
    ancho: 1400,
    alto: 934,
    alt: 'Casas de fachadas de colores apiladas en una ladera empinada que baja hasta un pequeño puerto con barcas.',
    colores: ['#3a2318', '#c4703f', '#f6d9a8'],
  },
  {
    id: 'faro-de-penas',
    titulo: 'El faro de Peñas al anochecer',
    autoria: 'Rubén Fernández',
    lugar: 'Gozón',
    fecha: '2026-02-08',
    categoria: 'Costa',
    descripcion:
      'El cabo más al norte de Asturias, con el haz del faro recién encendido. Una exposición de veinte segundos alisa el mar.',
    tecnica: '20 s · f/11 · ISO 100 · 16 mm',
    ancho: 1400,
    alto: 934,
    alt: 'Un faro blanco sobre un cabo de acantilados, con el cielo morado y naranja del anochecer y el mar liso como niebla.',
    colores: ['#141a33', '#5b4b8a', '#f2b36d'],
  },
  {
    id: 'ercina-nevado',
    titulo: 'Primera nevada en el lago Ercina',
    autoria: 'Covadonga Suárez',
    lugar: 'Covadonga',
    fecha: '2025-11-30',
    categoria: 'Montaña',
    descripcion:
      'La nieve llegó de noche y a primera hora el lago aún estaba quieto. Las vacas bajaron al valle una semana antes.',
    tecnica: '1/250 s · f/8 · ISO 100 · 24 mm',
    ancho: 1400,
    alto: 934,
    alt: 'Un lago de montaña en calma con las orillas nevadas y montañas blancas reflejadas en el agua.',
    colores: ['#16262f', '#7e9aa6', '#eef4f6'],
  },
  {
    id: 'horreos-de-espinaredo',
    titulo: 'Hórreos de Espinaredo',
    autoria: 'Iván Prieto',
    lugar: 'Piloña',
    fecha: '2026-01-17',
    categoria: 'Pueblo',
    descripcion:
      'Uno de los pueblos con más hórreos y paneras de Asturias. Iván volvió tres veces hasta tener la luz rasante sobre la madera.',
    tecnica: '1/125 s · f/8 · ISO 200 · 50 mm',
    ancho: 1024,
    alto: 1280,
    alt: 'Varios hórreos de madera oscura sobre pilares de piedra, entre casas de piedra y un camino embarrado.',
    colores: ['#2c2117', '#8a6a3f', '#e8c98f'],
  },
  {
    id: 'playa-del-silencio',
    titulo: 'La playa del Silencio',
    autoria: 'Nerea Llaneza',
    lugar: 'Cudillero',
    fecha: '2025-12-02',
    categoria: 'Costa',
    descripcion:
      'Una cala de cantos rodados cerrada por agujas de roca. En invierno, a mediodía, no había nadie más.',
    tecnica: '1/320 s · f/9 · ISO 100 · 18 mm',
    ancho: 934,
    alto: 1400,
    alt: 'Una cala de piedras redondas rodeada de acantilados verdes, con agujas de roca que salen del agua turquesa.',
    colores: ['#0d2a2a', '#2e7d74', '#b9e3d6'],
  },
  {
    id: 'redes-en-tazones',
    titulo: 'Redes al sol en Tazones',
    autoria: 'Pablo García',
    lugar: 'Villaviciosa',
    fecha: '2026-02-21',
    categoria: 'Pueblo',
    descripcion:
      'Las redes se tienden en el muelle entre marea y marea. El rojo de las boyas fue lo que hizo que Pablo se parase.',
    tecnica: '1/400 s · f/5,6 · ISO 200 · 85 mm',
    ancho: 1024,
    alto: 1280,
    alt: 'Redes de pesca amontonadas en un muelle de piedra, con boyas rojas y casas marineras al fondo.',
    colores: ['#1f2a3a', '#b0503a', '#f0c27a'],
  },
  {
    id: 'garganta-del-cares',
    titulo: 'La garganta del Cares',
    autoria: 'Aitana Rodríguez',
    lugar: 'Cabrales',
    fecha: '2026-01-25',
    categoria: 'Montaña',
    descripcion:
      'El camino va tallado en la roca, muy por encima del río. La persona del centro da la escala: sin ella, nadie se cree la altura.',
    tecnica: '1/200 s · f/10 · ISO 200 · 24 mm',
    ancho: 934,
    alto: 1400,
    alt: 'Un sendero estrecho excavado en una pared de roca vertical, con un caminante pequeño y el río muy abajo.',
    colores: ['#1b2420', '#4f6b4a', '#d8dcc6'],
  },
  {
    id: 'ola-en-san-lorenzo',
    titulo: 'Ola en San Lorenzo',
    autoria: 'Marta Iglesias',
    lugar: 'Gijón',
    fecha: '2026-03-04',
    categoria: 'Costa',
    descripcion:
      'Pleamar con marejada: las olas rompen contra el muro del paseo y salpican a quien se asoma. Hecha desde la escalera 4.',
    tecnica: '1/1600 s · f/6,3 · ISO 400 · 200 mm',
    ancho: 1400,
    alto: 934,
    alt: 'Una ola rompe contra el muro de un paseo marítimo y lanza espuma por encima de la barandilla.',
    colores: ['#0a1e2e', '#1f5f7a', '#9fd3e0'],
  },
  {
    id: 'mercado-de-cangas',
    titulo: 'Domingo de mercado en Cangas de Onís',
    autoria: 'Lucía Menéndez',
    lugar: 'Cangas de Onís',
    fecha: '2026-02-15',
    categoria: 'Pueblo',
    descripcion:
      'Quesos, fabes y miel en los puestos de la plaza. La única foto de la muestra con gente mirando a cámara.',
    tecnica: '1/250 s · f/4 · ISO 400 · 35 mm',
    ancho: 1400,
    alto: 934,
    alt: 'Puestos de un mercado al aire libre con quesos y tarros de miel, y una vendedora sonriendo a la cámara.',
    colores: ['#2a1d22', '#9c3d4a', '#f3c9a0'],
  },
  {
    id: 'teitos-de-somiedo',
    titulo: 'Teitos en la braña',
    autoria: 'Xuan Álvarez',
    lugar: 'Somiedo',
    fecha: '2025-12-20',
    categoria: 'Montaña',
    descripcion:
      'Las cabañas de techo de escoba de los vaqueiros, vacías en invierno. Xuan subió con raquetas desde el valle.',
    tecnica: '1/320 s · f/8 · ISO 100 · 35 mm',
    ancho: 1400,
    alto: 934,
    alt: 'Cabañas de piedra con tejados de paja oscura en un prado de montaña cubierto de escarcha.',
    colores: ['#1e2418', '#6f7a3c', '#e6dfb3'],
  },
]

/**
 * La foto, en public/fotos/<id>.jpg: Vite la sirve tal cual, en desarrollo y
 * en el build. BASE_URL es '/' salvo que publiques la app en una subcarpeta.
 */
export function urlFoto(foto: Foto): string {
  return `${import.meta.env.BASE_URL}fotos/${foto.id}.jpg`
}

export function buscarFoto(id: string | undefined): Foto | undefined {
  return FOTOS.find((foto) => foto.id === id)
}

/** La foto de antes y la de después, dando la vuelta en los extremos. */
export function vecinas(foto: Foto): { anterior: Foto; siguiente: Foto } {
  const indice = FOTOS.indexOf(foto)
  return {
    anterior: FOTOS[(indice - 1 + FOTOS.length) % FOTOS.length],
    siguiente: FOTOS[(indice + 1) % FOTOS.length],
  }
}

const formatoFecha = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

export function fechaLarga(fecha: string): string {
  return formatoFecha.format(new Date(fecha + 'T12:00:00'))
}
