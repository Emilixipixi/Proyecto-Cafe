import { useState } from 'react'
import { Power } from 'lucide-react'
import { compradores as compradoresIniciales } from '../data/buyers'
import { ofertas } from '../data/bids'
import { muestras } from '../data/samples'
import { subastas } from '../data/auctions'
import { obtenerGanador } from '../utils/subastas'
import { formatearFecha } from '../utils/formatters'
import { usePaginacion } from '../hooks/usePaginacion'
import { useOrdenamiento } from '../hooks/useOrdenamiento'
import { useToasts } from '../hooks/useToasts'
import type { Comprador, EstadoComprador } from '../types'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Select from '../components/Select'
import Input from '../components/Input'
import AdminToolbar from '../components/AdminToolbar'
import TableFooter from '../components/TableFooter'
import ToastContainer from '../components/ToastContainer'

const badgePorEstado: Record<EstadoComprador, 'success' | 'error' | 'warning'> = {
  activo: 'success',
  inactivo: 'error',
  pendiente: 'warning',
}

const badgePorSuscripcion: Record<Comprador['suscripcion'], 'gold' | 'info'> = {
  premium: 'gold',
  gratuito: 'info',
}

const idsConOfertas = new Set(ofertas.map((o) => o.compradorId))
const idsConMuestras = new Set(muestras.map((m) => m.compradorId))
const idsGanadores = new Set(
  subastas
    .filter((s) => s.estado === 'finalizada')
    .flatMap((s) => s.cafes.map((c) => obtenerGanador(c.cafeId)?.compradorId))
    .filter((id): id is string => Boolean(id)),
)

const paisesDisponibles = Array.from(new Set(compradoresIniciales.map((c) => c.pais))).sort()
const ciudadesDisponibles = Array.from(new Set(compradoresIniciales.map((c) => c.ciudad))).sort()

const filtrosIniciales = {
  busqueda: '',
  pais: '',
  ciudad: '',
  estado: '',
  suscripcion: '',
  fechaDesde: '',
  fechaHasta: '',
  participoSubastas: '',
  tieneMuestras: '',
  ganoSubasta: '',
}

function obtenerValor(item: Comprador, columna: string): string | number {
  switch (columna) {
    case 'nombre': return item.nombreCompleto
    case 'empresa': return item.empresa
    case 'pais': return item.pais
    case 'ciudad': return item.ciudad
    case 'correo': return item.correo
    case 'telefono': return item.telefono
    case 'fecha': return item.fechaRegistro
    case 'estado': return item.estado
    case 'suscripcion': return item.suscripcion
    default: return ''
  }
}

function AdministracionCompradores() {
  const [compradores, setCompradores] = useState<Comprador[]>(compradoresIniciales)
  const [filtros, setFiltros] = useState(filtrosIniciales)
  const { toasts, mostrarToast, cerrarToast } = useToasts()

  function actualizarFiltro(campo: keyof typeof filtrosIniciales, valor: string) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  function limpiarFiltros() {
    setFiltros(filtrosIniciales)
  }

  function alternarEstado(id: string) {
    setCompradores((anteriores) =>
      anteriores.map((c) => (c.id === id ? { ...c, estado: c.estado === 'activo' ? 'inactivo' : 'activo' } : c)),
    )
  }

  function exportarExcel() {
    mostrarToast('info', `Exportación a Excel simulada (${datosFiltrados.length} registros).`)
  }

  function exportarPDF() {
    mostrarToast('info', `Exportación a PDF simulada (${datosFiltrados.length} registros).`)
  }

  function recargar() {
    setCompradores(compradoresIniciales)
    mostrarToast('success', 'Datos actualizados.')
  }

  const datosFiltrados = compradores.filter((c) => {
    const texto = filtros.busqueda.toLowerCase().trim()
    const coincideBusqueda =
      texto === '' ||
      c.nombreCompleto.toLowerCase().includes(texto) ||
      c.empresa.toLowerCase().includes(texto) ||
      c.correo.toLowerCase().includes(texto) ||
      c.pais.toLowerCase().includes(texto)

    const coincidePais = filtros.pais === '' || c.pais === filtros.pais
    const coincideCiudad = filtros.ciudad === '' || c.ciudad === filtros.ciudad
    const coincideEstado = filtros.estado === '' || c.estado === filtros.estado
    const coincideSuscripcion = filtros.suscripcion === '' || c.suscripcion === filtros.suscripcion
    const coincideFechaDesde = filtros.fechaDesde === '' || c.fechaRegistro >= filtros.fechaDesde
    const coincideFechaHasta = filtros.fechaHasta === '' || c.fechaRegistro <= filtros.fechaHasta

    const coincideParticipo =
      filtros.participoSubastas === '' ||
      (filtros.participoSubastas === 'si' ? idsConOfertas.has(c.id) : !idsConOfertas.has(c.id))
    const coincideMuestras =
      filtros.tieneMuestras === '' ||
      (filtros.tieneMuestras === 'si' ? idsConMuestras.has(c.id) : !idsConMuestras.has(c.id))
    const coincideGano =
      filtros.ganoSubasta === '' ||
      (filtros.ganoSubasta === 'si' ? idsGanadores.has(c.id) : !idsGanadores.has(c.id))

    return (
      coincideBusqueda &&
      coincidePais &&
      coincideCiudad &&
      coincideEstado &&
      coincideSuscripcion &&
      coincideFechaDesde &&
      coincideFechaHasta &&
      coincideParticipo &&
      coincideMuestras &&
      coincideGano
    )
  })

  const { columna, direccion, ordenarPor, datosOrdenados } = useOrdenamiento(datosFiltrados, obtenerValor)
  const { paginaActual, setPaginaActual, porPagina, setPorPagina, totalPaginas, datosPagina, inicio } =
    usePaginacion(datosOrdenados, 10)

  const hayFiltrosActivos = Object.values(filtros).some((valor) => valor !== '')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-cafe-profundo">Compradores</h1>
        <p className="text-sm text-gris-oscuro/60 mt-1">{compradores.length} compradores registrados</p>
      </div>

      <AdminToolbar
        busqueda={filtros.busqueda}
        onBusquedaChange={(valor) => actualizarFiltro('busqueda', valor)}
        placeholderBusqueda="Buscar por nombre, empresa, correo o país..."
        hayFiltrosActivos={hayFiltrosActivos}
        onLimpiarFiltros={limpiarFiltros}
        onExportarExcel={exportarExcel}
        onExportarPDF={exportarPDF}
        onRecargar={recargar}
      >
        <Select
          placeholder="País"
          value={filtros.pais}
          onChange={(e) => actualizarFiltro('pais', e.target.value)}
          opciones={paisesDisponibles.map((p) => ({ value: p, label: p }))}
        />
        <Select
          placeholder="Ciudad"
          value={filtros.ciudad}
          onChange={(e) => actualizarFiltro('ciudad', e.target.value)}
          opciones={ciudadesDisponibles.map((c) => ({ value: c, label: c }))}
        />
        <Select
          placeholder="Estado"
          value={filtros.estado}
          onChange={(e) => actualizarFiltro('estado', e.target.value)}
          opciones={[
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
            { value: 'pendiente', label: 'Pendiente' },
          ]}
        />
        <Select
          placeholder="Suscripción"
          value={filtros.suscripcion}
          onChange={(e) => actualizarFiltro('suscripcion', e.target.value)}
          opciones={[
            { value: 'gratuito', label: 'Gratuito' },
            { value: 'premium', label: 'Premium' },
          ]}
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
        <Select
          placeholder="Participó en subastas"
          value={filtros.participoSubastas}
          onChange={(e) => actualizarFiltro('participoSubastas', e.target.value)}
          opciones={[
            { value: 'si', label: 'Sí participó' },
            { value: 'no', label: 'No participó' },
          ]}
        />
        <Select
          placeholder="Muestras solicitadas"
          value={filtros.tieneMuestras}
          onChange={(e) => actualizarFiltro('tieneMuestras', e.target.value)}
          opciones={[
            { value: 'si', label: 'Con muestras' },
            { value: 'no', label: 'Sin muestras' },
          ]}
        />
        <Select
          placeholder="Subastas ganadas"
          value={filtros.ganoSubasta}
          onChange={(e) => actualizarFiltro('ganoSubasta', e.target.value)}
          opciones={[
            { value: 'si', label: 'Con subastas ganadas' },
            { value: 'no', label: 'Sin subastas ganadas' },
          ]}
        />
      </AdminToolbar>

      <Table
        columnas={[
          { header: 'Nombre', render: (c: Comprador) => c.nombreCompleto, sortKey: 'nombre' },
          { header: 'Empresa', render: (c: Comprador) => c.empresa, sortKey: 'empresa' },
          { header: 'País', render: (c: Comprador) => c.pais, sortKey: 'pais' },
          { header: 'Ciudad', render: (c: Comprador) => c.ciudad, sortKey: 'ciudad' },
          { header: 'Correo', render: (c: Comprador) => c.correo, sortKey: 'correo' },
          { header: 'Teléfono', render: (c: Comprador) => c.telefono, sortKey: 'telefono' },
          { header: 'Registro', render: (c: Comprador) => formatearFecha(c.fechaRegistro), sortKey: 'fecha' },
          {
            header: 'Estado',
            render: (c: Comprador) => <Badge variant={badgePorEstado[c.estado]}>{c.estado}</Badge>,
            sortKey: 'estado',
          },
          {
            header: 'Suscripción',
            render: (c: Comprador) => <Badge variant={badgePorSuscripcion[c.suscripcion]}>{c.suscripcion}</Badge>,
            sortKey: 'suscripcion',
          },
          {
            header: 'Acciones',
            render: (c: Comprador) => (
              <button
                onClick={() => alternarEstado(c.id)}
                title={c.estado === 'activo' ? 'Desactivar' : 'Activar'}
                className={c.estado === 'activo' ? 'text-red-600/70 hover:text-red-600' : 'text-verde-bosque hover:text-verde-bosque/70'}
              >
                <Power size={16} />
              </button>
            ),
          },
        ]}
        datos={datosPagina}
        claveFila={(c) => c.id}
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

export default AdministracionCompradores