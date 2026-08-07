import type { ReactNode } from 'react'
import { Search, X, Download, FileText, RotateCcw } from 'lucide-react'
import Input from './Input'

interface AdminToolbarProps {
  busqueda: string
  onBusquedaChange: (valor: string) => void
  placeholderBusqueda: string
  hayFiltrosActivos: boolean
  onLimpiarFiltros: () => void
  onExportarExcel: () => void
  onExportarPDF: () => void
  onRecargar: () => void
  children?: ReactNode
}

function AdminToolbar({
  busqueda,
  onBusquedaChange,
  placeholderBusqueda,
  hayFiltrosActivos,
  onLimpiarFiltros,
  onExportarExcel,
  onExportarPDF,
  onRecargar,
  children,
}: AdminToolbarProps) {
  return (
    <div className="bg-white border border-beige-cafe/50 rounded-xl p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-oscuro/40" />
          <Input
            placeholder={placeholderBusqueda}
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="pl-11"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExportarExcel}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-beige-cafe text-gris-oscuro/70 hover:bg-beige-cafe/20"
          >
            <Download size={14} /> Excel
          </button>
          <button
            onClick={onExportarPDF}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-beige-cafe text-gris-oscuro/70 hover:bg-beige-cafe/20"
          >
            <FileText size={14} /> PDF
          </button>
          <button
            onClick={onRecargar}
            title="Recargar"
            className="p-2 rounded-lg border border-beige-cafe text-gris-oscuro/70 hover:bg-beige-cafe/20"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {children && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">{children}</div>}

      {hayFiltrosActivos && (
        <button onClick={onLimpiarFiltros} className="flex items-center gap-1 text-xs text-red-600 hover:underline mt-3">
          <X size={13} /> Limpiar filtros
        </button>
      )}
    </div>
  )
}

export default AdminToolbar