interface BidCardProps {
  monto: number
  etiquetaComprador: string
  destacado?: boolean
}

function BidCard({ monto, etiquetaComprador, destacado = false }: BidCardProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 rounded-lg font-mono text-sm ${
        destacado ? 'bg-verde-bosque/10 border border-verde-bosque/30' : 'bg-crema/50'
      }`}
    >
      <span className={`font-bold ${destacado ? 'text-verde-bosque' : 'text-cafe-profundo'}`}>
        ${monto.toFixed(2)}
      </span>
      <span className="text-gris-oscuro/60">{etiquetaComprador}</span>
    </div>
  )
}

export default BidCard