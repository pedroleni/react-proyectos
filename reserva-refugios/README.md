# Reserva de refugios de montaña

Proyecto 95 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).
Un formulario de reserva en tres pasos para cinco refugios del Pirineo
aragonés (Respomuso, Pineta, Estós, Ángel Orús y la Renclusa):

- **Actions**: cada paso es un `<form action>` y una sola acción con
  `useActionState` decide qué validar, qué pedir al servidor y a qué paso ir
  (`src/reserva/accion.ts`). `useFormStatus` en los botones.
- **Zod**: un solo esquema para toda la reserva (`src/reserva/esquema.ts`),
  recortado con `.pick()` para cada paso y usado también por el servidor.
- **`useOptimistic`**: al confirmar, las plazas de la reserva se restan en el
  acto y se marcan como retenidas; si el servidor falla, vuelven solas
  (`src/reserva/Reserva.tsx`).
- **Accesibilidad**: etiquetas, ayudas y errores unidos con `useId`,
  `aria-invalid` y `aria-describedby`; el foco va al título de cada paso o al
  primer error; regiones vivas para los avisos; `aria-current="step"`.
- **Tests**: Vitest, Testing Library, user-event, MSW y axe.

Los nombres, las zonas y las altitudes de los refugios son reales. **Las
plazas, los precios y las reservas son inventados.** Las imágenes de
`src/assets/refugios/` **están generadas con IA** (con la herramienta de
imágenes de Codex): son un refugio genérico en el paisaje de cada sitio, no
fotos de los refugios reales. En la página van con `alt=""`, porque siempre
están junto al nombre del refugio y no añaden información.

Esta es la rama `main`, el punto de partida: la aplicación arranca, pero
pulsar «Ver plazas y seguir» todavía no hace nada. Cada sitio donde trabajas
lleva un comentario `// TODO (paso N)` con el número del paso de la lección:

1. `src/reserva/esquema.ts`: el esquema compartido.
2. `src/servidor/manejadores.ts`: el servidor también valida.
3. `src/reserva/accion.ts`: una acción para los tres pasos.
4. `src/reserva/Campo.tsx`, `PasoRefugio.tsx`, `BotonesPaso.tsx` y
   `Reserva.tsx`: que cada paso se entienda sin verlo.
5. `src/reserva/Reserva.tsx`: la disponibilidad, optimista.
6. `src/pruebas/App.test.tsx` y `accesibilidad.test.tsx`: tus tests (los
   cuatro `it.todo`).

`npm test` empieza con 29 tests en rojo, 3 en verde y 4 pendientes. La rama
`solucion` tiene el proyecto completo, con sus 36 tests en verde.

## Requisitos

Node.js 22.12 o superior: es lo que pide MSW 3 (Vite 8 se conforma con la 20.19).

## Comandos

```bash
npm install
npm run dev     # la aplicación, en http://localhost:5173, con el servidor simulado
npm test        # los tests (Vitest + Testing Library + MSW + axe)
npm run build   # comprueba los tipos y construye en dist/
npm run lint    # Oxlint
```

## El servidor simulado

No hay backend: lo simula [MSW](https://mswjs.io) con los manejadores de
`src/servidor/manejadores.ts`. Con `npm run dev`, el plugin `msw()` de
`vite.config.ts` sirve el service worker y `main.tsx` lo pone en marcha; los
tests usan los mismos manejadores con `setupServer` (`src/pruebas/`). Las
peticiones salen en la pestaña Red de las DevTools.

- `GET /api/disponibilidad?refugio=…&llegada=AAAA-MM-DD&noches=N`: las
  plazas libres de cada noche.
- `POST /api/reservas`: valida la reserva con el mismo esquema de Zod que el
  formulario (422 si no pasa), comprueba las plazas (409 si no hay) y la
  guarda (201, con su localizador).

Abajo a la derecha, el panel **Servidor simulado** cambia la latencia y lo
que le pasa a la próxima reserva: que se confirme, que el servidor falle
(500) o que otro grupo se adelante (409). Los datos viven en memoria: al
recargar, el servidor vuelve a empezar.

Con `npm run build` y `npm run preview` no hay simulación (el plugin no hace
nada en producción): Vite responde a `/api/...` con `index.html` y la
aplicación enseña su aviso de error. En un despliegue de verdad, esas rutas
las serviría tu servidor.

## Versiones

React 19.3.1, Vite 8.3.5, TypeScript 7.0.2, Zod 4.6.7, MSW 3.0.3, Vitest
5.0.5, Testing Library React 16.3.3, user-event 14.6.8, jest-dom 7.0.1,
vitest-axe 0.1.0 (axe-core 4.14.0) y jsdom 28.1.0. jsdom se queda en la 28
porque la 30 pide Node 22.22 o 24.15.
