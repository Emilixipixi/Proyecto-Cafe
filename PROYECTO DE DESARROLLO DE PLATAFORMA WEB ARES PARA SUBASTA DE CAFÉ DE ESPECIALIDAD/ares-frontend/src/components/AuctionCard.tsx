import { Link } from 'react-router'
import type { Subasta } from '../types'
import { formatearFecha } from '../utils/formatters'
import AuctionStatus from './AuctionStatus'
import Countdown from './Countdown'
import Button from './Button'

interface AuctionCardProps {
  subasta: Subasta
}

function AuctionCard({ subasta }: AuctionCardProps) {
  const fechaHora = new Date(`${subasta.fecha}T${subasta.hora}`)
  const mostrarCountdown = subasta.estado === 'programada' || subasta.estado === 'en_vivo'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-beige-cafe/40 p-5">
      <div className="flex items-center justify-between mb-3">
        <AuctionStatus estado={subasta.estado} />
        <span className="text-xs text-gris-oscuro/50">{subasta.cafes.length} cafés</span>
      </div>

      <h3 className="font-display text-lg text-cafe-profundo mb-1">{subasta.nombre}</h3>
      <p className="text-sm text-gris-oscuro/60 mb-4">
        {formatearFecha(subasta.fecha)} · {subasta.hora}
      </p>

      {mostrarCountdown && (
        <div className="mb-4">
          <Countdown fechaObjetivo={fechaHora} />
        </div>
      )}

      <Link to={`/subastas/${subasta.id}`}>
        <Button variant="primary" className="w-full py-2 text-sm">Ver subasta</Button>
      </Link>
    </div>
  )
}

export default AuctionCard