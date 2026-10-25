import { formatoHora } from '../formato'
import type { EstadoConexion as Estado } from '../mercado/tipos'
import { useMercado } from '../mercado/useMercado'

const TEXTOS: Record<Estado, string> = {
  conectando: 'Conectando…',
  'en-directo': 'En directo',
  reconectando: 'Conexión perdida. Reconectando…',
}

export default function EstadoConexion() {
  // TODO (paso 3): lee del almacén, con useMercado y un selector para cada
  // uno, el estado de la conexión, la hora del último lote y cuántos pares
  // cambiaron en él (mercado.estado, mercado.ultimaHora y mercado.cambiosUltimoLote).
  const estado: Estado = 'conectando'
  const ultimaHora: number | null = null
  const cambios: number = 0

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
