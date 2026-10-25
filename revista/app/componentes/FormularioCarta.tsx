import { Form } from 'react-router'
import type { CamposCarta } from '~/tipos'

type Resultado = {
  errores: Partial<Record<CamposCarta, string>>
  valores: Record<CamposCarta, string>
}

/**
 * El formulario de las cartas. Es un formulario HTML de verdad: sin
 * JavaScript, el navegador lo envía con un POST normal y el servidor responde
 * con la página entera. Con JavaScript, React Router lo intercepta y lo envía
 * sin recargar.
 */
export default function FormularioCarta({ resultado }: { resultado?: Resultado }) {
  // TODO (paso 5): pinta los errores que devuelve la action (resultado.errores)
  // debajo de cada campo, con aria-invalid y aria-describedby, rellena los
  // campos con lo que se escribió (resultado.valores, en defaultValue) y lleva
  // el foco al primer campo con error. Para que sin JavaScript se vean los
  // errores, el action del <Form> lleva el ancla #cartas.
  // TODO (paso 6): mientras se envía, el botón dice «Enviando…» y está
  // desactivado (useNavigation).

  return (
    <Form method="post" noValidate className="formulario-carta">
      <div className="campo">
        <label htmlFor="carta-nombre">Nombre</label>
        <input id="carta-nombre" name="nombre" autoComplete="name" required maxLength={60} />
      </div>

      <div className="campo">
        <label htmlFor="carta-correo">Correo (no se publica)</label>
        <input id="carta-correo" name="correo" type="email" autoComplete="email" required />
      </div>

      <div className="campo">
        <label htmlFor="carta-texto">Tu carta</label>
        <textarea id="carta-texto" name="texto" rows={5} required />
      </div>

      <button type="submit">Enviar la carta</button>
    </Form>
  )
}
