import type { EstadoSubasta } from '../types'
import Badge from './Badge'

type VarianteBadge = 'info' | 'live' | 'success' | 'error' | 'warning'

const configPorEstado: Record<EstadoSubasta, { variante: VarianteBadge; etiqueta: string }> = {
  borrador: { variante: 'info', etiqueta: 'Borrador' },
  programada: { variante: 'info', etiqueta: 'Programada' },
  en_vivo: { variante: 'live', etiqueta: 'En vivo' },
  finalizada: { variante: 'success', etiqueta: 'Finalizada' },
  cancelada: { variante: 'error', etiqueta: 'Cancelada' },
}

interface AuctionStatusProps {
  estado: EstadoSubasta
}

function AuctionStatus({ estado }: AuctionStatusProps) {
  const config = configPorEstado[estado]
  return <Badge variant={config.variante}>{config.etiqueta}</Badge>
}

export default AuctionStatus