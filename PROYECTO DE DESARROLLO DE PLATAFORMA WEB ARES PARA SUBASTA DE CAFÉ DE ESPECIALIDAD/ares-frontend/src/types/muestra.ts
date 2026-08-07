export type EstadoMuestra = 'solicitada' | 'preparando' | 'enviada' | 'entregada' | 'cancelada'

export interface Muestra {
  id: string
  compradorId: string
  cafeId: string
  fecha: string
  estado: EstadoMuestra
}