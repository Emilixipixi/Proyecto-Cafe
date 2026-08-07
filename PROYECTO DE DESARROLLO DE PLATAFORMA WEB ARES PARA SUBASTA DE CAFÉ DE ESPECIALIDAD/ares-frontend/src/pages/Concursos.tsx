import { concursos } from '../data/contests'
import { cafes } from '../data/coffees'
import { productores } from '../data/producers'

function Concursos() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl mb-4">Página: Concursos</h1>

      {concursos.map((concurso) => (
        <div key={concurso.id}>
          <h3 className="text-xl font-semibold mb-1">{concurso.nombre} ({concurso.anio})</h3>
          <p className="text-sm text-gris-oscuro/60 mb-3">{concurso.descripcion}</p>
          <ol className="space-y-1 text-sm">
            {concurso.ranking.map((puesto) => {
              const cafe = cafes.find((c) => c.id === puesto.cafeId)
              const productor = productores.find((p) => p.id === puesto.productorId)
              return (
                <li key={puesto.posicion}>
                  <strong>#{puesto.posicion}</strong> — {cafe?.nombre} — {productor?.nombre} ({puesto.puntaje} pts)
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </div>
  )
}

export default Concursos