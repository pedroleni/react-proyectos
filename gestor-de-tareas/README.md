> Este proyecto vive en la carpeta `gestor-de-tareas/` de un repositorio con varios proyectos: clónalo entero y entra con `cd gestor-de-tareas` antes de los pasos de abajo.

# Gestor de tareas en React

**Esta es la rama `solucion`**: el proyecto completo. Si vienes a hacerlo tú, empieza por la rama [`main`](../../tree/main), que tiene lo mismo con `TODO` en los archivos de `src/`.

Proyecto 92 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com): el gestor de tareas del proyecto 76 de JavaScript ([javascript-proyectos/gestor-de-tareas](https://github.com/pedroleni/javascript-proyectos/tree/solucion/gestor-de-tareas)), rehecho en React. Las mismas funciones (añadir, marcar, borrar, filtrar y guardar en `localStorage`) con un reductor y dos contextos, hooks propios y tests con Vitest y Testing Library. La lección compara las dos versiones archivo por archivo.

## Requisitos

Node.js 22.12 o superior (Vitest 5 lo necesita).

## Cómo ejecutarlo

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:5173
npm test          # los 26 tests, una vez
npx vitest        # los tests en modo vigilancia
npm run lint      # Oxlint
npm run build     # build de producción en dist/
npm run preview   # sirve ese build
```

## Qué hay en `src/`

```text
tareasReducer.js          el estado y sus cambios, en una función pura (sustituye a estado.js)
TareasContext.js          los dos contextos y los hooks para leerlos
ProveedorTareas.jsx       guarda el estado con useReducer y lo reparte
almacenamiento.js         leer y guardar en localStorage (el de JavaScript, con una línea más)
useGuardadoAutomatico.js  guarda las tareas cada vez que cambian
componentes/              Cabecera, FormularioTarea, Filtros, ListaTareas y Tarea (sustituyen a vista.js)
App.jsx, main.jsx         colocan la interfaz y la montan (sustituyen a main.js)
*.test.js, *.test.jsx     los tests; setup.js los prepara
```
