export type EstadoProductor = 'activo' | 'inactivo'

export interface Productor {
  id: string
  nombre: string
  finca: string
  ubicacion: string
  provincia: string
  altitud: number
  variedades: string[]
  procesos: string[]
  puntaje: number
  descripcion: string
  historia: string
  fotografia: string
  premios: string[]
  estado: EstadoProductor
}