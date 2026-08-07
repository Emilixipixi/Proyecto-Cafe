import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { productores } from '../data/producers'
import { compradores } from '../data/buyers'
import { cafes } from '../data/coffees'
import { subastas } from '../data/auctions'
import { muestras } from '../data/samples'
import { ofertas } from '../data/bids'

import {
  compradoresRegistradosPorMes,
  participacionPorSubasta,
  cafesPorRegion,
  evolucionDeOfertas,
} from '../utils/estadisticas'
import DashboardCard from '../components/DashboardCard'

const COLOR_VERDE_BOSQUE = '#284C3B'
const COLOR_DORADO = '#B58A3A'
const COLOR_VERDE_OLIVA = '#6F7D45'
const COLORES_PIE = ['#284C3B', '#B58A3A', '#6F7D45', '#D8C3A5', '#2B1D17', '#8a9a6b', '#c9a86a', '#4a3529']

function DashboardAdmin() {
  const datosRegistros = compradoresRegistradosPorMes()
  const datosParticipacion = participacionPorSubasta()
  const datosRegion = cafesPorRegion()
  const datosEvolucion = evolucionDeOfertas()

  const subastasActivas = subastas.filter((s) => s.estado === 'en_vivo').length
  const subastasProximas = subastas.filter((s) => s.estado === 'programada').length
  const muestrasEnviadas = muestras.filter((m) => m.estado === 'enviada').length
  const compradoresSuscritos = compradores.filter((c) => c.suscripcion === 'premium').length
  const cafesPublicados = cafes.filter((c) => c.estado !== 'no_disponible').length
  const cafesPendientes = cafes.filter((c) => c.estado === 'no_disponible').length

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-cafe-profundo mb-1">Dashboard administrativo</h1>
      <p className="text-sm text-gris-oscuro/60 mb-8">Resumen general de la plataforma ARES.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        <DashboardCard etiqueta="Total de productores" valor={productores.length} />
        <DashboardCard etiqueta="Total de compradores" valor={compradores.length} />
        <DashboardCard etiqueta="Total de cafés" valor={cafes.length} />
        <DashboardCard etiqueta="Total de subastas" valor={subastas.length} />
        <DashboardCard etiqueta="Subastas activas" valor={subastasActivas} destacado />
        <DashboardCard etiqueta="Subastas próximas" valor={subastasProximas} />
        <DashboardCard etiqueta="Muestras solicitadas" valor={muestras.length} />
        <DashboardCard etiqueta="Muestras enviadas" valor={muestrasEnviadas} />
        <DashboardCard etiqueta="Compradores suscritos" valor={compradoresSuscritos} />
        <DashboardCard etiqueta="Cafés publicados" valor={cafesPublicados} />
        <DashboardCard etiqueta="Cafés pendientes" valor={cafesPendientes} />
        <DashboardCard etiqueta="Ofertas realizadas" valor={ofertas.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-beige-cafe/40 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-cafe-profundo mb-4">Compradores registrados por mes</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={datosRegistros}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D8C3A5" opacity={0.4} />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="cantidad" fill={COLOR_VERDE_BOSQUE} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-beige-cafe/40 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-cafe-profundo mb-4">Participación en subastas</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={datosParticipacion} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D8C3A5" opacity={0.4} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="nombre" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="participantes" fill={COLOR_DORADO} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-beige-cafe/40 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-cafe-profundo mb-4">Cafés por región (cantón)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={datosRegion} dataKey="cantidad" nameKey="region" cx="50%" cy="50%" outerRadius={80}>
                {datosRegion.map((_, indice) => (
                  <Cell key={indice} fill={COLORES_PIE[indice % COLORES_PIE.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-beige-cafe/40 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-cafe-profundo mb-4">Evolución de ofertas</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={datosEvolucion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D8C3A5" opacity={0.4} />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="cantidad" stroke={COLOR_VERDE_OLIVA} strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin