import { Route, Routes } from 'react-router'
import Maquetacion from './componentes/Maquetacion.jsx'
import Inicio from './paginas/Inicio.jsx'
import NoEncontrada from './paginas/NoEncontrada.jsx'
import Buscar from './paginas/Buscar.jsx'
import Receta from './paginas/Receta.jsx'
import Categorias from './paginas/Categorias.jsx'
import ListaCategorias from './paginas/ListaCategorias.jsx'
import Categoria from './paginas/Categoria.jsx'

// TODO (paso 9): deja Inicio y NoEncontrada como están y carga las demás
// páginas con lazy(() => import('./paginas/….jsx')), cada una declarada aquí,
// en lo alto del módulo, nunca dentro de un componente.

export default function App() {
  // TODO (paso 2): sustituye este aviso por el árbol de rutas:
  //   - una ruta sin path con <Maquetacion /> que envuelva a todas las demás;
  //   - la ruta índice con <Inicio />;
  //   - buscar con <Buscar /> y receta/:id con <Receta />;
  //   - categorias con <Categorias />, y dentro de ella, su índice con
  //     <ListaCategorias /> y :nombre con <Categoria />;
  //   - * con <NoEncontrada />, también dentro de la maquetación.
  return (
    <main className="seccion-contenido">
      <h1>Recetario</h1>
      <p>Aquí irán las rutas. Empieza por el paso 1, en src/main.jsx.</p>
    </main>
  )
}
