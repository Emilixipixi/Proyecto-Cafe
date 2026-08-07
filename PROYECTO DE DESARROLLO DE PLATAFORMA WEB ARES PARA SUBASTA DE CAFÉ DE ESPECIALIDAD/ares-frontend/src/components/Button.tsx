import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  children: ReactNode
}

const estilosPorVariante = {
  primary: 'bg-verde-bosque text-crema hover:bg-verde-bosque/90',
  secondary: 'bg-dorado text-cafe-profundo hover:bg-dorado/90',
  outline: 'border border-verde-bosque text-verde-bosque hover:bg-verde-bosque hover:text-crema',
}

function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${estilosPorVariante[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button