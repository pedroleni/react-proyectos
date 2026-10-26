import { haceCuanto } from '~/fechas'

/** «· anteayer», «· hace 3 semanas»: cuánto hace que se publicó. */
export default function HaceCuanto({ fecha }: { fecha: string }) {
  // TODO (paso 9): el servidor no sabe cuándo vas a leer la página. Si el HTML
  // se generó antes (una caché, un prerenderizado), la hidratación falla.
  // Lee el instante con useAhora() de ~/reloj: null en el servidor y al
  // hidratar (y entonces no pintes nada), y la hora del navegador después.
  return <span className="hace-cuanto"> · {haceCuanto(fecha, Date.now())}</span>
}
