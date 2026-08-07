import type { Rol } from '../types'

export interface CuentaDemo {
  correo: string
  password: string
  nombre: string
  rol: Rol
  compradorId?: string
  productorId?: string
}

export const cuentasDemo: CuentaDemo[] = [
  { correo: 'comprador@ares.com', password: '123456', nombre: 'James Whitfield', rol: 'comprador', compradorId: 'comprador-01' },
  { correo: 'productor@ares.com', password: '123456', nombre: 'Rosa Elena Castillo', rol: 'productor', productorId: 'prod-04' },
  { correo: 'admin@ares.com', password: '123456', nombre: 'Administradora ARES', rol: 'administrador' },
]

export const CODIGO_2FA_DEMO = '123456'