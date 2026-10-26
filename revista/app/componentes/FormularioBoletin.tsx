import { Form } from 'react-router'

/** El boletín, en el pie de todas las páginas. */
export default function FormularioBoletin() {
  // TODO (paso 7): con Form, apuntarse es una navegación: te saca del artículo
  // que estabas leyendo y te lleva a /boletin. Cámbialo por un fetcher
  // (useFetcher<typeof action>() y fetcher.Form, con
  // defaultShouldRevalidate={false}):
  //   - mientras se envía, el botón dice «Apuntándote…» y está desactivado;
  //   - lo que responde la action (fetcher.data) sale en el párrafo de estado:
  //     `Hecho: te escribiremos a ${correo}.` o el error, y con error el campo
  //     lleva aria-invalid y aria-describedby="boletin-respuesta";
  //   - cuando va bien, el campo se vacía.
  return (
    <Form method="post" action="/boletin" noValidate className="boletin">
      <label htmlFor="boletin-correo">Recibe el boletín: un correo al mes con los artículos nuevos</label>
      <div className="boletin-fila">
        <input id="boletin-correo" name="correo" type="email" autoComplete="email" required />
        <button type="submit">Apuntarme</button>
      </div>
      <p id="boletin-respuesta" role="status" className="boletin-respuesta" />
    </Form>
  )
}
