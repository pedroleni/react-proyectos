import { Route, Routes, type Location } from 'react-router'
import Cuadricula from './Cuadricula'
import Detalle from './Detalle'
import NoEncontrada from './NoEncontrada'

// Las rutas de la pestaña Galería. No se casan con la URL del navegador, sino
// con la última ubicación de la galería: así, mientras estás en otra pestaña,
// la galería sigue enseñando (escondida) la foto que dejaste abierta.
export default function Galeria({ ubicacion }: { ubicacion: Location }) {
  return (
    <Routes location={ubicacion}>
      <Route path="/" element={<Cuadricula />} />
      <Route path="/foto/:id" element={<Detalle />} />
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  )
}
