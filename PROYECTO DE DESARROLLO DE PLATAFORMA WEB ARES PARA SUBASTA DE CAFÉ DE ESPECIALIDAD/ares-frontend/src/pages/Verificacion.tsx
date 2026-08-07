import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router'
import { useAuth } from '../hooks/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'

const rutasPorRol: Record<string, string> = {
  comprador: '/dashboard/comprador',
  productor: '/dashboard/productor',
  administrador: '/admin',
}

function Verificacion() {
  const { usuario, pendienteVerificacion, verificarCodigo, reenviarCodigo } = useAuth()
  const navigate = useNavigate()

  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const [mensajeReenvio, setMensajeReenvio] = useState('')

  useEffect(() => {
    if (usuario) {
      navigate(rutasPorRol[usuario.rol], { replace: true })
    }
  }, [usuario, navigate])

  if (!pendienteVerificacion && !usuario) {
    return <Navigate to="/login" replace />
  }

  function manejarVerificar() {
    const resultado = verificarCodigo(codigo)
    if (!resultado.ok) {
      setError(resultado.error ?? 'Código incorrecto.')
    }
  }

  function manejarReenviar() {
    reenviarCodigo()
    setMensajeReenvio('Código reenviado correctamente.')
    setTimeout(() => setMensajeReenvio(''), 3000)
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-3xl text-cafe-profundo mb-2">Verificación de seguridad</h1>
      <p className="text-sm text-gris-oscuro/60 mb-8">
        Hemos enviado un código de verificación a tu medio registrado.
      </p>

      <div className="text-left space-y-4">
        <Input
          label="Código de 6 dígitos"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          maxLength={6}
          error={error || undefined}
          className="text-center tracking-[0.5em] font-mono text-lg"
        />

        <Button variant="primary" className="w-full" onClick={manejarVerificar}>
          Verificar
        </Button>

        <div className="flex items-center justify-between text-sm pt-2">
          <button type="button" onClick={manejarReenviar} className="text-verde-bosque hover:underline">
            Reenviar código
          </button>
          <button type="button" className="text-gris-oscuro/60 hover:underline">
            Cambiar método
          </button>
        </div>

        {mensajeReenvio && (
          <p className="text-center text-xs text-verde-bosque">{mensajeReenvio}</p>
        )}
      </div>
    </div>
  )
}

export default Verificacion