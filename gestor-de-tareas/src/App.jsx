// Sustituye a main.js de la versión en JavaScript: no busca elementos, no
// registra listeners y no se suscribe a nada. Solo coloca la interfaz
// dentro del proveedor del estado.

import Cabecera from './componentes/Cabecera'
import Filtros from './componentes/Filtros'
import FormularioTarea from './componentes/FormularioTarea'
import ListaTareas from './componentes/ListaTareas'
import { ProveedorTareas } from './ProveedorTareas'

export default function App() {
  return (
    <ProveedorTareas>
      <main className="app">
        <Cabecera />
        <FormularioTarea />
        <Filtros />
        <ListaTareas />
      </main>
    </ProveedorTareas>
  )
}
