export type EstadoSubasta = 'borrador' | 'programada' | 'en_vivo' | 'finalizada' | 'cancelada'

export interface CafeEnSubasta {
  cafeId: string
  ofertaActual: number
  numeroOfertas: number
}

export interface Subasta {
  id: string
  nombre: string
  fecha: string
  hora: string
  estado: EstadoSubasta
  cafes: CafeEnSubasta[]
}