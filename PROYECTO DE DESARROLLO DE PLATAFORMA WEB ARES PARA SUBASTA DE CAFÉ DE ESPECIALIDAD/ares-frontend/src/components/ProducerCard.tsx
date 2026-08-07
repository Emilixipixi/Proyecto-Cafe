import { Link } from 'react-router'
import type { Productor } from '../types'
import Button from './Button'

interface ProducerCardProps {
  productor: Productor
  numeroCafes: number
}

function ProducerCard({ productor, numeroCafes }: ProducerCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-beige-cafe/40 hover:shadow-md transition-shadow text-center">
      <div className="h-40 overflow-hidden">
        <img src={productor.fotografia} alt={productor.nombre} className="w-full h-full object-cover" />
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg text-cafe-profundo">{productor.nombre}</h3>
        <p className="text-sm text-gris-oscuro/70 mb-1">{productor.finca}</p>
        <p className="text-xs text-gris-oscuro/50 mb-3">
          {productor.ubicacion}, {productor.provincia} · {productor.altitud} msnm
        </p>
        <p className="text-xs text-verde-bosque font-medium mb-4">
          {numeroCafes} {numeroCafes === 1 ? 'café disponible' : 'cafés disponibles'}
        </p>
        <Link to={`/productores/${productor.id}`}>
          <Button variant="outline" className="w-full py-2 text-sm">Ver productor</Button>
        </Link>
      </div>
    </div>
  )
}

export default ProducerCard