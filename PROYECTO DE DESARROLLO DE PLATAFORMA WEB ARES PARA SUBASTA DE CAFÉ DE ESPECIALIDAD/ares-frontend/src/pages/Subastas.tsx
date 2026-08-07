import { subastas } from '../data/auctions'
import { ofertas } from '../data/bids'
import { numeroCompradorPublico } from '../utils/formatters'
import AuctionCard from '../components/AuctionCard'
import BidCard from '../components/BidCard'

function Subastas() {
  const historialGeisha = ofertas
    .filter((oferta) => oferta.cafeId === 'cafe-06')
    .sort((a, b) => b.monto - a.monto)

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      <div>
        <h1 className="text-3xl mb-6">Página: Subastas</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subastas.map((subasta) => (
            <AuctionCard key={subasta.id} subasta={subasta} />
          ))}
        </div>
      </div>

      <div className="max-w-md">
        <h3 className="text-lg font-semibold mb-2">Historial — Geisha Lavado Los Naranjos</h3>
        <div className="space-y-1.5">
          {historialGeisha.map((oferta, indice) => (
            <BidCard
              key={oferta.id}
              monto={oferta.monto}
              etiquetaComprador={numeroCompradorPublico(oferta.compradorId)}
              destacado={indice === 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Subastas