export type RolAuditoria = 'comprador' | 'productor' | 'administrador'

export type AccionAuditoria =
  | 'inicio_sesion'
  | 'cierre_sesion'
  | 'registro_cuenta'
  | 'solicitud_muestra'
  | 'cambio_estado_muestra'
  | 'oferta_realizada'
  | 'creacion_cafe'
  | 'edicion_cafe'
  | 'publicacion_cafe'
  | 'desactivacion_cafe'
  | 'creacion_productor'
  | 'edicion_productor'
  | 'cambio_estado_productor'
  | 'creacion_subasta'
  | 'edicion_subasta'
  | 'cambio_estado_comprador'

export interface RegistroAuditoria {
  id: string
  fechaHora: string
  rol: RolAuditoria
  actorNombre: string
  actorId?: string
  accion: AccionAuditoria
  entidad: string
  detalle: string
}