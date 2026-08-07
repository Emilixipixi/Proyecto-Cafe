import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { SesionUsuario } from '../types'
import { cuentasDemo, CODIGO_2FA_DEMO } from '../data/accounts'

const CLAVE_STORAGE = 'ares_sesion'

interface ResultadoAuth {
  ok: boolean
  error?: string
}

interface AuthContextValue {
  usuario: SesionUsuario | null
  pendienteVerificacion: SesionUsuario | null
  iniciarSesion: (correo: string, password: string) => ResultadoAuth
  verificarCodigo: (codigo: string) => ResultadoAuth
  reenviarCodigo: () => void
  cerrarSesion: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<SesionUsuario | null>(null)
  const [pendienteVerificacion, setPendienteVerificacion] = useState<SesionUsuario | null>(null)

  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    if (guardado) {
      setUsuario(JSON.parse(guardado))
    }
  }, [])

  function iniciarSesion(correo: string, password: string): ResultadoAuth {
    const cuenta = cuentasDemo.find((c) => c.correo === correo && c.password === password)

    if (!cuenta) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' }
    }

    setPendienteVerificacion({
      correo: cuenta.correo,
      nombre: cuenta.nombre,
      rol: cuenta.rol,
      compradorId: cuenta.compradorId,
      productorId: cuenta.productorId,
    })

    return { ok: true }
  }

  function verificarCodigo(codigo: string): ResultadoAuth {
    if (!pendienteVerificacion) {
      return { ok: false, error: 'No hay una verificación pendiente.' }
    }

    if (codigo !== CODIGO_2FA_DEMO) {
      return { ok: false, error: 'El código ingresado no es correcto.' }
    }

    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pendienteVerificacion))
    setUsuario(pendienteVerificacion)
    setPendienteVerificacion(null)

    return { ok: true }
  }

  function reenviarCodigo() {
    console.log(`[demo] Código reenviado: ${CODIGO_2FA_DEMO}`)
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_STORAGE)
    setUsuario(null)
    setPendienteVerificacion(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, pendienteVerificacion, iniciarSesion, verificarCodigo, reenviarCodigo, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return contexto
}