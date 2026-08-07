import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gris-oscuro">
          {label}
          {props.required && <span className="text-red-600 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`px-4 py-2.5 rounded-lg border bg-white text-gris-oscuro placeholder:text-gris-oscuro/40 focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-red-600 focus:ring-red-600/30'
            : 'border-beige-cafe focus:ring-verde-bosque/30 focus:border-verde-bosque'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}

export default Input