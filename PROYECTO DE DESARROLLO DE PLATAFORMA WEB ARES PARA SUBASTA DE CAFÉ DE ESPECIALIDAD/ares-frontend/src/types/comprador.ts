export type EstadoComprador = 'activo' | 'inactivo' | 'pendiente'

export interface Comprador {
  id: string
  nombreCompleto: string
  empresa: string
  pais: string
  ciudad: string
  tipoNegocio: string
  correo: string
  telefono: string
  fechaRegistro: string
  suscripcion: 'gratuito' | 'premium'
  estado: EstadoComprador
}