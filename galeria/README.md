> Este proyecto vive en la carpeta `galeria/` de un repositorio con varios proyectos: clónalo entero y haz `cd galeria` antes de los pasos siguientes.

# Galería con `<ViewTransition>` y `<Activity>`

Proyecto 97 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).

**Esta es la rama `main`**: el punto de partida. La galería ya funciona (rutas,
cuadrícula, ficha de cada foto, formulario y estilos), pero nada se anima y
las pestañas pierden lo que tenían al cambiar de una a otra. Lo que falta
está marcado con `TODO (paso N)`, con el mismo número que el paso de la
lección. La rama [`solucion`](../../tree/solucion/galeria) tiene la
implementación completa, por si te atascas.


## Los pasos

1. `src/App.tsx`: las tres pestañas, siempre montadas, cada una en un `<Activity>`.
2. `src/App.tsx`: la galería recuerda la foto que tenías abierta.
3. `src/paginas/Cuadricula.tsx`, `Detalle.tsx` y `transiciones.css`: el elemento compartido.
4. `src/paginas/Cuadricula.tsx`, `Detalle.tsx` y `transiciones.css`: scroll y foco en efectos de layout.
5. `src/componentes/EnlaceConTipo.tsx` y `Detalle.tsx`: anterior y siguiente, con dirección.
6. `src/componentes/Pestanas.tsx` y `App.tsx`: las pestañas, con dirección y una raya que se desliza.
7. `src/transiciones.css`: `prefers-reduced-motion`.

`npm test` empieza con 7 tests en verde y 6 en rojo; los 13 pasan al terminar
el paso 6. Las animaciones no las puede comprobar ningún test: míralas en el
navegador.

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
  tipos: Chrome o Edge 125, Safari 18.2 o Firefox 147 en adelante.

## Cómo ejecutarlo

```bash
git clone https://github.com/pedroleni/react-proyectos.git
cd react-proyectos/galeria
npm install
npm run dev
```

- `npm run dev`: servidor de desarrollo, en `http://localhost:5173`
- `npm test`: los tests con Vitest y Testing Library
- `npm run build`: comprueba los tipos y construye en `dist/`
- `npm run preview`: sirve ese build
- `npm run lint`: Oxlint
