# Panel en tiempo real

Proyecto 94 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).
Rehace en React y TypeScript el panel cripto del proyecto 79 de JavaScript,
ahora en directo: los 516 pares que cotizan en USDT en Binance, con los
cambios de cada segundo llegando por un WebSocket. Y después lo hace rápido,
midiendo cada paso:

- **Un almacén externo** (`src/mercado/almacen.ts`) que guarda la última
  instantánea del mercado, abre la conexión mientras alguien escucha y la
  cierra cuando se van todos. Los componentes lo leen con
  `useSyncExternalStore` y un selector (`src/mercado/useMercado.ts`).
- **La fuente de Binance** (`src/mercado/binance.ts`): una foto de todos los
  pares por HTTP y los cambios por el WebSocket público
  `!miniTicker@arr`, con reconexión. Sin clave ni `.env`.
- **Un `<Profiler>`** alrededor de la tabla y un medidor que resume sus
  commits cada segundo (`src/medidas.ts`, `src/componentes/Medidor.tsx`).
- **El React Compiler**, que se enciende o se apaga según el modo de Vite.
- **TanStack Virtual** (`src/componentes/TablaVirtual.tsx`): en el DOM, solo
  las filas que se ven.

Esta es la rama `main`, el punto de partida: el proyecto montado, con los
estilos, los tests y los componentes pequeños hechos, y un `// TODO (paso N)`
donde va el trabajo de cada paso de la lección. La rama `solucion` tiene el
proyecto completo.

## Requisitos

Node.js 22.12 o superior (Vitest 5 lo pide; Vite 8 se conforma con la 20.19).
Para medir, Chrome o Edge.

## Comandos

```bash
npm install
npm run dev                    # con el compilador, en http://localhost:5173
npm run dev:sin-compilador     # lo mismo, sin el compilador
npm test                       # Vitest + Testing Library
npm run build                  # comprueba los tipos y construye en dist/
npm run lint                   # Oxlint
npm run medir                  # build de profiling con el compilador, y lo sirve
npm run medir:sin-compilador   # build de profiling sin el compilador, y lo sirve
```

Dos opciones en la URL:

- `?fuente=simulada`: datos inventados y siempre iguales, a partir de una foto
  real de Binance (`src/mercado/muestra.json`), para medir en las mismas
  condiciones. También sirve si Binance no responde desde tu red.
- `?tabla=completa`: arranca con la tabla sin virtualizar.

## Versiones

React 19.3.1, TypeScript 6.0.3, Vite 8.3.5, `@vitejs/plugin-react` 6.1.2,
`babel-plugin-react-compiler` 1.0.0 con `@rolldown/plugin-babel` 0.2.4 y
`@babel/core` 7.29.7, `@tanstack/react-virtual` 3.14.22, Vitest 5.0.5,
Testing Library React 16.3.3, user-event 14.6.8, jest-dom 7.0.1, jsdom 28.1.0
y Oxlint 1.89.0.
