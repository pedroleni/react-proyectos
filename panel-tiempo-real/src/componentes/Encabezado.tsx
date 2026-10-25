export const COLUMNAS = 6

// La fila de títulos, común a las dos tablas. En la virtual lleva aria-rowindex
// para que un lector de pantalla cuente bien las filas que faltan.
export default function Encabezado({ conIndices = false }: { conIndices?: boolean }) {
  return (
    <thead>
      <tr aria-rowindex={conIndices ? 1 : undefined}>
        <th scope="col" className="celda-favorito">
          <span className="solo-lectores">Favorito</span>
        </th>
        <th scope="col">Par</th>
        <th scope="col" className="celda-numero">
          Precio (USDT)
        </th>
        <th scope="col" className="celda-numero">
          24 h
        </th>
        <th scope="col" className="celda-numero celda-volumen">
          Volumen 24 h
        </th>
        <th scope="col" className="celda-grafico">
          Último minuto
        </th>
      </tr>
    </thead>
  )
}
