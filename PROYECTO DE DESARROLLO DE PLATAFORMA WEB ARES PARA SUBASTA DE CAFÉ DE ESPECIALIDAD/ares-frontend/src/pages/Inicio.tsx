import { Link } from 'react-router'
import { cafes } from '../data/coffees'
import { productores } from '../data/producers'
import { subastas } from '../data/auctions'
import { concursos } from '../data/contests'
import CoffeeCard from '../components/CoffeeCard'
import ProducerCard from '../components/ProducerCard'
import AuctionCard from '../components/AuctionCard'
import Button from '../components/Button'

const cafesDestacados = [...cafes].sort((a, b) => b.puntaje - a.puntaje).slice(0, 6)
const productoresDestacados = productores.filter((productor) => productor.premios.length > 0).slice(0, 4)
const proximasSubastas = subastas
  .filter((subasta) => subasta.estado === 'programada' || subasta.estado === 'en_vivo')
  .slice(0, 3)
const tazaDorada = concursos.find((concurso) => concurso.id === 'concurso-taza-dorada-2025')!

const colorPorPosicion: Record<number, string> = {
  1: 'text-dorado',
  2: 'text-gris-oscuro/70',
  3: 'text-beige-cafe',
}

const pasos = [
  { numero: '01', titulo: 'Descubre los cafés', descripcion: 'Explora un catálogo curado de cafés de especialidad de la provincia de Loja.' },
  { numero: '02', titulo: 'Conoce al productor', descripcion: 'Cada café tiene una historia y un productor detrás. Conocé su finca y su proceso.' },
  { numero: '03', titulo: 'Solicita una muestra', descripcion: 'Pedí una muestra física antes de comprometerte con una compra mayor.' },
  { numero: '04', titulo: 'Evalúa el café', descripcion: 'Catá el café y confirmá que cumple con el perfil que buscás.' },
  { numero: '05', titulo: 'Participa en la subasta', descripcion: 'Ofertá en tiempo real por los lotes que más te interesen.' },
  { numero: '06', titulo: 'Adquiere cafés excepcionales', descripcion: 'Cerrá la compra y recibí café de especialidad directo del productor.' },
]

function Inicio() {
  return (
    <div>
      <section className="relative h-[560px] flex items-center">
        <img
          src="https://picsum.photos/seed/ares-hero-cafetal/1600/900"
          alt="Cafetal en las montañas de Loja"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cafe-profundo/60" />

        <div className="relative max-w-3xl mx-auto text-center px-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-crema mb-4">
            El origen del café de especialidad ecuatoriano
          </h1>
          <p className="text-lg text-crema/85 mb-8">
            Conectamos productores excepcionales con compradores que buscan cafés extraordinarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cafes">
              <Button variant="secondary" className="px-8 py-3">Explorar cafés</Button>
            </Link>
            <Link to="/subastas">
              <Button variant="outline" className="px-8 py-3 border-crema text-crema hover:bg-crema hover:text-cafe-profundo">
                Ver próximas subastas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl text-cafe-profundo">Cafés destacados</h2>
          <Link to="/cafes" className="text-sm font-medium text-verde-bosque hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cafesDestacados.map((cafe) => {
            const productor = productores.find((p) => p.id === cafe.productorId)!
            return <CoffeeCard key={cafe.id} cafe={cafe} productor={productor} />
          })}
        </div>
      </section>

      <section className="bg-beige-cafe/20 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl text-cafe-profundo">Productores destacados</h2>
            <Link to="/productores" className="text-sm font-medium text-verde-bosque hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productoresDestacados.map((productor) => {
              const numeroCafes = cafes.filter((c) => c.productorId === productor.id).length
              return <ProducerCard key={productor.id} productor={productor} numeroCafes={numeroCafes} />
            })}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl text-cafe-profundo">Próximas subastas</h2>
          <Link to="/subastas" className="text-sm font-medium text-verde-bosque hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {proximasSubastas.map((subasta) => (
            <AuctionCard key={subasta.id} subasta={subasta} />
          ))}
        </div>
      </section>

      <section className="bg-cafe-profundo py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-dorado text-xs font-semibold uppercase tracking-widest">Concurso destacado</span>
          <h2 className="font-display text-3xl text-crema mt-2 mb-3">{tazaDorada.nombre} {tazaDorada.anio}</h2>
          <p className="text-crema/70 mb-10 max-w-xl mx-auto">{tazaDorada.descripcion}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {tazaDorada.ranking.slice(0, 3).map((puesto) => {
              const cafe = cafes.find((c) => c.id === puesto.cafeId)
              const productor = productores.find((p) => p.id === puesto.productorId)
              return (
                <div key={puesto.posicion} className="bg-crema/5 border border-crema/10 rounded-xl p-6">
                  <span className={`text-3xl font-display font-bold ${colorPorPosicion[puesto.posicion]}`}>
                    #{puesto.posicion}
                  </span>
                  <h3 className="text-crema font-semibold mt-2">{cafe?.nombre}</h3>
                  <p className="text-sm text-crema/60">{productor?.nombre}</p>
                  <p className="text-dorado text-sm font-semibold mt-2">{puesto.puntaje} pts</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl text-cafe-profundo text-center mb-12">Cómo funciona</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pasos.map((paso) => (
            <div key={paso.numero}>
              <span className="font-display text-4xl text-dorado font-bold">{paso.numero}</span>
              <h3 className="text-lg font-semibold text-cafe-profundo mt-2 mb-1">{paso.titulo}</h3>
              <p className="text-sm text-gris-oscuro/70">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-verde-bosque py-16">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="font-display text-3xl text-crema mb-6">Forma parte de la comunidad ARES</h2>
          <Link to="/registro">
            <Button variant="secondary" className="px-8 py-3">Registrarme</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Inicio