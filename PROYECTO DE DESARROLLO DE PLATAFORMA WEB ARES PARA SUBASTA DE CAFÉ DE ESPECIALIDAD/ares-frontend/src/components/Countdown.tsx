import { useEffect, useState } from 'react'

interface CountdownProps {
  fechaObjetivo: Date
  onFinalizar?: () => void
}

function calcularTiempoRestante(fechaObjetivo: Date) {
  const diferencia = fechaObjetivo.getTime() - Date.now()

  if (diferencia <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0, finalizado: true }
  }

  return {
    dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diferencia / (1000 * 60)) % 60),
    segundos: Math.floor((diferencia / 1000) % 60),
    finalizado: false,
  }
}

function Countdown({ fechaObjetivo, onFinalizar }: CountdownProps) {
  const [tiempo, setTiempo] = useState(() => calcularTiempoRestante(fechaObjetivo))

  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevoTiempo = calcularTiempoRestante(fechaObjetivo)
      setTiempo(nuevoTiempo)

      if (nuevoTiempo.finalizado) {
        clearInterval(intervalo)
        onFinalizar?.()
      }
    }, 1000)

    return () => clearInterval(intervalo)
  }, [fechaObjetivo, onFinalizar])

  const formatear = (numero: number) => String(numero).padStart(2, '0')

  if (tiempo.finalizado) {
    return <span className="font-mono text-lg font-bold text-red-600">Finalizado</span>
  }

  return (
    <div className="flex items-baseline gap-1 font-mono">
      {tiempo.dias > 0 && (
        <>
          <span className="text-2xl font-bold text-cafe-profundo">{tiempo.dias}</span>
          <span className="text-xs text-gris-oscuro/60 mr-1">d</span>
        </>
      )}
      <span className="text-2xl font-bold text-cafe-profundo">{formatear(tiempo.horas)}</span>
      <span className="text-lg text-gris-oscuro/40">:</span>
      <span className="text-2xl font-bold text-cafe-profundo">{formatear(tiempo.minutos)}</span>
      <span className="text-lg text-gris-oscuro/40">:</span>
      <span className="text-2xl font-bold text-cafe-profundo">{formatear(tiempo.segundos)}</span>
    </div>
  )
}

export default Countdown