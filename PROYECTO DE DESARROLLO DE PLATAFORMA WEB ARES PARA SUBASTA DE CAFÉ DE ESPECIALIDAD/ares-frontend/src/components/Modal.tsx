import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  abierto: boolean
  onCerrar: () => void
  titulo?: string
  children: ReactNode
}

function Modal({ abierto, onCerrar, titulo, children }: ModalProps) {
  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-cafe-profundo/60" onClick={onCerrar} />

      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          {titulo && <h3 className="text-xl font-display text-cafe-profundo">{titulo}</h3>}
          <button onClick={onCerrar} className="ml-auto text-gris-oscuro/60 hover:text-gris-oscuro">
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal