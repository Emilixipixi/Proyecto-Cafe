import { useState, useMemo } from 'react'

export type DireccionOrden = 'asc' | 'desc'

export function useOrdenamiento<T>(datos: T[], obtenerValor: (item: T, columna: string) => string | number) {
  const [columna, setColumna] = useState<string | undefined>(undefined)
  const [direccion, setDireccion] = useState<DireccionOrden>('asc')

  function ordenarPor(nuevaColumna: string) {
    if (columna === nuevaColumna) {
      setDireccion((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setColumna(nuevaColumna)
      setDireccion('asc')
    }
  }

  const datosOrdenados = useMemo(() => {
    if (!columna) return datos
    return [...datos].sort((a, b) => {
      const valorA = obtenerValor(a, columna)
      const valorB = obtenerValor(b, columna)
      if (typeof valorA === 'number' && typeof valorB === 'number') {
        return direccion === 'asc' ? valorA - valorB : valorB - valorA
      }
      return direccion === 'asc'
        ? String(valorA).localeCompare(String(valorB))
        : String(valorB).localeCompare(String(valorA))
    })
  }, [datos, columna, direccion, obtenerValor])

  return { columna, direccion, ordenarPor, datosOrdenados }
}