import { Link } from 'react-router'
import type { Route } from './+types/boletin'

// TODO (paso 7): la action, que llama el formulario del pie desde cualquier
// página. Comprueba el correo con validarSuscripcion (de ~/datos/boletin.server):
// si no vale, devuelve el resultado con data(resultado, { status: 400 }); si
// vale, apúntalo con apuntarAlBoletin y devuelve el resultado tal cual. Sin
// redirect: quien se apunta se queda donde estaba.

// Sin JavaScript, el formulario del pie es un <form> normal: el navegador
// acaba en /boletin y esta página enseña lo que respondió la action.
export default function PaginaBoletin({ actionData }: Route.ComponentProps) {
  return (
    <main className="pagina-boletin">
      <title>Boletín · Caja Baja</title>
      <meta name="robots" content="noindex" />
      <h1>El boletín de Caja Baja</h1>
      {actionData?.ok ? (
        <p role="status">Hecho: te escribiremos a {actionData.correo} cada vez que salga un número.</p>
      ) : actionData ? (
        <p role="alert">{actionData.error} Vuelve a intentarlo en el formulario del pie.</p>
      ) : (
        <p>Un correo al mes con los artículos nuevos. Te apuntas en el formulario del pie de cualquier página.</p>
      )}
      <p>
        <Link to="/">Volver a la portada</Link>
      </p>
    </main>
  )
}
