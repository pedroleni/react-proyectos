import { Link } from 'react-router'

// Una dirección que no es de ninguna otra ruta.
// TODO (paso 3): la página dice «no existe», pero la respuesta sale con un
// 200. Exporta un loader que devuelva data(null, { status: 404 }).

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
