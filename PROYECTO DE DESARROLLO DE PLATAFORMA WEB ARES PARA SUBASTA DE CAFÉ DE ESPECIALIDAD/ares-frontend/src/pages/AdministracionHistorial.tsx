import { useState } from 'react'
import { useAuditoria } from '../hooks/AuditoriaContext'
import { usePaginacion } from '../hooks/usePaginacion'
import { useOrdenamiento } from '../hooks/useOrdenamiento'
import type { RegistroAuditoria, RolAuditoria, AccionAuditoria } from '../types'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Select from '../components/Select'
import Input from '../components/Input'
import AdminToolbar from '../components/AdminToolbar'
import TableFooter from '../components/TableFooter'
import { useToasts } from '../hooks/useToasts'
import ToastContainer from '../components/ToastContainer'

const etiquetasRol: Record<RolAuditoria, string> = {
  comprador: 'Comprador',
  productor: 'Productor',
  administrador: 'Administrador',
}

const badgePorRol: Record<RolAuditoria, 'info' | 'success' | 'gold'> = {
  comprador: 'info',
  productor: 'success',
  administrador: 'gold',
}

const etiquetasAccion: Record<AccionAuditoria, string> = {
  inicio_sesion: 'Inicio de sesión',
  cierre_sesion: 'Cierre de sesión',
  registro_cuenta: 'Registro de cuenta',
  solicitud_muestra: 'Solicitud de muestra',
  cambio_estado_muestra: 'Cambio de estado de muestra',
  oferta_realizada: 'Oferta realizada',
  creacion_cafe: 'Creación de café',
  edicion_cafe: 'Edición de café',
  publicacion_cafe: 'Publicación de café',
  desactivacion_cafe: 'Desactivación de café',
  creacion_productor: 'Creación de productor',
  edicion_productor: 'Edición de productor',
  cambio_estado_productor: 'Cambio de estado de productor',
  creacion_subasta: 'Creación de subasta',
  edicion_subasta: 'Edición de subasta',
  cambio_estado_comprador: 'Cambio de estado de comprador',
}

const opcionesRol = Object.entries(etiquetasRol).map(([value, label]) => ({ value, label }))
const opcionesAccion = Object.entries(etiquetasAccion).map(([value, label]) => ({ value, label }))

const filtrosIniciales = {
  busqueda: '',
  rol: '',
  accion: '',
  fechaDesde: '',
  fechaHasta: '',
}

function obtenerValor(item: RegistroAuditoria, columna: string): string | number {
  switch (columna) {
    case 'fecha': return item.fechaHora
    case 'rol': return item.rol
    case 'actor': return item.actorNombre
    case 'accion': return item.accion
    case 'entidad': return item.entidad
    default: return ''
  }
}

function AdministracionHistorial() {
  const { registros } = useAuditoria()
  const [filtros, setFiltros] = useState(filtrosIniciales)
  const { toasts, mostrarToast, cerrarToast } = useToasts()

  function actualizarFiltro(campo: keyof typeof filtrosIniciales, valor: string) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  function limpiarFiltros() {
    setFiltros(filtrosIniciales)
  }

  function exportarExcel() {
    mostrarToast('info', `Exportación a Excel simulada (${datosFiltrados.length} registros).`)
  }

  function exportarPDF() {
    mostrarToast('info', `Exportación a PDF simulada (${datosFiltrados.length} registros).`)
  }

  function recargar() {
    mostrarToast('success', 'Historial actualizado.')
  }

  const datosFiltrados = registros.filter((r) => {
    const texto = filtros.busqueda.toLowerCase().trim()
    const coincideBusqueda =
      texto === '' ||
      r.actorNombre.toLowerCase().includes(texto) ||
      r.entidad.toLowerCase().includes(texto) ||
      r.detalle.toLowerCase().includes(texto)

    const coincideRol = filtros.rol === '' || r.rol === filtros.rol
    const coincideAccion = filtros.accion === '' || r.accion === filtros.accion
    const fecha = r.fechaHora.slice(0, 10)
    const coincideFechaDesde = filtros.fechaDesde === '' || fecha >= filtros.fechaDesde
    const coincideFechaHasta = filtros.fechaHasta === '' || fecha <= filtros.fechaHasta

    return coincideBusqueda && coincideRol && coincideAccion && coincideFechaDesde && coincideFechaHasta
  })

  const { columna, direccion, ordenarPor, datosOrdenados } = useOrdenamiento(datosFiltrados, obtenerValor)
  const { paginaActual, setPaginaActual, porPagina, setPorPagina, totalPaginas, datosPagina, inicio } =
    usePaginacion(datosOrdenados, 25)

  const hayFiltrosActivos = Object.values(filtros).some((valor) => valor !== '')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-cafe-profundo">Historial de auditoría</h1>
        <p className="text-sm text-gris-oscuro/60 mt-1">
          {registros.length} movimientos registrados de compradores, productores y administradores
        </p>
      </div>

      <AdminToolbar
        busqueda={filtros.busqueda}
        onBusquedaChange={(valor) => actualizarFiltro('busqueda', valor)}
        placeholderBusqueda="Buscar por actor, entidad o detalle..."
        hayFiltrosActivos={hayFiltrosActivos}
        onLimpiarFiltros={limpiarFiltros}
        onExportarExcel={exportarExcel}
        onExportarPDF={exportarPDF}
        onRecargar={recargar}
      >
        <Select
          placeholder="Rol"
          value={filtros.rol}
          onChange={(e) => actualizarFiltro('rol', e.target.value)}
          opciones={opcionesRol}
        />
        <Select
          placeholder="Tipo de acción"
          value={filtros.accion}
          onChange={(e) => actualizarFiltro('accion', e.target.value)}
          opciones={opcionesAccion}
        />
        <Input
          type="date"
          value={filtros.fechaDesde}
          onChange={(e) => actualizarFiltro('fechaDesde', e.target.value)}
          className="text-sm"
        />
        <Input
          type="date"
          value={filtros.fechaHasta}
          onChange={(e) => actualizarFiltro('fechaHasta', e.target.value)}
          className="text-sm"
        />
      </AdminToolbar>

      <Table
        columnas={[
          {
            header: 'Fecha y hora',
            render: (r: RegistroAuditoria) => {
              const fecha = new Date(r.fechaHora)
              return (
                <span className="font-mono text-xs">
                  {fecha.toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' })}{' '}
                  {fecha.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )
            },
            sortKey: 'fecha',
          },
          {
            header: 'Rol',
            render: (r: RegistroAuditoria) => <Badge variant={badgePorRol[r.rol]}>{etiquetasRol[r.rol]}</Badge>,
            sortKey: 'rol',
          },
          { header: 'Actor', render: (r: RegistroAuditoria) => r.actorNombre, sortKey: 'actor' },
          { header: 'Acción', render: (r: RegistroAuditoria) => etiquetasAccion[r.accion], sortKey: 'accion' },
          { header: 'Entidad', render: (r: RegistroAuditoria) => r.entidad, sortKey: 'entidad' },
          { header: 'Detalle', render: (r: RegistroAuditoria) => <span className="text-xs">{r.detalle}</span> },
        ]}
        datos={datosPagina}
        claveFila={(r) => r.id}
        columnaOrden={columna}
        direccionOrden={direccion}
        onOrdenar={ordenarPor}
      />

      <TableFooter
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
        porPagina={porPagina}
        onCambiarPorPagina={setPorPagina}
        totalResultados={datosOrdenados.length}
        inicio={inicio}
      />

      <ToastContainer toasts={toasts} onCerrar={cerrarToast} />
    </div>
  )
}

export default AdministracionHistorial