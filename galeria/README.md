> Este proyecto vive en la carpeta `galeria/` de un repositorio con varios proyectos: clónalo entero y haz `cd galeria` antes de los pasos siguientes.

# Galería con `<ViewTransition>` y `<Activity>`

Proyecto 97 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).

**Esta es la rama `solucion`**: la implementación completa. La rama
[`main`](../../tree/main/galeria) tiene el punto de partida, con un
`TODO (paso N)` en cada sitio que tienes que construir.

«Luz del Norte», la exposición de invierno de una asociación fotográfica de
Gijón: doce fotos en una cuadrícula, la ficha de cada una y dos pestañas más,
«Participa» y «Visita». Todo lo que se mueve lo anima el navegador con la
View Transition API, coordinada por React:

- **Elemento compartido**: la miniatura crece hasta la foto grande al abrirla
  y vuelve a su sitio al cerrarla (`<ViewTransition name>`).
- **Dirección**: «Foto siguiente» entra por la derecha y «Foto anterior», por
  la izquierda; lo mismo al cambiar de pestaña (`addTransitionType`).
- **Pestañas que conservan su estado**: las tres están siempre montadas dentro
  de un `<Activity>`. Lo que escribes en «Participa» y la foto que tenías
  abierta en «Galería» siguen ahí al volver.


## Qué hay dentro

```
public/fotos/               — las doce fotos (generadas con IA, ver más abajo)
src/
  main.tsx                  — StrictMode + BrowserRouter (navega en transiciones)
  App.tsx                   — cabecera, pestañas y las tres secciones en <Activity>
  secciones.ts              — las tres pestañas y a cuál pertenece cada URL
  transiciones.ts           — tipos de transición, clases y nombres compartidos
  transiciones.css          — las animaciones (::view-transition-*) y prefers-reduced-motion
  estilos.css               — el resto de estilos
  datos.ts                  — las doce fotos
  componentes/
    Foto.tsx                — la foto: <img> con su tamaño y un degradado mientras carga
    EnlaceConTipo.tsx       — un enlace que navega con un tipo de transición
    Pestanas.tsx            — las pestañas y su raya, que se desliza
  paginas/
    Galeria.tsx             — las rutas de la galería, con su propia ubicación
    Cuadricula.tsx          — /                 las doce miniaturas
    Detalle.tsx             — /foto/:id         la ficha, con anterior y siguiente
    Participa.tsx           — /participa        formulario de propuestas
    Visita.tsx              — /visita           horario
    NoEncontrada.tsx        — cualquier otra dirección
  pruebas/                  — Vitest + Testing Library
```

## Las fotos y la exposición

**La exposición, la asociación fotográfica y sus nueve autores son
inventados**: es un proyecto de práctica. Los lugares sí son reales.
**Las doce fotos están generadas con inteligencia artificial** (la
herramienta de imágenes de Codex, de OpenAI) a partir de una descripción de
cada una; no son fotografías de esos lugares. El pie de la web también lo dice.

Están en `public/fotos/<id>.jpg`, a 1400 px en su lado largo (las de 4 × 5,
a 1024 × 1280). `Foto.tsx` las pinta con su `width` y su `height`, para que
el navegador reserve el hueco, y con un degradado de sus tonos de fondo
mientras llegan.

## Requisitos

- [Node.js](https://nodejs.org/) **22.22.2 o superior**, o la LTS actual (24).
  React Router 8 pide 22.22 y jsdom, con el que corren los tests, 22.22.2.
  Comprueba tu versión con `node --version`.
- Para ver las animaciones, un navegador con la View Transition API y sus
  tipos: Chrome o Edge 125, Safari 18.2 o Firefox 147 en adelante. En uno
  más antiguo la galería funciona igual, sin animar.

## Cómo ejecutarlo

```bash
git clone https://github.com/pedroleni/react-proyectos.git
cd react-proyectos/galeria
npm install
npm run dev
```

- `npm run dev`: servidor de desarrollo, en `http://localhost:5173`
- `npm test`: los tests (13): pestañas, rutas, foco y tipos de transición
- `npm run build`: comprueba los tipos y construye en `dist/`
- `npm run preview`: sirve ese build
- `npm run lint`: Oxlint

## Versiones

React 19.3.1, React Router 8.5.0, Vite 8.3.5, TypeScript 7.0.2, Vitest
5.0.5, Testing Library React 16.3.3, user-event 14.6.8, jest-dom 7.0.1,
jsdom 30.1.3 y Oxlint 1.89.0.
