import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import { formatearPrecio } from '../utils/formatters'

interface RealizarOfertaProps {
  ofertaActual: number
  onOfertar: (monto: number) => void
}

function RealizarOferta({ ofertaActual, onOfertar }: RealizarOfertaProps) {
  const [monto, setMonto] = useState('')
  const [error, setError] = useState('')

  function manejarOfertar() {
    const valor = Number(monto)

    if (!monto || Number.isNaN(valor)) {
      setError('Ingresa un monto válido.')
      return
    }

    if (valor <= ofertaActual) {
      setError(`Tu oferta debe ser mayor a ${formatearPrecio(ofertaActual)}.`)
      return
    }

    onOfertar(valor)
    setMonto('')
    setError('')
  }

  return (
    <div>
      <p className="text-sm text-crema/70 mb-2">
        Oferta actual: <strong className="text-crema">{formatearPrecio(ofertaActual)}</strong>
      </p>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder={`Mínimo ${formatearPrecio(ofertaActual + 0.5)}`}
            type="number"
            step="0.5"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            error={error || undefined}
          />
        </div>
        <Button variant="secondary" onClick={manejarOfertar} className="px-6">
          Ofertar
        </Button>
      </div>
    </div>
  )
}

export default RealizarOferta