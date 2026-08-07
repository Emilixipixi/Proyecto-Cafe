import { Link } from 'react-router'
import { Check, Lock } from 'lucide-react'
import Button from '../components/Button'
import Badge from '../components/Badge'

const beneficiosGratuitos = [
  'Registro como comprador',
  'Acceso al catálogo completo de cafés',
  'Consulta de productores y sus fincas',
  'Consulta de subastas disponibles',
  'Solicitud de muestras',
]

function Suscripcion() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl text-cafe-profundo mb-2">Planes ARES</h1>
        <p className="text-sm text-gris-oscuro/60">Empezá sin costo. Los planes con beneficios adicionales llegarán próximamente.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-verde-bosque rounded-xl p-8">
          <Badge variant="success">Plan actual disponible</Badge>
          <h2 className="font-display text-2xl text-cafe-profundo mt-4 mb-1">Gratuito</h2>
          <p className="text-3xl font-bold text-verde-bosque mb-6">$0</p>

          <ul className="space-y-3 mb-8">
            {beneficiosGratuitos.map((beneficio) => (
              <li key={beneficio} className="flex items-start gap-2 text-sm text-gris-oscuro/80">
                <Check size={18} className="text-verde-bosque shrink-0 mt-0.5" />
                {beneficio}
              </li>
            ))}
          </ul>

          <Link to="/registro">
            <Button variant="primary" className="w-full">Registrarme</Button>
          </Link>
        </div>

        <div className="bg-beige-cafe/10 border border-beige-cafe/40 rounded-xl p-8 opacity-70">
          <Badge variant="warning">Próximamente</Badge>
          <h2 className="font-display text-2xl text-cafe-profundo mt-4 mb-1">Premium</h2>
          <p className="text-sm text-gris-oscuro/60 mb-6">
            Beneficios adicionales y comisiones preferenciales para participar en procesos exclusivos de
            subasta. Detalles disponibles cuando se habilite esta etapa.
          </p>
          <Button variant="outline" className="w-full" disabled>
            <Lock size={15} className="inline mr-1.5" /> No disponible aún
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Suscripcion