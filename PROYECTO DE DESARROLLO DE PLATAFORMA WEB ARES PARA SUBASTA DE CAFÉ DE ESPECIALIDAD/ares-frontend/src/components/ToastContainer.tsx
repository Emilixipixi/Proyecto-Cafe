import Toast from './Toast'

interface ToastItem {
  id: number
  tipo: 'success' | 'warning' | 'error' | 'info'
  mensaje: string
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onCerrar: (id: number) => void
}

function ToastContainer({ toasts, onCerrar }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} tipo={toast.tipo} mensaje={toast.mensaje} onCerrar={() => onCerrar(toast.id)} />
      ))}
    </div>
  )
}

export default ToastContainer