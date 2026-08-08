import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { registrosAuditoria as registrosIniciales } from '../data/audit'
import type { RegistroAuditoria } from '../types'

const CLAVE_STORAGE = 'ares_auditoria_eventos'

interface AuditoriaContextValue {
  registros: RegistroAuditoria[]
  registrarEvento: (datos: Omit<RegistroAuditoria, 'id' | 'fechaHora'>) => void
}

const AuditoriaContext = createContext<AuditoriaContextValue | undefined>(undefined)

let contadorEvento = 0

export function AuditoriaProvider({ children }: { children: ReactNode }) {
  const [eventosSesion, setEventosSesion] = useState<RegistroAuditoria[]>(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE)
      return guardado ? JSON.parse(guardado) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(eventosSesion))
  }, [eventosSesion])

  function registrarEvento(datos: Omit<RegistroAuditoria, 'id' | 'fechaHora'>) {
    contadorEvento += 1
    const nuevoRegistro: RegistroAuditoria = {
      ...datos,
      id: `evento-sesion-${Date.now()}-${contadorEvento}`,
      fechaHora: new Date().toISOString(),
    }
    setEventosSesion((anteriores) => [nuevoRegistro, ...anteriores])
  }

  const registros = [...eventosSesion, ...registrosIniciales].sort(
    (a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime(),
  )

  return (
    <AuditoriaContext.Provider value={{ registros, registrarEvento }}>
      {children}
    </AuditoriaContext.Provider>
  )
}

export function useAuditoria() {
  const contexto = useContext(AuditoriaContext)
  if (!contexto) {
    throw new Error('useAuditoria debe usarse dentro de un AuditoriaProvider')
  }
  return contexto
}