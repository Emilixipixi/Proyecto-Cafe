import { Trophy } from 'lucide-react'
import { Link } from 'react-router'
import Button from './Button'
import { formatearPrecio } from '../utils/formatters'

interface AuctionWinnerProps {
  nombreCafe: string
  etiquetaGanador: string
  montoGanador: number
  esUsuarioActual: boolean
  cafeId: string
}

const particulas = Array.from({ length: 14 }, (_, i) => ({
  izquierda: Math.random() * 100,
  demora: Math.random() * 0.6,
  color: i % 2 === 0 ? 'bg-dorado' : 'bg-beige-cafe',
}))

function AuctionWinner({ nombreCafe, etiquetaGanador, montoGanador, esUsuarioActual, cafeId }: AuctionWinnerProps) {
  return (
    <div className="relative bg-cafe-profundo rounded-xl p-10 md:p-16 text-center overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-full pointer-events-none">
        {particulas.map((particula, indice) => (
          <span
            key={indice}
            className={`absolute top-0 w-2 h-2 rounded-full ${particula.color} animate-confeti`}
            style={{ left: `${particula.izquierda}%`, animationDelay: `${particula.demora}s` }}
          />
        ))}
      </div>

      <div className="relative">
        <Trophy size={44} className="text-dorado mx-auto mb-4" />

        <span className="text-crema/60 text-xs uppercase tracking-widest">Subasta finalizada</span>
        <h2 className="font-display text-2xl text-crema mt-2 mb-8">{nombreCafe}</h2>

        <div className="mb-8">
          <span className="text-crema/60 text-xs uppercase tracking-widest block mb-1">Ganador</span>
          {esUsuarioActual ? (
            <p className="font-display text-3xl font-bold text-dorado">¡Ganaste esta subasta!</p>
          ) : (
            <p className="font-display text-2xl font-bold text-crema">{etiquetaGanador}</p>
          )}
        </div>

        <div className="mb-10">
          <span className="text-crema/60 text-xs uppercase tracking-widest block mb-1">Oferta ganadora</span>
          <p className="font-display text-4xl font-bold text-dorado">{formatearPrecio(montoGanador)} / kg</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/cafes/${cafeId}`}>
            <Button variant="secondary">Ver ficha del café</Button>
          </Link>
          {esUsuarioActual && (
            <Link to="/dashboard/comprador">
              <Button variant="outline" className="border-crema text-crema hover:bg-crema hover:text-cafe-profundo">
                Ver mis subastas ganadas
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuctionWinner