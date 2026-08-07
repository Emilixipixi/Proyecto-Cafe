import { productores } from '../data/producers'
import { cafes } from '../data/coffees'
import ProducerCard from '../components/ProducerCard'

function Productores() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl mb-6">Página: Productores</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productores.map((productor) => {
          const numeroCafes = cafes.filter((c) => c.productorId === productor.id).length
          return <ProducerCard key={productor.id} productor={productor} numeroCafes={numeroCafes} />
        })}
      </div>
    </div>
  )
}

export default Productores