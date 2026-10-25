import { useSyncExternalStore } from 'react'
import { leerResumen, suscribirCadaSegundo } from '../medidas'

function ms(valor: number): string {
  return `${valor.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ms`
}

// Lo que mide el <Profiler> que envuelve la tabla, resumido cada segundo.
// Está fuera del Profiler: si estuviera dentro, sus propios renders
// contarían como renders de la tabla.
export default function Medidor() {
  const resumen = useSyncExternalStore(suscribirCadaSegundo, leerResumen)
  const sinProfiler = import.meta.env.PROD && !import.meta.env.MODE.startsWith('perfil')

  return (
    <section className="medidor" aria-labelledby="titulo-medidor">
      <h2 id="titulo-medidor">Lo que cuesta la tabla</h2>
      <p className="medidor-build">
        {import.meta.env.DEV ? 'Desarrollo' : sinProfiler ? 'Producción' : 'Build de profiling'} · compilador{' '}
        {__COMPILADOR__ ? 'activado' : 'desactivado'}
      </p>
      {sinProfiler ? (
        <p>El build de producción normal no llama a onRender. Para medir, usa npm run dev o npm run medir.</p>
      ) : resumen === null ? (
        <p>Esperando los primeros commits…</p>
      ) : (
        <dl className="medidas">
          <div>
            <dt>Commits en 10 s</dt>
            <dd>{resumen.commits}</dd>
          </div>
          <div>
            <dt>Media por commit</dt>
            <dd>{ms(resumen.mediaReal)}</dd>
          </div>
          <div>
            <dt>El más lento</dt>
            <dd>{ms(resumen.maximaReal)}</dd>
          </div>
          <div>
            <dt>Sin saltarse nada</dt>
            <dd>{ms(resumen.mediaBase)}</dd>
          </div>
        </dl>
      )}
    </section>
  )
}
