import { data, Link } from 'react-router'
import { apuntarAlBoletin, validarSuscripcion } from '~/datos/boletin.server'
import type { Route } from './+types/boletin'

// La llama el formulario del pie, desde cualquier página. Responde con datos y
// no con una redirección: quien se apunta se queda donde estaba.
export async function action({ request }: Route.ActionArgs) {
  const resultado = validarSuscripcion(await request.formData())
  if (!resultado.ok) return data(resultado, { status: 400 })
  await apuntarAlBoletin(resultado.correo)
  return resultado
}

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
