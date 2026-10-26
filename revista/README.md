> Este proyecto vive en la carpeta `revista/` de un repositorio con varios proyectos: clónalo entero y haz `cd revista` antes de los pasos siguientes.

# Revista con renderizado en servidor

Proyecto 98 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).

**Esta es la rama `main`**: el punto de partida. La revista ya tiene sus
estilos, sus datos, la capa que guarda las cartas y los tests, pero la portada
sale vacía, todos los artículos enseñan el mismo, no hay título ni Open Graph
y ni las cartas ni el boletín del pie se pueden enviar. Lo que falta está
marcado con `TODO (paso N)`, con el mismo número que el paso de la lección. La
rama [`solucion`](../../tree/solucion/revista) tiene la implementación
completa, por si te atascas.

## Los pasos

1. `app/routes.ts`: las rutas del artículo y de la página «no encontrada».
2. `app/routes/portada.tsx`: el `loader` de la portada.
3. `app/routes/articulo.tsx` y `no-encontrada.tsx`: cada artículo, y un 404 de verdad.
4. `app/componentes/Metadatos.tsx`, `portada.tsx` y `articulo.tsx`: título, descripción y Open Graph.
5. `app/datos/cartas.server.ts`, `articulo.tsx` y `FormularioCarta.tsx`: la `action` de las cartas, validada en el servidor.
6. `app/componentes/FormularioCarta.tsx` y `articulo.tsx`: con JavaScript, el estado del envío.
7. `app/routes.ts`, `app/routes/boletin.tsx` y `app/componentes/FormularioBoletin.tsx`: el boletín, sin cambiar de página (`useFetcher`).
8. `app/fechas.ts`: la hora de publicación, igual en el servidor y en el navegador.
9. `app/reloj.ts` y `app/componentes/HaceCuanto.tsx`: «hace dos días», solo en el navegador.
10. `app/tiempos.server.ts`, `app/root.tsx` y `articulo.tsx`: cuánto tarda cada petición, con un middleware.

`npm test` empieza con 2 tests en verde (la capa de datos) y 28 en rojo; los
30 pasan al terminar el paso 10. `npm run typecheck` marca errores en
`pruebas/` hasta el paso 7, porque los tests usan lo que todavía no existe, y
en `app/routes/articulo.tsx` hasta el paso 1 y en `app/routes/boletin.tsx`
hasta el 7, porque los tipos de una ruta solo se generan cuando está
registrada.

## Qué hay dentro

```
app/
  root.tsx                    — el documento entero (<html>), la cabecera, el pie y el error general
  routes.ts                   — las rutas
  routes/
    portada.tsx               — /                  loader con los artículos
    articulo.tsx              — /articulos/:slug   loader, 404, action de las cartas y ErrorBoundary
    boletin.tsx               — /boletin           action del boletín (y su página, sin JavaScript)
    no-encontrada.tsx         — cualquier otra dirección, con su 404
  componentes/
    Metadatos.tsx             — <title>, <meta> y Open Graph de cada página
    TarjetaArticulo.tsx       — un artículo en la portada
    FormularioCarta.tsx       — el formulario de las cartas al director
    FormularioBoletin.tsx     — el boletín del pie, con useFetcher
    FechaPublicacion.tsx      — «21 de octubre de 2026 a las 9:30»
    HaceCuanto.tsx            — «· anteayer», solo en el navegador
  datos/
    articulos.server.ts       — los seis artículos (solo en el servidor)
    cartas.server.ts          — guardar, leer y validar las cartas (solo en el servidor)
    boletin.server.ts         — los correos del boletín (solo en el servidor)
  config.server.ts            — la URL pública, de la variable de entorno URL_PUBLICA
  tiempos.server.ts           — el middleware que mide cada petición (cabecera Server-Timing)
  fechas.ts                   — formatear fechas igual en el servidor y en el navegador
  reloj.ts                    — useAhora(): la hora, como almacén externo
  tipos.ts                    — los tipos que comparten los dos lados
  app.css                     — los estilos
public/og/                    — las imágenes de Open Graph (1200 × 630)
pruebas/                      — Vitest y Testing Library
```

Los archivos `.server.ts` no llegan nunca al navegador: si un componente los
importa, el build falla con `Server-only module referenced by client`.

## Requisitos

- [Node.js](https://nodejs.org/) **22.22.2 o superior**, o la LTS actual (24).
  React Router 8 pide 22.22 y jsdom, con el que corren los tests, 22.22.2.
  Comprueba tu versión con `node --version`.

## Cómo ejecutarlo

```bash
git clone https://github.com/pedroleni/react-proyectos.git
cd react-proyectos/revista
npm install
npm run dev
```

- `npm run dev`: servidor de desarrollo, con renderizado en el servidor, en `http://localhost:5173`
- `npm test`: los tests (30)
- `npm run typecheck`: genera los tipos de las rutas y comprueba los tipos
- `npm run build`: construye el servidor y el cliente en `build/`
- `npm start`: arranca ese build, el servidor de producción, en `http://localhost:3000`

Tres variables de entorno, opcionales:

- `URL_PUBLICA`: la dirección pública de la revista (por ejemplo,
  `https://cajabaja.example`), para las URL absolutas de Open Graph. Sin ella,
  sale de cada petición.
- `ARCHIVO_CARTAS`: dónde se guardan las cartas. Por defecto, `datos/cartas.json`
  (la carpeta `datos/` está en `.gitignore`).
- `ARCHIVO_BOLETIN`: dónde se guardan los correos del boletín. Por defecto,
  `datos/boletin.json`.

## De dónde sale

De la plantilla oficial, `npx create-react-router@8.5.0`, con tres cambios: sin
Tailwind ni la fuente de Google (los estilos están en `app/app.css`, con fuentes
del sistema), sin el `Dockerfile` y con Vitest para los tests. Las imágenes de
`public/og/` son tarjetas tipográficas generadas con Playwright.

## Versiones

React 19.3.1, React Router 8.5.0 (`react-router`, `@react-router/dev`,
`@react-router/node` y `@react-router/serve`), isbot 5.2.2, Vite 8.3.5,
TypeScript 5.9.3 (la de la plantilla), Vitest 5.0.5, Testing Library React
16.3.3, user-event 14.6.8, jest-dom 7.0.1 y jsdom 30.1.3.
