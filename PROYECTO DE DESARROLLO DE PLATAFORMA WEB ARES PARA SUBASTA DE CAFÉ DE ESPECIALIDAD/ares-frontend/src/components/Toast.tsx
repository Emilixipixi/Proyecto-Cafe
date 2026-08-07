import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'

interface ToastProps {
  tipo: 'success' | 'warning' | 'error' | 'info'
  mensaje: string
  onCerrar: () => void
}

const configPorTipo = {
  success: { icono: CheckCircle, color: 'text-verde-bosque', fondo: 'bg-verde-bosque/10' },
  warning: { icono: AlertTriangle, color: 'text-dorado', fondo: 'bg-dorado/10' },
  error: { icono: XCircle, color: 'text-red-600', fondo: 'bg-red-600/10' },
  info: { icono: Info, color: 'text-verde-oliva', fondo: 'bg-verde-oliva/10' },
}

function Toast({ tipo, mensaje, onCerrar }: ToastProps) {
  const { icono: Icono, color, fondo } = configPorTipo[tipo]

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-md bg-white border-l-4 ${fondo} animate-fade-in min-w-[300px]`}>
      <Icono size={20} className={color} />
      <p className="text-sm text-gris-oscuro flex-1">{mensaje}</p>
      <button onClick={onCerrar} className="text-gris-oscuro/40 hover:text-gris-oscuro">
        <X size={16} />
      </button>
    </div>
  )
}

export default Toast