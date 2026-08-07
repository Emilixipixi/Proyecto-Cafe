import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Menu, X } from 'lucide-react'
import Button from './Button'

const enlaces = [
  { nombre: 'Inicio', ruta: '/' },
  { nombre: 'Cafés', ruta: '/cafes' },
  { nombre: 'Productores', ruta: '/productores' },
  { nombre: 'Concursos', ruta: '/concursos' },
  { nombre: 'Subastas', ruta: '/subastas' },
  { nombre: 'Sobre ARES', ruta: '/sobre-ares' },
]

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="bg-cafe-profundo text-crema sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold tracking-wide">
          ARES
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.ruta}
              to={enlace.ruta}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-dorado' : 'text-crema/80 hover:text-crema'
                }`
              }
            >
              {enlace.nombre}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-crema/80 hover:text-crema">
            Iniciar sesión
          </Link>
          <Link to="/registro">
            <Button variant="secondary" className="px-4 py-2 text-sm">
              Registrarme
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          {menuAbierto ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuAbierto && (
        <nav className="md:hidden flex flex-col gap-1 px-6 pb-4">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.ruta}
              to={enlace.ruta}
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `py-2 text-sm font-medium ${isActive ? 'text-dorado' : 'text-crema/80'}`
              }
            >
              {enlace.nombre}
            </NavLink>
          ))}
          <Link to="/login" onClick={() => setMenuAbierto(false)} className="py-2 text-sm text-crema/80">
            Iniciar sesión
          </Link>
          <Link to="/registro" onClick={() => setMenuAbierto(false)} className="py-2 text-sm text-dorado font-medium">
            Registrarme
          </Link>
        </nav>
      )}
    </header>
  )
}

export default Navbar