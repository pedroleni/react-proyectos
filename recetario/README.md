> Este proyecto vive en la carpeta `recetario/` de un repositorio con varios proyectos: clónalo entero y haz `cd recetario` antes de los pasos siguientes.

# Recetario con React Router y TanStack Query

Proyecto 93 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).

**Esta es la rama `solucion`**: la implementación completa. La rama
[`main`](../../tree/main/recetario) tiene el punto de partida, con un
`TODO (paso N)` en cada sitio que tienes que construir.

El recetario del proyecto avanzado de JavaScript, rehecho en React: las
mismas páginas y la misma API real ([TheMealDB](https://www.themealdb.com/api.php),
gratuita y sin clave), pero con **React Router** para las rutas y
**TanStack Query** para los datos del servidor. Ya no hay router escrito a
mano, ni estado observable, ni contadores contra las respuestas que llegan
tarde.

## Qué hay dentro

```
index.html                 — solo el <div id="root">
src/
  main.jsx                 — QueryClient + QueryClientProvider + BrowserRouter
  App.jsx                  — el árbol de rutas y las páginas con lazy
  api.js                   — la única capa que sabe hacer fetch
  consultas.js             — un Hook de TanStack Query por dato, con sus claves
  utilidades.js            — normalizarIngredientes, la misma de JavaScript
  componentes/
    Maquetacion.jsx        — cabecera, menú, <Suspense> y <Outlet />
    Mensajes.jsx           — avisos de carga y de error
    TarjetaReceta.jsx      — tarjeta reutilizable
  paginas/
    Inicio.jsx             — /                    portada y tres recetas al azar
    Buscar.jsx             — /buscar?q=…          búsqueda en la URL
    Receta.jsx             — /receta/:id          ficha de una receta
    Categorias.jsx         — /categorias          ruta madre: la fila de categorías
    ListaCategorias.jsx    — /categorias          su ruta índice
    Categoria.jsx          — /categorias/:nombre  su ruta hija
    NoEncontrada.jsx       — *                    página 404
  App.test.jsx             — rutas, búsqueda y respuestas desordenadas
  utilidades.test.js
  test/                    — una TheMealDB de mentira con MSW para los tests
```

## Requisitos

- [Node.js](https://nodejs.org/) **22.22.2 o superior**, o la LTS actual (24).
  React Router 8 pide 22.22 y jsdom, con el que corren los tests, 22.22.2.
  Comprueba tu versión con `node --version`.
- npm (viene con Node.js).

## Cómo ejecutarlo

```bash
git clone https://github.com/pedroleni/react-proyectos.git
cd react-proyectos/recetario
npm install
npm run dev
```

- `npm run dev`: servidor de desarrollo, con el panel de TanStack Query abajo a la derecha
- `npm run build`: build de producción en `dist/`, una página por archivo
- `npm run preview`: sirve ese build para comprobarlo
- `npm test`: los tests con Vitest, Testing Library y MSW
- `npm run lint`: el linter de la plantilla de Vite (Oxlint)
