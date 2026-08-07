import type { SelectHTMLAttributes } from 'react'

interface OpcionSelect {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  opciones: OpcionSelect[]
  placeholder?: string
}

function Select({ label, error, opciones, placeholder, id, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gris-oscuro">
          {label}
          {props.required && <span className="text-red-600 ml-0.5">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`px-4 py-2.5 rounded-lg border bg-white text-gris-oscuro focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-red-600 focus:ring-red-600/30'
            : 'border-beige-cafe focus:ring-verde-bosque/30 focus:border-verde-bosque'
        } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}

export default Select