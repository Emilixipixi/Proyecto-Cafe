import { NavLink } from 'react-router'
import {
  LayoutDashboard, History, Users, User, Coffee, Trophy,
  Package, Gavel, CreditCard, Wallet, FileBarChart, Settings, X,
} from 'lucide-react'
const enlaces = [
  { nombre: 'Dashboard', ruta: '/admin', icono: LayoutDashboard, fin: true },
  { nombre: 'Compradores', ruta: '/admin/compradores', icono: Users },
  { nombre: 'Productores', ruta: '/admin/productores', icono: User },
  { nombre: 'Cafés', ruta: '/admin/cafes', icono: Coffee },
  { nombre: 'Concursos', ruta: '/admin/concursos', icono: Trophy },
  { nombre: 'Muestras', ruta: '/admin/muestras', icono: Package },
  { nombre: 'Subastas', ruta: '/admin/subastas', icono: Gavel },
  { nombre: 'Suscripciones', ruta: '/admin/suscripciones', icono: CreditCard },
  { nombre: 'Pagos', ruta: '/admin/pagos', icono: Wallet },
  { nombre: 'Reportes', ruta: '/admin/reportes', icono: FileBarChart },
  { nombre: 'Configuración', ruta: '/admin/configuracion', icono: Settings },
  { nombre: 'Historial', ruta: '/admin/historial', icono: History },
]

interface SidebarProps {
  abierto: boolean
  onCerrar: () => void
}

function Sidebar({ abierto, onCerrar }: SidebarProps) {
  return (
    <>
      {abierto && (
        <div className="fixed inset-0 bg-cafe-profundo/60 z-40 lg:hidden" onClick={onCerrar} />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-cafe-profundo text-crema flex flex-col shrink-0 z-50 transition-transform duration-200 ${
          abierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-6 py-5 border-b border-crema/10 flex items-center justify-between">
          <div>
            <span className="font-display text-xl font-bold">ARES</span>
            <span className="block text-xs text-dorado uppercase tracking-wide mt-0.5">Panel administrativo</span>
          </div>
          <button onClick={onCerrar} className="lg:hidden text-crema/70 hover:text-crema">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {enlaces.map((enlace) => {
            const Icono = enlace.icono
            return (
              <NavLink
                key={enlace.ruta}
                to={enlace.ruta}
                end={enlace.fin}
                onClick={onCerrar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-crema/10 text-dorado border-r-2 border-dorado'
                      : 'text-crema/70 hover:bg-crema/5 hover:text-crema'
                  }`
                }
              >
                <Icono size={18} />
                {enlace.nombre}
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar