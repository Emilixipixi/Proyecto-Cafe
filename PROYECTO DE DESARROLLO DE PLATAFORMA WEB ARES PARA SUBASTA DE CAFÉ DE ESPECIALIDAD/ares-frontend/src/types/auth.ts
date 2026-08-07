export type Rol = 'comprador' | 'productor' | 'administrador'

export interface SesionUsuario {
  correo: string
  nombre: string
  rol: Rol
  compradorId?: string
  productorId?: string
}