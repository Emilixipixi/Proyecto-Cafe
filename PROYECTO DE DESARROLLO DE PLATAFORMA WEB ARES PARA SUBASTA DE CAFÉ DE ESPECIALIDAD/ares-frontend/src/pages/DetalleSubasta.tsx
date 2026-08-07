import { useParams, Link } from 'react-router'
import { subastas } from '../data/auctions'
import { cafes } from '../data/coffees'
import { productores } from '../data/producers'
import type { EstadoSubasta } from '../types'
import AuctionStatus from '../components/AuctionStatus'
import Countdown from '../components/Countdown'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import { formatearFecha, formatearPrecio } from '../utils/formatters'

const etiquetaBotonPorEstado: Record<EstadoSubasta, string> = {
  borrador: 'Subasta no disponible',
  programada: 'Aún no comienza',
  en_vivo: 'Entrar a la subasta',
  finalizada: 'Subasta finalizada',
  cancelada: 'Subasta cancelada',
}

function DetalleSubasta() {
  const { id } = useParams<{ id: string }>()
  const subasta = subastas.find((s) => s.id === id)

  if (!subasta) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <EmptyState
          titulo="Subasta no encontrada"
          descripcion="La subasta que buscás no existe o fue removida."
          accion={
            <Link to="/subastas">
              <Button variant="outline">Volver a subastas</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const fechaHora = new Date(`${subasta.fecha}T${subasta.hora}`)
  const mostrarCountdown = subasta.estado === 'programada' || subasta.estado === 'en_vivo'

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-3">
        <AuctionStatus estado={subasta.estado} />
        <span className="text-sm text-gris-oscuro/60">{subasta.cafes.length} cafés</span>
      </div>

      <h1 className="font-display text-3xl text-cafe-profundo mb-2">{subasta.nombre}</h1>
      <p className="text-gris-oscuro/60 mb-6">
        {formatearFecha(subasta.fecha)} · {subasta.hora}
      </p>

      {mostrarCountdown && (
        <div className="mb-8">
          <span className="text-xs text-gris-oscuro/50 block mb-1 uppercase tracking-wide">
            {subasta.estado === 'en_vivo' ? 'Tiempo restante' : 'Comienza en'}
          </span>
          <Countdown fechaObjetivo={fechaHora} />
        </div>
      )}

      {subasta.cafes.length === 0 ? (
        <EmptyState
          titulo="Sin cafés asignados"
          descripcion="Esta subasta todavía no tiene lotes de café asociados."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subasta.cafes.map((cafeSubasta) => {
            const cafe = cafes.find((c) => c.id === cafeSubasta.cafeId)!
            const productor = productores.find((p) => p.id === cafe.productorId)!

            return (
              <div key={cafe.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-beige-cafe/40">
                <img src={cafe.imagen} alt={cafe.nombre} className="w-full h-40 object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-lg text-cafe-profundo mb-1">{cafe.nombre}</h3>
                  <p className="text-sm text-gris-oscuro/60 mb-3">{productor.nombre}</p>

                  <div className="flex flex-wrap gap-x-3 text-xs text-gris-oscuro/60 mb-4">
                    <span>{cafe.variedad}</span>
                    <span>·</span>
                    <span>{cafe.proceso}</span>
                    <span>·</span>
                    <span className="text-dorado font-semibold">{cafe.puntaje} pts</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-beige-cafe/30 pt-3 mb-4">
                    <div>
                      <span className="text-gris-oscuro/50 text-xs block">Oferta actual</span>
                      <span className="text-xl font-bold text-verde-bosque">
                        {formatearPrecio(cafeSubasta.ofertaActual)}
                      </span>
                    </div>
                    <span className="text-xs text-gris-oscuro/50">{cafeSubasta.numeroOfertas} ofertas</span>
                  </div>

                  {subasta.estado === 'en_vivo' ? (
                    <Link to={`/subastas/${subasta.id}/sala/${cafe.id}`}>
                      <Button variant="primary" className="w-full">
                        {etiquetaBotonPorEstado[subasta.estado]}
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      {etiquetaBotonPorEstado[subasta.estado]}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DetalleSubasta