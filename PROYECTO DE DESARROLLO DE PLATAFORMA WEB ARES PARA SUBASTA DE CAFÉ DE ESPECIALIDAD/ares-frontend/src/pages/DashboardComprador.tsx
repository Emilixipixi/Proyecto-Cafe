import { Link } from 'react-router'
import { useAuth } from '../hooks/AuthContext'
import { muestras } from '../data/samples'
import { ofertas } from '../data/bids'
import { cafes } from '../data/coffees'
import { productores } from '../data/producers'
import { subastas } from '../data/auctions'
import { obtenerGanador, obtenerSubastaDeCafe } from '../utils/subastas'
import { formatearFecha, formatearPrecio } from '../utils/formatters'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Countdown from '../components/Countdown'
import EmptyState from '../components/EmptyState'
import DashboardCard from '../components/DashboardCard'
import type { Muestra, EstadoMuestra } from '../types'

const badgePorEstadoMuestra: Record<EstadoMuestra, 'info' | 'warning' | 'success' | 'error'> = {
  solicitada: 'info',
  preparando: 'warning',
  enviada: 'warning',
  entregada: 'success',
  cancelada: 'error',
}

function DashboardComprador() {
  const { usuario } = useAuth()
  const compradorId = usuario!.compradorId!

  const misMuestras = muestras.filter((m) => m.compradorId === compradorId)

  const cafesIdsOfertados = Array.from(new Set(ofertas.filter((o) => o.compradorId === compradorId).map((o) => o.cafeId)))
  const misOfertasPorCafe = cafesIdsOfertados.map((cafeId) => {
    const ofertasEnEsteCafe = ofertas.filter((o) => o.cafeId === cafeId && o.compradorId === compradorId)
    const miMejorOferta = ofertasEnEsteCafe.reduce((mayor, actual) => (actual.monto > mayor.monto ? actual : mayor))
    const ganador = obtenerGanador(cafeId)
    const subasta = obtenerSubastaDeCafe(cafeId)!
    const estoyGanando = ganador?.compradorId === compradorId

    let estado: string
    if (subasta.estado === 'finalizada') estado = estoyGanando ? 'Ganada' : 'Perdida'
    else if (subasta.estado === 'en_vivo') estado = estoyGanando ? 'Ganando' : 'Superado'
    else estado = 'Pendiente'

    return { cafeId, subasta, monto: miMejorOferta.monto, estado }
  })

  const subastasGanadas = misOfertasPorCafe.filter((item) => item.estado === 'Ganada')
  const ofertasActivas = misOfertasPorCafe.filter((item) => item.estado === 'Ganando' || item.estado === 'Superado')
  const proximasSubastas = subastas.filter((s) => s.estado === 'programada' || s.estado === 'en_vivo')
  const proximaSubasta = proximasSubastas[0]

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-cafe-profundo mb-1">Hola, {usuario?.nombre}</h1>
      <p className="text-sm text-gris-oscuro/60 mb-8">Este es el resumen de tu actividad en ARES.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <DashboardCard etiqueta="Próximas subastas" valor={proximasSubastas.length} />
        <DashboardCard etiqueta="Muestras solicitadas" valor={misMuestras.length} />
        <DashboardCard etiqueta="Ofertas activas" valor={ofertasActivas.length} />
        <DashboardCard etiqueta="Subastas ganadas" valor={subastasGanadas.length} destacado />
      </div>

      {proximaSubasta && (
        <div className="bg-white border border-beige-cafe/40 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-cafe-profundo mb-3">Próxima subasta</h2>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium text-cafe-profundo">{proximaSubasta.nombre}</p>
              <p className="text-sm text-gris-oscuro/60">{formatearFecha(proximaSubasta.fecha)} · {proximaSubasta.hora}</p>
            </div>
            <Countdown fechaObjetivo={new Date(`${proximaSubasta.fecha}T${proximaSubasta.hora}`)} />
            <Link to={`/subastas/${proximaSubasta.id}`}>
              <span className="text-sm font-medium text-verde-bosque hover:underline">Ver subasta →</span>
            </Link>
          </div>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-cafe-profundo mb-3">Mis muestras</h2>
        {misMuestras.length === 0 ? (
          <EmptyState titulo="Sin muestras solicitadas" descripcion="Explorá el catálogo y solicitá tu primera muestra." />
        ) : (
          <Table
            columnas={[
              { header: 'Café', render: (m: Muestra) => cafes.find((c) => c.id === m.cafeId)?.nombre },
              { header: 'Productor', render: (m: Muestra) => productores.find((p) => p.id === cafes.find((c) => c.id === m.cafeId)?.productorId)?.nombre },
              { header: 'Fecha', render: (m: Muestra) => formatearFecha(m.fecha) },
              { header: 'Estado', render: (m: Muestra) => <Badge variant={badgePorEstadoMuestra[m.estado]}>{m.estado}</Badge> },
            ]}
            datos={misMuestras}
            claveFila={(m) => m.id}
          />
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-cafe-profundo mb-3">Mis ofertas</h2>
        {misOfertasPorCafe.length === 0 ? (
          <EmptyState titulo="Sin ofertas realizadas" descripcion="Participá en una subasta en vivo para ver tus ofertas acá." />
        ) : (
          <Table
            columnas={[
              { header: 'Café', render: (item: typeof misOfertasPorCafe[0]) => cafes.find((c) => c.id === item.cafeId)?.nombre },
              { header: 'Subasta', render: (item: typeof misOfertasPorCafe[0]) => item.subasta.nombre },
              { header: 'Mi oferta', render: (item: typeof misOfertasPorCafe[0]) => formatearPrecio(item.monto) },
              {
                header: 'Estado',
                render: (item: typeof misOfertasPorCafe[0]) => (
                  <Badge variant={item.estado === 'Ganada' || item.estado === 'Ganando' ? 'success' : item.estado === 'Perdida' ? 'error' : 'info'}>
                    {item.estado}
                  </Badge>
                ),
              },
            ]}
            datos={misOfertasPorCafe}
            claveFila={(item) => item.cafeId}
          />
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-cafe-profundo mb-3">Subastas ganadas</h2>
        {subastasGanadas.length === 0 ? (
          <EmptyState titulo="Todavía no ganaste ninguna subasta" descripcion="Cuando ganes una puja, la vas a ver reflejada acá." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subastasGanadas.map((item) => {
              const cafe = cafes.find((c) => c.id === item.cafeId)!
              const productor = productores.find((p) => p.id === cafe.productorId)!
              return (
                <div key={item.cafeId} className="bg-white border border-dorado/40 rounded-xl p-5">
                  <Badge variant="gold">Ganada</Badge>
                  <h3 className="font-display text-lg text-cafe-profundo mt-2">{cafe.nombre}</h3>
                  <p className="text-sm text-gris-oscuro/60 mb-2">{productor.nombre}</p>
                  <p className="text-xl font-bold text-dorado">{formatearPrecio(item.monto)}</p>
                  <p className="text-xs text-gris-oscuro/50">{formatearFecha(item.subasta.fecha)}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardComprador