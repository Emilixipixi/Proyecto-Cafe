import { useState, useCallback } from 'react'

interface ToastItem {
  id: number
  tipo: 'success' | 'warning' | 'error' | 'info'
  mensaje: string
}

let contadorToast = 0

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const mostrarToast = useCallback((tipo: ToastItem['tipo'], mensaje: string) => {
    const id = ++contadorToast
    setToasts((anteriores) => [...anteriores, { id, tipo, mensaje }])
    setTimeout(() => {
      setToasts((anteriores) => anteriores.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  function cerrarToast(id: number) {
    setToasts((anteriores) => anteriores.filter((t) => t.id !== id))
  }

  return { toasts, mostrarToast, cerrarToast }
}