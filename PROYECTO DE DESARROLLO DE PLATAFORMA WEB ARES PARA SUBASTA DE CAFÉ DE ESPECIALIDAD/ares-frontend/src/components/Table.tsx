import type { ReactNode } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'

interface ColumnaTabla<T> {
  header: string
  render: (fila: T) => ReactNode
  sortKey?: string
}

interface TableProps<T> {
  columnas: ColumnaTabla<T>[]
  datos: T[]
  claveFila: (fila: T) => string | number
  columnaOrden?: string
  direccionOrden?: 'asc' | 'desc'
  onOrdenar?: (sortKey: string) => void
}

function Table<T>({ columnas, datos, claveFila, columnaOrden, direccionOrden, onOrdenar }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-beige-cafe/50">
      <table className="w-full text-sm">
        <thead className="bg-beige-cafe/30">
          <tr>
            {columnas.map((columna, indice) => {
              const esOrdenable = !!columna.sortKey && !!onOrdenar
              const activa = columnaOrden === columna.sortKey

              return (
                <th key={indice} className="px-4 py-3 text-left font-semibold text-cafe-profundo uppercase text-xs tracking-wide">
                  {esOrdenable ? (
                    <button
                      onClick={() => onOrdenar!(columna.sortKey!)}
                      className="flex items-center gap-1 hover:text-verde-bosque"
                    >
                      {columna.header}
                      {activa ? (
                        direccionOrden === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      ) : (
                        <ArrowUpDown size={12} className="opacity-40" />
                      )}
                    </button>
                  ) : (
                    columna.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila) => (
            <tr key={claveFila(fila)} className="border-t border-beige-cafe/30 hover:bg-crema/50">
              {columnas.map((columna, indice) => (
                <td key={indice} className="px-4 py-3 text-gris-oscuro">
                  {columna.render(fila)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table