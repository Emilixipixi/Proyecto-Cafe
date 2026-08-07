import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-beige-cafe/40 p-6 ${className}`}>
      {children}
    </div>
  )
}

export default Card