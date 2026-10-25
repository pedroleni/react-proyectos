import { formatoHora } from '../formato'
import type { EstadoConexion as Estado } from '../mercado/tipos'
import { useMercado } from '../mercado/useMercado'

const TEXTOS: Record<Estado, string> = {
  conectando: 'Conectando…',
  'en-directo': 'En directo',
  reconectando: 'Conexión perdida. Reconectando…',
}

export default function EstadoConexion() {
  // Tres lecturas con su selector: cada una devuelve un texto o un número, y
  // React solo vuelve a renderizar si alguno es distinto del de antes.
  const estado = useMercado((mercado) => mercado.estado)
  const ultimaHora = useMercado((mercado) => mercado.ultimaHora)
  const cambios = useMercado((mercado) => mercado.cambiosUltimoLote)

  return (
    <div className="estado-conexion">
      {/* Solo el estado es una región viva: anunciar la hora cada segundo
          haría la página inservible con un lector de pantalla. */}
      <p role="status" className={`indicador ${estado}`}>
        {TEXTOS[estado]}
      </p>
      {ultimaHora !== null && (
        <p className="ultima-hora">
          {formatoHora(ultimaHora)} · {cambios} {cambios === 1 ? 'cambio' : 'cambios'}
        </p>
      )}
    </div>
  )
}
