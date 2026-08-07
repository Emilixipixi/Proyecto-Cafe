import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  titulo: string
  descripcion?: string
  icono?: ReactNode
  accion?: ReactNode
}

function EmptyState({ titulo, descripcion, icono, accion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-beige-cafe mb-4">
        {icono || <Inbox size={48} />}
      </div>
      <h3 className="text-lg font-semibold text-cafe-profundo mb-1">{titulo}</h3>
      {descripcion && <p className="text-sm text-gris-oscuro/70 max-w-sm mb-4">{descripcion}</p>}
      {accion}
    </div>
  )
}

export default EmptyState