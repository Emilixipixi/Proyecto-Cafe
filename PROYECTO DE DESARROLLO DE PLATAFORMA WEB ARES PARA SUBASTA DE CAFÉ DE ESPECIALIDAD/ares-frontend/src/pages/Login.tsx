import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { CheckCircle2 } from 'lucide-react'
import { useAuth } from '../hooks/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'

function Login() {
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [recordarme, setRecordarme] = useState(true)
  const [error, setError] = useState('')

  const registroExitoso = (location.state as { registroExitoso?: boolean } | null)?.registroExitoso

  function manejarSubmit() {
    const resultado = iniciarSesion(correo, password)

    if (!resultado.ok) {
      setError(resultado.error ?? 'No se pudo iniciar sesión.')
      return
    }

    setError('')
    navigate('/verificacion')
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-cafe-profundo mb-1">Iniciar sesión</h1>
      <p className="text-sm text-gris-oscuro/60 mb-6">Ingresa a tu cuenta de ARES.</p>

      {registroExitoso && (
        <div className="flex items-center gap-2 bg-verde-bosque/10 text-verde-bosque text-sm rounded-lg px-4 py-3 mb-6">
          <CheckCircle2 size={18} />
          Cuenta creada correctamente. Ya puedes iniciar sesión.
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error || undefined}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gris-oscuro cursor-pointer">
            <input
              type="checkbox"
              checked={recordarme}
              onChange={(e) => setRecordarme(e.target.checked)}
              className="accent-verde-bosque"
            />
            Recordarme
          </label>
          <button type="button" className="text-verde-bosque hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button variant="primary" className="w-full" onClick={manejarSubmit}>
          Iniciar sesión
        </Button>

        <p className="text-center text-sm text-gris-oscuro/60">
          ¿No tienes una cuenta?{' '}
          <Link to="/registro" className="text-verde-bosque font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>

      <div className="mt-8 bg-beige-cafe/20 border border-beige-cafe/40 rounded-lg p-4 text-xs text-gris-oscuro/70">
        <strong className="block text-cafe-profundo mb-1">Cuentas de prueba (prototipo)</strong>
        comprador@ares.com — productor@ares.com — admin@ares.com
        <br />
        Contraseña para las tres: <strong>123456</strong> · Código 2FA: <strong>123456</strong>
      </div>
    </div>
  )
}

export default Login