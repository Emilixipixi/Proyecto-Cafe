import { useParams, Link } from 'react-router'
import { productores } from '../data/producers'
import { cafes } from '../data/coffees'
import { concursos } from '../data/contests'
import CoffeeCard from '../components/CoffeeCard'
import Badge from '../components/Badge'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'

function DetalleProductor() {
  const { id } = useParams<{ id: string }>()
  const productor = productores.find((p) => p.id === id)

  if (!productor) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <EmptyState
          titulo="Productor no encontrado"
          descripcion="El productor que buscás no existe o fue removido del directorio."
          accion={
            <Link to="/productores">
              <Button variant="outline">Volver al directorio</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const cafesDelProductor = cafes.filter((c) => c.productorId === productor.id)
  const participaciones = concursos
    .map((concurso) => ({
      concurso,
      puesto: concurso.ranking.find((r) => r.productorId === productor.id),
    }))
    .filter((item) => item.puesto !== undefined)

  return (
    <div>
      <div className="relative h-72">
        <img src={productor.fotografia} alt={productor.nombre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cafe-profundo/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-6">
          <h1 className="font-display text-3xl text-crema">{productor.nombre}</h1>
          <p className="text-crema/80">{productor.finca} · {productor.ubicacion}, {productor.provincia}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl text-cafe-profundo mb-3">Historia</h2>
          <p className="text-sm text-gris-oscuro/80 leading-relaxed mb-8">{productor.historia}</p>

          <h2 className="font-display text-xl text-cafe-profundo mb-4">
            Cafés de {productor.nombre} ({cafesDelProductor.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cafesDelProductor.map((cafe) => (
              <CoffeeCard key={cafe.id} cafe={cafe} productor={productor} />
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white border border-beige-cafe/40 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gris-oscuro/50 mb-3">Ficha técnica</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gris-oscuro/60">Altitud</dt>
                <dd className="font-medium text-cafe-profundo">{productor.altitud} msnm</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gris-oscuro/60">Puntaje</dt>
                <dd className="font-medium text-dorado">{productor.puntaje} pts</dd>
              </div>
            </dl>
            <div className="mt-3">
              <span className="text-gris-oscuro/60 text-xs block mb-1">Variedades</span>
              <div className="flex flex-wrap gap-1.5">
                {productor.variedades.map((v) => <Badge key={v} variant="info">{v}</Badge>)}
              </div>
            </div>
            <div className="mt-3">
              <span className="text-gris-oscuro/60 text-xs block mb-1">Procesos</span>
              <div className="flex flex-wrap gap-1.5">
                {productor.procesos.map((p) => <Badge key={p} variant="info">{p}</Badge>)}
              </div>
            </div>
          </div>

          {participaciones.length > 0 && (
            <div className="bg-white border border-beige-cafe/40 rounded-xl p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gris-oscuro/50 mb-3">
                Concursos y puntajes
              </h3>
              <ul className="space-y-2 text-sm">
                {participaciones.map(({ concurso, puesto }) => (
                  <li key={concurso.id} className="flex justify-between">
                    <span className="text-gris-oscuro/70">{concurso.nombre} {concurso.anio}</span>
                    <span className="font-semibold text-dorado">#{puesto!.posicion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {productor.premios.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gris-oscuro/50 mb-2">Premios</h3>
              <ul className="space-y-1 text-sm text-gris-oscuro/70">
                {productor.premios.map((premio) => <li key={premio}>🏆 {premio}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetalleProductor