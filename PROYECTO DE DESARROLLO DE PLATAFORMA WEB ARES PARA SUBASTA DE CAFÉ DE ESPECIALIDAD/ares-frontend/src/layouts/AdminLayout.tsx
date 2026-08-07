import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '../hooks/AuthContext'
import Sidebar from '../components/Sidebar'

function AdminLayout() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()
  const [sidebarAbierto, setSidebarAbierto] = useState(false)

  function manejarCerrarSesion() {
    cerrarSesion()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-crema">
      <Sidebar abierto={sidebarAbierto} onCerrar={() => setSidebarAbierto(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-beige-cafe/40 px-4 sm:px-8 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarAbierto(true)} className="lg:hidden text-cafe-profundo">
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-4 text-sm ml-auto">
            <span className="text-gris-oscuro/70 hidden sm:inline">{usuario?.nombre}</span>
            <button
              onClick={manejarCerrarSesion}
              className="flex items-center gap-1.5 text-gris-oscuro/60 hover:text-cafe-profundo"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout