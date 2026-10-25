> Este proyecto vive en la carpeta `revista/` de un repositorio con varios proyectos: clónalo entero y haz `cd revista` antes de los pasos siguientes.

# Revista con renderizado en servidor

Proyecto 98 del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).

**Esta es la rama `solucion`**: la implementación completa. La rama
[`main`](../../tree/main/revista) tiene el punto de partida, con un
`TODO (paso N)` en cada sitio que tienes que construir.

«Caja Baja» es una revista de tipografía e imprenta hecha con React Router 8
en modo framework. Cada página llega del servidor ya renderizada, con su
título, su descripción y sus etiquetas Open Graph en el HTML, y después el
navegador la hidrata:

- **Datos del servidor**: la portada y cada artículo cargan sus datos con un
  `loader`, que solo se ejecuta en el servidor.
- **Un 404 de verdad**: un artículo que no existe responde con el estado 404.
- **Cartas al director**: un formulario con `action`, validado en el servidor,
  que funciona también sin JavaScript.
- **Fechas que no rompen la hidratación**: la hora de publicación, en hora
  peninsular en los dos lados, y «hace dos días», solo en el navegador.

## Qué hay dentro

```
app/
  root.tsx                    — el documento entero (<html>), la cabecera, el pie y el error general
  routes.ts                   — las rutas
  routes/
    portada.tsx               — /                  loader con los artículos
    articulo.tsx              — /articulos/:slug   loader, 404, action de las cartas y ErrorBoundary
    no-encontrada.tsx         — cualquier otra dirección, con su 404
  componentes/
    Metadatos.tsx             — <title>, <meta> y Open Graph de cada página
    TarjetaArticulo.tsx       — un artículo en la portada
    FormularioCarta.tsx       — el formulario de las cartas al director
    FechaPublicacion.tsx      — «21 de octubre de 2026 a las 9:30»
    HaceCuanto.tsx            — «· anteayer», solo en el navegador
  datos/
    articulos.server.ts       — los seis artículos (solo en el servidor)
    cartas.server.ts          — guardar, leer y validar las cartas (solo en el servidor)
  config.server.ts            — la URL pública, de la variable de entorno URL_PUBLICA
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
- `npm test`: los tests (22)
- `npm run typecheck`: genera los tipos de las rutas y comprueba los tipos
- `npm run build`: construye el servidor y el cliente en `build/`
- `npm start`: arranca ese build, el servidor de producción, en `http://localhost:3000`

Dos variables de entorno, opcionales:

- `URL_PUBLICA`: la dirección pública de la revista (por ejemplo,
  `https://cajabaja.example`), para las URL absolutas de Open Graph. Sin ella,
  sale de cada petición.
- `ARCHIVO_CARTAS`: dónde se guardan las cartas. Por defecto, `datos/cartas.json`
  (la carpeta `datos/` está en `.gitignore`).

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
