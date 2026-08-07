interface DashboardCardProps {
  etiqueta: string
  valor: number | string
  destacado?: boolean
}

function DashboardCard({ etiqueta, valor, destacado = false }: DashboardCardProps) {
  return (
    <div className={`rounded-xl p-5 border ${destacado ? 'bg-verde-bosque text-crema border-verde-bosque' : 'bg-white border-beige-cafe/40'}`}>
      <p className={`text-3xl font-bold ${destacado ? 'text-crema' : 'text-cafe-profundo'}`}>{valor}</p>
      <p className={`text-sm mt-1 ${destacado ? 'text-crema/80' : 'text-gris-oscuro/60'}`}>{etiqueta}</p>
    </div>
  )
}

export default DashboardCard