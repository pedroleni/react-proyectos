# Kit de componentes accesibles

Proyecto 96 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).
La página de matrícula de la Escuela de idiomas Puente Nuevo, con cuatro
componentes escritos desde cero siguiendo los patrones de la
[WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/):
diálogo modal, menú de botón, pestañas y combobox.

Esta es la rama `main`, el punto de partida. La página ya funciona con el
ratón, pero los cuatro componentes de `src/kit/` no son accesibles: cada
`// TODO (paso N)` marca lo que construyes en el paso N de la lección. La
rama `solucion` tiene el proyecto terminado.

## Requisitos

Node.js 20.19 o superior (o 22.12 o superior), como pide Vite 8.

## Comandos

```bash
npm install
npm run dev          # la página, en http://localhost:5173
npm test             # los tests por rol y con axe: te dicen qué falta
npm run build        # comprueba los tipos y construye en dist/
npm run lint         # Oxlint
```

Al empezar, `npm test` sale casi todo en rojo, y es lo esperado: los tests
de `src/pruebas/` ya están escritos (salvo los que escribes tú en el paso 6)
y cada paso pone en verde los suyos. Para lanzar solo los de un componente:
`npm test -- Pestanas`.
