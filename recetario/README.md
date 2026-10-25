> Este proyecto vive en la carpeta `recetario/` de un repositorio con varios proyectos: clónalo entero y haz `cd recetario` antes de los pasos siguientes.

# Recetario con React Router y TanStack Query

Proyecto 93 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).

**Esta es la rama `main`**: el punto de partida. Los estilos, la capa de red
(`api.js`), `utilidades.js`, los componentes pequeños y los tests ya están
hechos. Lo que falta está marcado con `TODO (paso N)`, con el mismo número
que el paso de la lección. La rama [`solucion`](../../tree/solucion/recetario)
tiene la implementación completa, por si te atascas.

El recetario del proyecto avanzado de JavaScript, rehecho en React: las
mismas páginas y la misma API real ([TheMealDB](https://www.themealdb.com/api.php),
gratuita y sin clave), pero con **React Router** para las rutas y
**TanStack Query** para los datos del servidor.

## Los pasos

1. `src/main.jsx`: el `QueryClient` y los dos proveedores.
2. `src/App.jsx`: el árbol de rutas.
3. `src/componentes/Maquetacion.jsx`: `NavLink`, `<Outlet />` y el scroll.
4. `src/consultas.js`: las claves y un Hook por dato.
5. `src/paginas/Inicio.jsx`: la primera consulta en pantalla.
6. `src/paginas/Receta.jsx`: el parámetro `:id`.
7. `src/paginas/Buscar.jsx`: la búsqueda en la URL.
8. `src/paginas/Categorias.jsx`, `ListaCategorias.jsx` y `Categoria.jsx`: rutas anidadas.
9. `src/App.jsx`, `Maquetacion.jsx` y `Categorias.jsx`: páginas con `lazy` y `<Suspense>`.

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

- `npm run dev`: servidor de desarrollo
- `npm run build`: build de producción en `dist/`
- `npm run preview`: sirve ese build para comprobarlo
- `npm test`: los tests. Al principio fallan los de `App.test.jsx`; cuando
  termines los nueve pasos, tienen que pasar todos.
- `npm run lint`: el linter de la plantilla de Vite (Oxlint)
