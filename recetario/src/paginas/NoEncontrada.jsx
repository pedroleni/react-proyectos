import { Link } from 'react-router'

export default function NoEncontrada() {
  return (
    <section className="pagina-vacia">
      <title>Página no encontrada · Recetario</title>
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}
