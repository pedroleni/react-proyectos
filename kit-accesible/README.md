# Kit de componentes accesibles

Proyecto 96 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).
La página de matrícula de la Escuela de idiomas Puente Nuevo, hecha con
cuatro componentes escritos desde cero siguiendo los patrones de la
[WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/):

- **Diálogo modal** (`src/kit/Dialogo.tsx`): portal, `role="dialog"`,
  `aria-modal`, foco que entra con un `<Fragment ref>`, Tab atrapado con
  dos centinelas, el resto de la página `inert` y el foco de vuelta al cerrar.
- **Menú de botón** (`src/kit/Menu.tsx`): `aria-haspopup`, `aria-expanded`,
  flechas, Inicio, Fin, Escape y Tab, en un portal colocado bajo el botón.
- **Pestañas** (`src/kit/Pestanas.tsx`): foco itinerante y activación automática.
- **Combobox** (`src/kit/Combobox.tsx`): autocompletado de lista con
  `aria-activedescendant`, búsqueda sin tildes y una región viva con el
  número de resultados.

Esta es la rama `solucion`. La rama `main` tiene el mismo proyecto con
`// TODO (paso N)` donde va el trabajo de cada paso de la lección.

## Requisitos

Node.js 20.19 o superior (o 22.12 o superior), como pide Vite 8.

## Comandos

```bash
npm install
npm run dev          # la página, en http://localhost:5173
npm test             # los tests por rol y con axe (Vitest + Testing Library)
npm run build        # comprueba los tipos y construye en dist/
npm run lint         # Oxlint
```

## La comparación con Radix (paso 7)

La app y los tests importan el kit de `@kit`. `vite.config.ts` decide qué
carpeta es: `src/kit` (el tuyo) o, con `--mode radix`, `src/radix` (la
misma API hecha con [Radix Primitives](https://www.radix-ui.com/primitives)).

```bash
npm run test:radix   # los mismos tests contra la versión de Radix
npm run build:radix  # la misma app con Radix, en dist-radix/
```

Con la versión de Radix pasan 32 de los 36 tests. Los 4 que fallan son
decisiones de Radix que se apartan de cómo está hecho el kit, y se
explican en la lección: su diálogo no pone `aria-modal` (oculta el resto
con `aria-hidden`), su menú no se abre con la flecha arriba, no se cierra
con Tab y bloquea el puntero fuera mientras está abierto.

## Versiones

React 19.3.1, Vite 8.3.5, TypeScript 6.0.3, Vitest 5.0.5, Testing Library
React 16.3.3, user-event 14.6.8, jest-dom 7.0.1, vitest-axe 0.1.0
(axe-core 4.14.0), jsdom 28.1.0 y radix-ui 1.8.1. jsdom se queda en la 28
porque la 30 pide Node 22.22 o 24.15, más que Vite.
