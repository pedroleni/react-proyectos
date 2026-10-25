import Campo from './Campo'
import ResumenReserva, { type DatosResumen } from './ResumenReserva'
import type { Errores, Valores } from './tipos'

type Props = { datos: DatosResumen; valores: Valores; errores: Errores }

export default function PasoConfirmar({ datos, valores, errores }: Props) {
  return (
    <>
      <ResumenReserva datos={datos} />
      <Campo
        etiqueta="He leído y acepto las normas del refugio"
        ayuda="Silencio desde las 22:00, saco sábana obligatorio y cancelación gratuita hasta 48 horas antes."
        error={errores.acepto}
        enLinea
      >
        {(props) => <input type="checkbox" name="acepto" defaultChecked={valores.acepto === 'on'} {...props} />}
      </Campo>
    </>
  )
}
