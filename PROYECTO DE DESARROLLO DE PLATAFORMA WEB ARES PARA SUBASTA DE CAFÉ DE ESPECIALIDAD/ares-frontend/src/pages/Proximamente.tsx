import { Construction } from 'lucide-react'

interface ProximamenteProps {
  titulo: string
}

function Proximamente({ titulo }: ProximamenteProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <Construction size={40} className="text-beige-cafe mb-4" />
      <h1 className="font-display text-2xl text-cafe-profundo mb-2">{titulo}</h1>
      <p className="text-sm text-gris-oscuro/60 max-w-sm">
        Esta sección se habilitará cuando el proyecto se conecte al backend definitivo.
      </p>
    </div>
  )
}

export default Proximamente