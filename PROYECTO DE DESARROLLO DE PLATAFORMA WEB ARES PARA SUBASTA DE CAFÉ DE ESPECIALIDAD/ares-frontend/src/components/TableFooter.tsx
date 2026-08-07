import Pagination from './Pagination'
import Select from './Select'

interface TableFooterProps {
  paginaActual: number
  totalPaginas: number
  onCambiarPagina: (pagina: number) => void
  porPagina: number
  onCambiarPorPagina: (valor: number) => void
  totalResultados: number
  inicio: number
}

function TableFooter({ paginaActual, totalPaginas, onCambiarPagina, porPagina, onCambiarPorPagina, totalResultados, inicio }: TableFooterProps) {
  const fin = Math.min(inicio + porPagina, totalResultados)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-beige-cafe/40 pt-4 mt-1">
      <p className="text-xs text-gris-oscuro/60">
        Mostrando {totalResultados === 0 ? 0 : inicio + 1}–{fin} de {totalResultados} resultados
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-gris-oscuro/60 w-28">
          Por página
          <Select
            value={String(porPagina)}
            onChange={(e) => onCambiarPorPagina(Number(e.target.value))}
            opciones={[
              { value: '10', label: '10' },
              { value: '25', label: '25' },
              { value: '50', label: '50' },
              { value: '100', label: '100' },
            ]}
            className="py-1.5 text-xs"
          />
        </div>
        <Pagination paginaActual={paginaActual} totalPaginas={totalPaginas} onCambiarPagina={onCambiarPagina} />
      </div>
    </div>
  )
}

export default TableFooter