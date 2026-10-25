import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import Maquetacion from './componentes/Maquetacion.jsx'
import Inicio from './paginas/Inicio.jsx'
import NoEncontrada from './paginas/NoEncontrada.jsx'

// La portada la ve todo el mundo al entrar: va en el archivo principal.
// El resto de páginas, cada una en su propio archivo, se piden al visitarlas.
const Buscar = lazy(() => import('./paginas/Buscar.jsx'))
const Receta = lazy(() => import('./paginas/Receta.jsx'))
const Categorias = lazy(() => import('./paginas/Categorias.jsx'))
const ListaCategorias = lazy(() => import('./paginas/ListaCategorias.jsx'))
const Categoria = lazy(() => import('./paginas/Categoria.jsx'))

export default function App() {
  return (
    <Routes>
      <Route element={<Maquetacion />}>
        <Route index element={<Inicio />} />
        <Route path="buscar" element={<Buscar />} />
        <Route path="receta/:id" element={<Receta />} />
        <Route path="categorias" element={<Categorias />}>
          <Route index element={<ListaCategorias />} />
          <Route path=":nombre" element={<Categoria />} />
        </Route>
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}
