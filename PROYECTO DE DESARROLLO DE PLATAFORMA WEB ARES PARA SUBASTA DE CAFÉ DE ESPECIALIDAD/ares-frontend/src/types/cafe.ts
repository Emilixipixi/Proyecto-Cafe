export type EstadoCafe = 'disponible' | 'en_subasta' | 'vendido' | 'no_disponible'

export interface Cafe {
  id: string
  nombre: string
  productorId: string
  variedad: string
  proceso: string
  altitud: number
  puntaje: number
  notasCata: string[]
  precioBase: number
  estado: EstadoCafe
  imagen: string
  descripcion: string
  concursoId?: string
  posicionConcurso?: number
}