import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/portada.tsx'),
  route('articulos/:slug', 'routes/articulo.tsx'),
  // La action del boletín. Sin JavaScript, el navegador acaba en su página.
  route('boletin', 'routes/boletin.tsx'),
  // Cualquier otra dirección: la página «no encontrada», con su 404.
  route('*', 'routes/no-encontrada.tsx'),
] satisfies RouteConfig
