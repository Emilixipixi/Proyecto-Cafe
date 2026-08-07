import { Outlet, Link, useNavigate } from 'react-router'
import { LogOut } from 'lucide-react'
import { useAuth } from '../hooks/AuthContext'

function DashboardLayout() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  function manejarCerrarSesion() {
    cerrarSesion()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-crema">
      <header className="bg-cafe-profundo text-crema">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-0 sm:justify-between">
          <Link to="/" className="font-display text-xl font-bold">ARES</Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-crema/80 truncate max-w-[160px] sm:max-w-none">
              {usuario?.nombre} <span className="text-dorado">· {usuario?.rol}</span>
            </span>
            <button
              onClick={manejarCerrarSesion}
              className="flex items-center gap-1.5 text-crema/70 hover:text-crema shrink-0"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout