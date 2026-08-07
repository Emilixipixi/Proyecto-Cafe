import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { cuentasDemo } from '../data/accounts'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'

const valoresIniciales = {
  nombreCompleto: '',
  nombreNegocio: '',
  pais: '',
  ciudad: '',
  tipoNegocio: '',
  nombrePropietario: '',
  correo: '',
  telefono: '',
  password: '',
  confirmarPassword: '',
}

const opcionesPais = [
  { value: 'Ecuador', label: 'Ecuador' },
  { value: 'Estados Unidos', label: 'Estados Unidos' },
  { value: 'Canadá', label: 'Canadá' },
  { value: 'Alemania', label: 'Alemania' },
  { value: 'Reino Unido', label: 'Reino Unido' },
  { value: 'Francia', label: 'Francia' },
  { value: 'Italia', label: 'Italia' },
  { value: 'Japón', label: 'Japón' },
  { value: 'Corea del Sur', label: 'Corea del Sur' },
  { value: 'Australia', label: 'Australia' },
]

const opcionesTipoNegocio = [
  { value: 'Tostadora artesanal', label: 'Tostadora artesanal' },
  { value: 'Cafetería especializada', label: 'Cafetería especializada' },
  { value: 'Importador de café verde', label: 'Importador de café verde' },
  { value: 'Distribuidor mayorista', label: 'Distribuidor mayorista' },
  { value: 'Otro', label: 'Otro' },
]

function Registro() {
  const navigate = useNavigate()
  const [valores, setValores] = useState(valoresIniciales)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})

  function actualizarCampo(campo: keyof typeof valoresIniciales, valor: string) {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  function validar(): boolean {
    const nuevosErrores: Record<string, string> = {}

    if (!valores.nombreCompleto.trim()) nuevosErrores.nombreCompleto = 'Este campo es obligatorio.'
    if (!valores.nombreNegocio.trim()) nuevosErrores.nombreNegocio = 'Este campo es obligatorio.'
    if (!valores.pais) nuevosErrores.pais = 'Selecciona un país.'
    if (!valores.ciudad.trim()) nuevosErrores.ciudad = 'Este campo es obligatorio.'
    if (!valores.tipoNegocio) nuevosErrores.tipoNegocio = 'Selecciona un tipo de negocio.'
    if (!valores.nombrePropietario.trim()) nuevosErrores.nombrePropietario = 'Este campo es obligatorio.'

    if (!valores.correo.trim()) {
      nuevosErrores.correo = 'Este campo es obligatorio.'
    } else if (!/^\S+@\S+\.\S+$/.test(valores.correo)) {
      nuevosErrores.correo = 'Ingresa un correo válido.'
    } else if (cuentasDemo.some((c) => c.correo === valores.correo)) {
      nuevosErrores.correo = 'Ya existe una cuenta registrada con este correo.'
    }

    if (!valores.telefono.trim()) nuevosErrores.telefono = 'Este campo es obligatorio.'

    if (!valores.password) {
      nuevosErrores.password = 'Este campo es obligatorio.'
    } else if (valores.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.'
    }

    if (valores.confirmarPassword !== valores.password) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.'
    }

    if (!aceptaTerminos) nuevosErrores.terminos = 'Debes aceptar los términos y condiciones.'

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  function manejarSubmit() {
    if (!validar()) return

    navigate('/login', { state: { registroExitoso: true } })
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-cafe-profundo mb-1">Crear cuenta</h1>
      <p className="text-sm text-gris-oscuro/60 mb-8">Regístrate como comprador y accede al catálogo de ARES.</p>

      <div className="space-y-4">
        <Input
          label="Nombre completo"
          required
          value={valores.nombreCompleto}
          onChange={(e) => actualizarCampo('nombreCompleto', e.target.value)}
          error={errores.nombreCompleto}
        />

        <Input
          label="Nombre de cafetería / tostadora"
          required
          value={valores.nombreNegocio}
          onChange={(e) => actualizarCampo('nombreNegocio', e.target.value)}
          error={errores.nombreNegocio}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="País"
            required
            placeholder="Selecciona un país"
            value={valores.pais}
            onChange={(e) => actualizarCampo('pais', e.target.value)}
            opciones={opcionesPais}
            error={errores.pais}
          />
          <Input
            label="Ciudad"
            required
            value={valores.ciudad}
            onChange={(e) => actualizarCampo('ciudad', e.target.value)}
            error={errores.ciudad}
          />
        </div>

        <Select
          label="Tipo de negocio"
          required
          placeholder="Selecciona un tipo"
          value={valores.tipoNegocio}
          onChange={(e) => actualizarCampo('tipoNegocio', e.target.value)}
          opciones={opcionesTipoNegocio}
          error={errores.tipoNegocio}
        />

        <Input
          label="Nombre del propietario"
          required
          value={valores.nombrePropietario}
          onChange={(e) => actualizarCampo('nombrePropietario', e.target.value)}
          error={errores.nombrePropietario}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Correo"
            type="email"
            required
            value={valores.correo}
            onChange={(e) => actualizarCampo('correo', e.target.value)}
            error={errores.correo}
          />
          <Input
            label="Teléfono"
            required
            value={valores.telefono}
            onChange={(e) => actualizarCampo('telefono', e.target.value)}
            error={errores.telefono}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Contraseña"
            type="password"
            required
            value={valores.password}
            onChange={(e) => actualizarCampo('password', e.target.value)}
            error={errores.password}
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            required
            value={valores.confirmarPassword}
            onChange={(e) => actualizarCampo('confirmarPassword', e.target.value)}
            error={errores.confirmarPassword}
          />
        </div>

        <div>
          <label className="flex items-start gap-2 text-sm text-gris-oscuro cursor-pointer">
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              className="mt-0.5 accent-verde-bosque"
            />
            Acepto los términos y condiciones
          </label>
          {errores.terminos && <span className="text-xs text-red-600 block mt-1">{errores.terminos}</span>}
        </div>

        <Button variant="primary" className="w-full" onClick={manejarSubmit}>
          Crear cuenta
        </Button>

        <p className="text-center text-sm text-gris-oscuro/60">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-verde-bosque font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Registro