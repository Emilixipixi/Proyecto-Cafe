import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'gold' | 'live'
  children: ReactNode
}

const estilosPorVariante = {
  success: 'bg-verde-bosque/10 text-verde-bosque',
  warning: 'bg-dorado/10 text-dorado',
  error: 'bg-red-600/10 text-red-600',
  info: 'bg-verde-oliva/10 text-verde-oliva',
  gold: 'bg-dorado text-cafe-profundo',
  live: 'bg-red-600 text-white',
}

function Badge({ variant = 'info', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${estilosPorVariante[variant]}`}>
      {variant === 'live' && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
      {children}
    </span>
  )
}

export default Badge