import { Link } from 'react-router'
import { useAuth } from '../hooks/AuthContext'
import { cafes } from '../data/coffees'
import { productores } from '../data/producers'
import { concursos } from '../data/contests'
import { subastas } from '../data/auctions'
import { formatearFecha } from '../utils/formatters'
import Table from '../components/Table'
import Badge from '../components/Badge'
import DashboardCard from '../components/DashboardCard'
import Countdown from '../components/Countdown'
import EmptyState from '../components/EmptyState'
import type { Cafe, EstadoCafe } from '../types'

const badgePorEstadoCafe: Record<EstadoCafe, 'info' | 'success' | 'warning' | 'error'> = {
  disponible: 'success',
  en_subasta: 'warning',
  vendido: 'info',
  no_disponible: 'error',
}

function DashboardProductor() {
  const { usuario } = useAuth()
  const productorId = usuario!.productorId!
  const productor = productores.find((p) => p.id === productorId)!

  const misCafes = cafes.filter((c) => c.productorId === productorId)
  const cafesSeleccionados = misCafes.filter((c) => c.concursoId)
  const cafesEnSubasta = misCafes.filter((c) => c.estado === 'en_subasta')

  const misParticipaciones = concursos
    .map((concurso) => ({
      concurso,
      puesto: concurso.ranking.find((r) => r.productorId === productorId),
    }))
    .filter((item) => item.puesto !== undefined)

  const misIdsCafe = misCafes.map((c) => c.id)
  const proximasSubastasConMisCafes = subastas.filter(
    (s) => (s.estado === 'programada' || s.estado === 'en_vivo') && s.cafes.some((c) => misIdsCafe.includes(c.cafeId)),
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-cafe-profundo mb-1">Hola, {usuario?.nombre}</h1>
      <p className="text-sm text-gris-oscuro/60 mb-8">{productor.finca} · {productor.ubicacion}, {productor.provincia}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <DashboardCard etiqueta="Mis cafés" valor={misCafes.length} />
        <DashboardCard etiqueta="Cafés seleccionados" valor={cafesSeleccionados.length} />
        <DashboardCard etiqueta="En subasta" valor={cafesEnSubasta.length} />
        <DashboardCard etiqueta="Puntaje promedio" valor={productor.puntaje} destacado />
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-cafe-profundo mb-3">Mis cafés</h2>
        <Table
          columnas={[
            { header: 'Café', render: (cafe: Cafe) => cafe.nombre },
            { header: 'Variedad', render: (cafe: Cafe) => cafe.variedad },
            { header: 'Proceso', render: (cafe: Cafe) => cafe.proceso },
            { header: 'Puntaje', render: (cafe: Cafe) => <span className="text-dorado font-semibold">{cafe.puntaje}</span> },
            {
              header: 'Estado',
              render: (cafe: Cafe) => <Badge variant={badgePorEstadoCafe[cafe.estado]}>{cafe.estado.replace('_', ' ')}</Badge>,
            },
          ]}
          datos={misCafes}
          claveFila={(cafe) => cafe.id}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-lg font-semibold text-cafe-profundo mb-3">Concursos y puntajes</h2>
          {misParticipaciones.length === 0 ? (
            <EmptyState titulo="Sin participaciones registradas" descripcion="Tus concursos y puestos aparecerán acá." />
          ) : (
            <div className="bg-white border border-beige-cafe/40 rounded-xl p-5 space-y-3">
              {misParticipaciones.map(({ concurso, puesto }) => (
                <div key={concurso.id} className="flex items-center justify-between text-sm border-b border-beige-cafe/30 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-cafe-profundo">{concurso.nombre}</p>
                    <p className="text-gris-oscuro/50 text-xs">{concurso.anio}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-dorado font-bold text-lg">#{puesto!.posicion}</span>
                    <span className="text-xs text-gris-oscuro/50">{puesto!.puntaje} pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-cafe-profundo mb-3">Próximas subastas con mis cafés</h2>
          {proximasSubastasConMisCafes.length === 0 ? (
            <EmptyState titulo="Sin subastas próximas" descripcion="Cuando uno de tus cafés entre a subasta, lo verás acá." />
          ) : (
            <div className="space-y-3">
              {proximasSubastasConMisCafes.map((subasta) => (
                <div key={subasta.id} className="bg-white border border-beige-cafe/40 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-cafe-profundo text-sm">{subasta.nombre}</p>
                    <p className="text-xs text-gris-oscuro/50">{formatearFecha(subasta.fecha)} · {subasta.hora}</p>
                  </div>
                  <Countdown fechaObjetivo={new Date(`${subasta.fecha}T${subasta.hora}`)} />
                  <Link to={`/subastas/${subasta.id}`} className="text-sm text-verde-bosque hover:underline">
                    Ver →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardProductor