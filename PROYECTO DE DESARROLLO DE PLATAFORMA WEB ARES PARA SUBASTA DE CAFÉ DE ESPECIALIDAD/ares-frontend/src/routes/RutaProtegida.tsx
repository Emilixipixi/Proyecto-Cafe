import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/AuthContext'
import type { Rol } from '../types'

interface RutaProtegidaProps {
  rolPermitido: Rol
}

function RutaProtegida({ rolPermitido }: RutaProtegidaProps) {
  const { usuario } = useAuth()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (usuario.rol !== rolPermitido) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RutaProtegida