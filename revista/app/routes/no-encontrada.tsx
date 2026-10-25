import { data, Link } from 'react-router'

// Una dirección que no es de ninguna otra ruta. El loader no tiene datos que
// dar, pero sí un estado HTTP: con data() la respuesta sale con un 404, y la
// página se pinta igual.
export function loader() {
  return data(null, { status: 404 })
}

export default function NoEncontrada() {
  return (
    <main className="no-encontrada">
      <title>Página no encontrada · Caja Baja</title>
      <meta name="robots" content="noindex" />
      <h1>Esta página no existe</h1>
      <p>Puede que la dirección esté mal escrita.</p>
      <p>
        <Link to="/">Volver a la portada</Link>
      </p>
    </main>
  )
}
