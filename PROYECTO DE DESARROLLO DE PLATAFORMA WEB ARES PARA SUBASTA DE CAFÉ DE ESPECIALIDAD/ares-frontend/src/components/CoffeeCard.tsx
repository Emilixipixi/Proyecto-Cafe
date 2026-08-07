import { Link } from 'react-router'
import type { Cafe, Productor } from '../types'
import Badge from './Badge'
import Button from './Button'

interface CoffeeCardProps {
  cafe: Cafe
  productor: Productor
}

function CoffeeCard({ cafe, productor }: CoffeeCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-beige-cafe/40 hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img src={cafe.imagen} alt={cafe.nombre} className="w-full h-full object-cover" />
        {cafe.concursoId && (
          <div className="absolute top-3 right-3">
            <Badge variant="gold">Puesto #{cafe.posicionConcurso}</Badge>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg text-cafe-profundo mb-1">{cafe.nombre}</h3>
        <p className="text-sm text-gris-oscuro/70 mb-3">{productor.nombre} · {productor.ubicacion}</p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gris-oscuro/60 mb-4">
          <span>{cafe.altitud} msnm</span>
          <span>·</span>
          <span>{cafe.variedad}</span>
          <span>·</span>
          <span>{cafe.proceso}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-dorado font-semibold text-sm">{cafe.puntaje} pts</span>
          <Link to={`/cafes/${cafe.id}`}>
            <Button variant="outline" className="px-4 py-1.5 text-sm">Ver café</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CoffeeCard