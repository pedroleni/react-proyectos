> Este proyecto vive en la carpeta `gestor-de-tareas/` de un repositorio con varios proyectos: clónalo entero y entra con `cd gestor-de-tareas` antes de los pasos de abajo.

# Gestor de tareas en React

Proyecto 92 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).

Este es el punto de partida: el gestor de tareas del proyecto 76 de JavaScript ([javascript-proyectos/gestor-de-tareas](https://github.com/pedroleni/javascript-proyectos/tree/solucion/gestor-de-tareas)), rehecho en React con un reductor y dos contextos, hooks propios, `localStorage` y tests con Vitest y Testing Library.

El proyecto de Vite ya está montado: `index.html`, los estilos (`src/estilos.css`), `App.jsx`, `main.jsx` y la configuración de los tests están terminados. Los archivos de `src/` tienen comentarios `// TODO (paso N)` en el orden de la lección:

1. `tareasReducer.js`: el reductor.
2. `TareasContext.js` y `ProveedorTareas.jsx`: los contextos, el proveedor y los hooks.
3. `componentes/`: la interfaz.
4. `useGuardadoAutomatico.js` y `ProveedorTareas.jsx`: la persistencia.
5. `App.test.jsx`: tus propios tests.

## Requisitos

Node.js 22.12 o superior (Vitest 5 lo necesita).

## Cómo ejecutarlo

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:5173
npm test          # los tests, una vez
npx vitest        # los tests en modo vigilancia: se repiten al guardar
```

Al empezar, `npm test` sale en rojo a propósito: los tests de los pasos 1 a 4 ya están escritos y se ponen en verde a medida que completas cada paso.

## Si te atascas

La rama [`solucion`](../../tree/solucion) tiene el proyecto completo. Inténtalo antes por tu cuenta.
