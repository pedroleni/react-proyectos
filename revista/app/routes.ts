import { type RouteConfig, index } from '@react-router/dev/routes'

export default [
  index('routes/portada.tsx'),
  // TODO (paso 1): registra las otras dos rutas, con route() de
  // @react-router/dev/routes:
  //   - articulos/:slug → routes/articulo.tsx
  //   - * (cualquier otra dirección) → routes/no-encontrada.tsx
] satisfies RouteConfig
