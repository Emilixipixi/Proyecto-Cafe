interface LoadingStateProps {
  mensaje?: string
}

function LoadingState({ mensaje = 'Cargando...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-beige-cafe border-t-verde-bosque rounded-full animate-spin" />
      <p className="text-sm text-gris-oscuro/60">{mensaje}</p>
    </div>
  )
}

export default LoadingState