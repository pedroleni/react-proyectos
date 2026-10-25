# Proyectos avanzados de React

Los proyectos avanzados del temario de React de [Tech Study Tracker](https://www.techstudytracker.com).
Cada carpeta es un proyecto independiente, con su propio `package.json` y su README.

| Lección | Proyecto | Carpeta |
|---|---|---|
| 92 | Gestor de tareas en React | [`gestor-de-tareas/`](gestor-de-tareas/) |
| 93 | Recetario con React Router y TanStack Query | [`recetario/`](recetario/) |
| 94 | Panel en tiempo real, y hacerlo rápido | [`panel-tiempo-real/`](panel-tiempo-real/) |
| 95 | Reserva de refugios de montaña | [`reserva-refugios/`](reserva-refugios/) |
| 96 | Kit de componentes accesibles | [`kit-accesible/`](kit-accesible/) |
| 97 | Galería con `<ViewTransition>` y `<Activity>` | [`galeria/`](galeria/) |
| 98 | Revista con renderizado en servidor (React Router en modo framework) | [`revista/`](revista/) |

## Ramas

- **`main`**: el punto de partida. Cada proyecto arranca, pero le faltan las piezas que construyes en la lección; las marcan los comentarios `// TODO (paso N)`.
- **`solucion`**: los mismos proyectos terminados. Úsala para comparar cuando acabes un paso, no para empezar.

## Cómo empezar

```bash
git clone https://github.com/pedroleni/react-proyectos.git
cd react-proyectos/<carpeta>
npm install
npm run dev
```

Cada README dice qué versión de Node necesita y qué órdenes tiene (`npm test`, `npm run lint`, `npm run build`).
