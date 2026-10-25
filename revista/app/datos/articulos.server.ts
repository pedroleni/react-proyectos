// Los artículos de la revista. Hacen de base de datos: en un proyecto real, aquí
// habría una consulta. El sufijo .server garantiza que este módulo no llega
// nunca al navegador: si un componente lo importa, el build falla.
import type { Articulo, ResumenArticulo } from '~/tipos'

const ARTICULOS: Articulo[] = [
  {
    slug: 'caja-alta-y-caja-baja',
    titulo: 'Caja alta y caja baja: de dónde salen las mayúsculas',
    entradilla:
      'Antes de ser teclas, las mayúsculas y las minúsculas eran sitios: dos partes de un mueble de madera donde el cajista guardaba cada letra.',
    seccion: 'Oficio',
    autoria: 'Inés Lasheras',
    publicado: '2026-10-21T09:30:00+02:00',
    cuerpo: [
      'En un taller de tipos móviles, cada letra es una pieza de metal: un prisma de plomo, estaño y antimonio con el dibujo de la letra en relieve, y al revés, en una de sus caras. Un texto corto necesita miles de piezas, y el cajista tiene que encontrarlas sin mirar, igual que tú encuentras las teclas.',
      'Para eso está la caja: una bandeja de madera dividida en compartimentos, los cajetines, con una letra en cada uno. La caja descansa inclinada sobre un mueble que se llama chibalete, y en la tradición española se divide en dos partes. En la de arriba, la caja alta, van las mayúsculas. En la de abajo, la caja baja, las minúsculas.',
      'Los cajetines de la caja baja no son todos iguales. Las letras que más se usan, como la e o la a, tienen los más grandes y están en el centro, al alcance de la mano; las que casi no salen se quedan en los bordes. Un cajista con oficio no mira la caja: la mano va sola al cajetín.',
      'De ahí vienen los nombres que siguen en uso: en inglés, upper case y lower case; en castellano, caja alta y caja baja. Y de ahí viene también el nombre de esta revista, que habla de lo que se compone en minúscula: el texto de todos los días.',
      'La pantalla ha heredado el vocabulario. En CSS, text-transform: uppercase pasa un texto a caja alta sin tocar el HTML: el texto sigue escrito como se dice, y la mayúscula queda como lo que es, una decisión de presentación.',
    ],
  },
  {
    slug: 'un-punto-no-es-un-pixel',
    titulo: 'Un punto no es un píxel',
    entradilla:
      'La medida de la letra nació en los talleres franceses del siglo XVIII y sigue viva en tu hoja de estilos. Lo que mide un punto, y por qué no coincide con un píxel.',
    seccion: 'Pantalla',
    autoria: 'Daniel Ferrer',
    publicado: '2026-10-14T18:00:00+02:00',
    cuerpo: [
      'Cuando un impresor dice que un texto va en cuerpo 10, no habla del tamaño del dibujo de la letra, sino del bloque de metal que la sostiene: su altura, de arriba abajo. Por eso dos tipos del mismo cuerpo pueden parecer de tamaños distintos: uno tiene las minúsculas más altas que el otro, aunque el bloque mida lo mismo.',
      'Para medir ese bloque hacía falta una unidad común. En 1737, Pierre-Simon Fournier propuso dividir la pulgada en 72 puntos, y unas décadas después François-Ambroise Didot ajustó el sistema a la medida oficial francesa, el pie de rey. El punto Didot mide unos 0,376 milímetros, y doce puntos forman un cícero, la medida con la que se han contado las líneas en las imprentas de media Europa, las españolas incluidas.',
      'Los países de habla inglesa siguieron su propio camino, con un punto algo más pequeño, y los ordenadores lo simplificaron del todo: en los años ochenta, el lenguaje PostScript fijó el punto en exactamente 1/72 de pulgada, unos 0,353 milímetros. Es el que usan hoy los programas de maquetación, y también CSS.',
      'Y aquí viene la sorpresa para quien escribe hojas de estilo. En CSS, una pulgada son 96 píxeles por definición, así que un punto vale 96/72: 1,333 píxeles. Un texto a 12pt mide 16px, el tamaño por defecto de casi todos los navegadores. Pero el píxel de CSS tampoco es un píxel de la pantalla: es una unidad de referencia que el navegador escala según la densidad del dispositivo, y en una pantalla de alta densidad ocupa dos o tres píxeles físicos.',
      'La conclusión práctica: en pantalla, los puntos no aportan nada. Para el texto de una web, mejor rem, que parte del tamaño de letra que eligió quien lee; los puntos, para la hoja de estilos de impresión, donde una hoja de papel sí mide lo que mide.',
    ],
  },
  {
    slug: 'componer-una-linea-a-mano',
    titulo: 'Componer una línea a mano, letra a letra',
    entradilla:
      'El componedor en la mano izquierda, la caja delante y un original que leer. Así se monta, pieza a pieza y al revés, una sola línea de texto.',
    seccion: 'Oficio',
    autoria: 'Inés Lasheras',
    publicado: '2026-10-07T10:00:00+02:00',
    cuerpo: [
      'La herramienta del cajista es el componedor: una regleta de metal con un tope fijo y otro móvil, que se ajusta al ancho de la línea. El cajista lo sostiene con la mano izquierda y, con la derecha, va sacando letras de la caja y colocándolas dentro, una detrás de otra, mientras el pulgar izquierdo sujeta la última.',
      'Las letras entran al revés. El dibujo de cada tipo está invertido, como en un sello, y la línea se compone de izquierda a derecha pero cabeza abajo. Cada pieza tiene una muesca en un costado, el cran, y en el componedor todos los crans miran hacia el mismo lado: si uno no está en fila, hay una letra del revés.',
      'Entre palabra y palabra va un espacio, que también es una pieza de metal, más baja que las letras para que no toque el papel. Hay espacios de varios gruesos, y el más conocido da nombre a una medida: el cuadratín, un espacio tan ancho como alto es el cuerpo. Las cifras, en casi todos los tipos de plomo, miden medio cuadratín: por eso las columnas de números cuadran solas.',
      'Cuando la línea está casi llena llega lo difícil: justificarla. El texto tiene que ir exactamente de un tope a otro, y para eso el cajista cambia unos espacios por otros más gruesos o más finos hasta que la línea queda firme. Una línea mal justificada se nota al tacto: si baila, hay que volver a repartir los espacios.',
      'Con la línea lista, se pasa a la galera, la bandeja donde se van juntando las líneas hasta formar la página. De ahí sale la primera prueba de imprenta, la galerada, y ese nombre ha sobrevivido a todo lo demás: las editoriales todavía llaman galeradas a las pruebas que mandan a sus autores.',
    ],
  },
  {
    slug: 'las-comillas-que-pide-la-ortografia',
    titulo: 'Las comillas que pide la Ortografía',
    entradilla:
      'Latinas, inglesas y simples: hay tres clases de comillas y un orden para usarlas. Por qué esta revista empieza siempre por las latinas.',
    seccion: 'Ortotipografía',
    autoria: 'Marta Bielsa',
    publicado: '2026-09-30T12:00:00+02:00',
    cuerpo: [
      'En castellano hay tres clases de comillas: las latinas o angulares («»), las inglesas (“”) y las simples (‘’). Las tres sirven para lo mismo: citar lo que alguien dijo o escribió, señalar una palabra usada con un sentido especial o marcar el título de un artículo o de un capítulo. Lo que cambia es el orden en que se usan.',
      'La Ortografía de la lengua española de 2010 recomienda empezar por las latinas en los textos impresos y dejar las demás para cuando haya que entrecomillar algo dentro de un texto que ya va entre comillas: «Me dijo: “Pon ‘galerada’ en el glosario”». Las latinas fuera, las inglesas dentro y las simples en el tercer nivel.',
      'La puntuación de la frase va detrás de la comilla de cierre. Se escribe «galerada», con la coma fuera, y se termina así: «fin». Es uno de los errores más repetidos, porque en los textos en inglés el punto suele ir dentro.',
      'En la web no hay excusa para no usarlas. En un documento en UTF-8 se escriben tal cual, y también existen sus entidades de HTML, laquo y raquo. Y si una cita va marcada con el elemento q, la propiedad quotes de CSS decide qué comillas pone el navegador en cada nivel.',
    ],
  },
  {
    slug: 'joaquin-ibarra-el-impresor-de-zaragoza',
    titulo: 'Joaquín Ibarra, el impresor de Zaragoza',
    entradilla:
      'Nació en Zaragoza en 1725 y llegó a impresor de cámara de Carlos III. Su Quijote de 1780 sigue siendo una de las ediciones más cuidadas de la novela.',
    seccion: 'Historia',
    autoria: 'Daniel Ferrer',
    publicado: '2026-09-23T09:00:00+02:00',
    cuerpo: [
      'Joaquín Ibarra nació en Zaragoza en 1725 y aprendió el oficio en Cervera, en la imprenta de su universidad. Después se instaló en Madrid, y allí llegó a ser impresor de cámara del rey Carlos III y de la Real Academia Española.',
      'Dos libros bastan para entender su fama. En 1772 imprimió La conjuración de Catilina y la guerra de Jugurta, de Salustio, en la traducción del infante Gabriel de Borbón: un volumen de gran formato, con tipos nuevos y grabados. Y en 1780, el Quijote de la Real Academia, en cuatro tomos y con láminas grabadas.',
      'Lo que hacía distintos sus libros no era un truco, sino el cuidado en todo: tipos grabados y fundidos en España, un papel bien elegido, márgenes generosos y una tinta negra muy uniforme. Se le atribuye además la costumbre de satinar el papel después de imprimir, para borrar el relieve que dejaban los tipos.',
      'Murió en Madrid en 1785. Más de dos siglos después, sus libros siguen siendo la mejor prueba de lo que da de sí una prensa manual en buenas manos.',
    ],
  },
  {
    slug: 'la-raya-no-es-un-guion',
    titulo: 'La raya no es un guion',
    entradilla:
      'Son tres rayitas horizontales de distinta longitud y cada una tiene su trabajo. El guion une, la raya abre incisos y diálogos, y el signo menos resta.',
    seccion: 'Ortotipografía',
    autoria: 'Marta Bielsa',
    publicado: '2026-09-16T11:00:00+02:00',
    cuerpo: [
      'El guion (-) es el más corto y el más humilde: une las dos partes de una palabra compuesta, como en franco-alemán, parte una palabra al final de una línea y, según la Ortografía académica, une también los dos extremos de un intervalo, como en las páginas 23-45. En el teclado es la tecla de siempre.',
      'La raya (—) es bastante más larga y sirve para dos cosas: encerrar incisos —como este— y marcar en los diálogos lo que dice cada personaje y lo que añade el narrador. Se escribe pegada al texto del inciso y separada de lo de fuera, como un paréntesis.',
      'El inglés tiene además una raya intermedia (–), la en dash, que usa sobre todo para los intervalos. En castellano se ve cada vez más por contagio, pero la Ortografía no la necesita: para eso tiene el guion.',
      'Y el signo menos (−) no es ninguno de los anteriores: es un carácter propio, U+2212, que se dibuja con el mismo ancho que el signo más para que las cuentas queden alineadas. En una tabla de temperaturas se nota: −3 con el signo de verdad y -3 con un guion no miden lo mismo.',
      'En HTML se pueden escribir directamente en UTF-8 o con sus entidades: mdash para la raya, ndash para la intermedia y minus para el menos.',
    ],
  },
]

/** Unas 200 palabras por minuto, redondeando hacia arriba. */
function minutosDeLectura(articulo: Articulo): number {
  const palabras = articulo.cuerpo.join(' ').split(/\s+/).length
  return Math.max(1, Math.ceil(palabras / 200))
}

function resumir({ cuerpo, ...resto }: Articulo): ResumenArticulo {
  return { ...resto, minutos: minutosDeLectura({ cuerpo, ...resto }) }
}

/** Todos los artículos, del más reciente al más antiguo, sin el cuerpo. */
export function listarArticulos(): ResumenArticulo[] {
  return [...ARTICULOS]
    .sort((a, b) => Date.parse(b.publicado) - Date.parse(a.publicado))
    .map(resumir)
}

/** Un artículo entero por su slug, o undefined si no existe. */
export function buscarArticulo(slug: string): (Articulo & { minutos: number }) | undefined {
  const articulo = ARTICULOS.find((a) => a.slug === slug)
  return articulo && { ...articulo, minutos: minutosDeLectura(articulo) }
}

/** Los artículos más recientes, sin contar el que se está leyendo. */
export function otrosArticulos(slugActual: string, cuantos = 3): ResumenArticulo[] {
  return listarArticulos()
    .filter((a) => a.slug !== slugActual)
    .slice(0, cuantos)
}
