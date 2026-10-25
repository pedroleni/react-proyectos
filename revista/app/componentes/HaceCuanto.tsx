import { haceCuanto } from '~/fechas'
import { useAhora } from '~/reloj'

/**
 * «· anteayer», «· hace 3 semanas». Solo lo sabe el navegador: el servidor
 * no pinta nada, y el texto aparece justo después de hidratar.
 */
export default function HaceCuanto({ fecha }: { fecha: string }) {
  const ahora = useAhora()
  if (ahora === null) return null
  return <span className="hace-cuanto"> · {haceCuanto(fecha, ahora)}</span>
}
