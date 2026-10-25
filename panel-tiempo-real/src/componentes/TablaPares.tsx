import { useFavoritos } from '../favoritos'
import { filtrarYOrdenar, type Orden } from '../mercado/filtrar'
import type { Par } from '../mercado/tipos'
import { useMercado } from '../mercado/useMercado'
import TablaCompleta from './TablaCompleta'
import TablaVirtual from './TablaVirtual'

interface TablaParesProps {
  busqueda: string
  orden: Orden
  soloFavoritos: boolean
  virtual: boolean
}

export default function TablaPares({ busqueda, orden, soloFavoritos, virtual }: TablaParesProps) {
  // TODO (paso 4): lee la lista de pares del almacén con useMercado (mercado.lista),
  // los favoritos con useFavoritos() y calcula los visibles con filtrarYOrdenar.
  const lista: readonly Par[] = []
  const favoritos: ReadonlySet<string> = new Set()
  const visibles: Par[] = []

  if (lista.length === 0) {
    return <p className="mensaje-estado">Esperando los primeros datos del mercado…</p>
  }

  return (
    <>
      <p className="recuento">
        {visibles.length} de {lista.length} pares
      </p>
      {visibles.length === 0 ? (
        <p className="mensaje-estado">
          {soloFavoritos
            ? 'No hay favoritos que coincidan con la búsqueda.'
            : 'No hay pares que coincidan con la búsqueda.'}
        </p>
      ) : virtual ? (
        <TablaVirtual pares={visibles} favoritos={favoritos} />
      ) : (
        <TablaCompleta pares={visibles} favoritos={favoritos} />
      )}
    </>
  )
}
