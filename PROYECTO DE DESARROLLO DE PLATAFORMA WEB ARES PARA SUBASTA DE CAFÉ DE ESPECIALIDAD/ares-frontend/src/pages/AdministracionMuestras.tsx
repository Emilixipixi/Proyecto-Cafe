import { useState } from 'react'
import { ArrowRight, XCircle } from 'lucide-react'
import { muestras as muestrasIniciales } from '../data/samples'
import { compradores } from '../data/buyers'
import { cafes } from '../data/coffees'
import { productores } from '../data/producers'
import { usePaginacion } from '../hooks/usePaginacion'
import { useOrdenamiento } from '../hooks/useOrdenamiento'
import { useToasts } from '../hooks/useToasts'
import type { Muestra, EstadoMuestra } from '../types'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Select from '../components/Select'
import Input from '../components/Input'
import AdminToolbar from '../components/AdminToolbar'
import TableFooter from '../components/TableFooter'
import ToastContainer from '../components/ToastContainer'
import { formatearFecha } from '../utils/formatters'

const etiquetasEstado: Record<EstadoMuestra, string> = {
  solicitada: 'Solicitada',
  preparando: 'Preparando',
  enviada: 'Enviada',
  entregada: 'Entregada',
  cancelada: 'Cancelada',
}

const badgePorEstado: Record<EstadoMuestra, 'info' | 'warning' | 'success' | 'error'> = {
  solicitada: 'info',
  preparando: 'warning',
  enviada: 'warning',
  entregada: 'success',
  cancelada: 'error',
}

const flujoEstados: EstadoMuestra[] = ['solicitada', 'preparando', 'enviada', 'entregada']

function siguienteEstado(actual: EstadoMuestra): EstadoMuestra | null {
  const indice = flujoEstados.indexOf(actual)
  if (indice === -1 || indice === flujoEstados.length - 1) return null
  return flujoEstados[indice + 1]
}

function codigoEnvio(muestra: Muestra): string {
  return `ARES-${muestra.id.replace('muestra-', '').padStart(4, '0')}-EC`
}

function compradorDe(muestra: Muestra) {
  return compradores.find((c) => c.id === muestra.compradorId)
}

function cafeDe(muestra: Muestra) {
  return cafes.find((c) => c.id === muestra.cafeId)
}

function productorDe(muestra: Muestra) {
  const cafe = cafeDe(muestra)
  return cafe ? productores.find((p) => p.id === cafe.productorId) : undefined
}

const paisesDisponibles = Array.from(new Set(compradores.map((c) => c.pais))).sort()
const provinciasDisponibles = Array.from(new Set(productores.map((p) => p.provincia))).sort()

const filtrosIniciales = {
  busqueda: '',
  estado: '',
  fechaDesde: '',
  fechaHasta: '',
  paisComprador: '',
  provinciaProductor: '',
}

function obtenerValor(item: Muestra, columna: string): string | number {
  switch (columna) {
    case 'comprador': return compradorDe(item)?.nombreCompleto ?? ''
    case 'cafe': return cafeDe(item)?.nombre ?? ''
    case 'productor': return productorDe(item)?.nombre ?? ''
    case 'fecha': return item.fecha
    case 'estado': return item.estado
    default: return ''
  }
}

function AdministracionMuestras() {
  const [muestras, setMuestras] = useState<Muestra[]>(muestrasIniciales)
  const [filtros, setFiltros] = useState(filtrosIniciales)
  const { toasts, mostrarToast, cerrarToast } = useToasts()

  function actualizarFiltro(campo: keyof typeof filtrosIniciales, valor: string) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  function limpiarFiltros() {
    setFiltros(filtrosIniciales)
  }

  function avanzarEstado(id: string) {
    setMuestras((anteriores) =>
      anteriores.map((m) => {
        if (m.id !== id) return m
        const siguiente = siguienteEstado(m.estado)
        return siguiente ? { ...m, estado: siguiente } : m
      }),
    )
  }

  function cancelar(id: string) {
    setMuestras((anteriores) => anteriores.map((m) => (m.id === id ? { ...m, estado: 'cancelada' } : m)))
  }

  function exportarExcel() {
    mostrarToast('info', `Exportación a Excel simulada (${datosFiltrados.length} registros).`)
  }

  function exportarPDF() {
    mostrarToast('info', `Exportación a PDF simulada (${datosFiltrados.length} registros).`)
  }

  function recargar() {
    setMuestras(muestrasIniciales)
    mostrarToast('success', 'Datos actualizados.')
  }

  const datosFiltrados = muestras.filter((m) => {
    const comprador = compradorDe(m)
    const cafe = cafeDe(m)
    const productor = productorDe(m)

    const texto = filtros.busqueda.toLowerCase().trim()
    const coincideBusqueda =
      texto === '' ||
      (comprador?.nombreCompleto.toLowerCase().includes(texto) ?? false) ||
      (cafe?.nombre.toLowerCase().includes(texto) ?? false) ||
      (productor?.nombre.toLowerCase().includes(texto) ?? false)

    const coincideEstado = filtros.estado === '' || m.estado === filtros.estado
    const coincideFechaDesde = filtros.fechaDesde === '' || m.fecha >= filtros.fechaDesde
    const coincideFechaHasta = filtros.fechaHasta === '' || m.fecha <= filtros.fechaHasta
    const coincidePais = filtros.paisComprador === '' || comprador?.pais === filtros.paisComprador
    const coincideProvincia = filtros.provinciaProductor === '' || productor?.provincia === filtros.provinciaProductor

    return (
      coincideBusqueda &&
      coincideEstado &&
      coincideFechaDesde &&
      coincideFechaHasta &&
      coincidePais &&
      coincideProvincia
    )
  })

  const { columna, direccion, ordenarPor, datosOrdenados } = useOrdenamiento(datosFiltrados, obtenerValor)
  const { paginaActual, setPaginaActual, porPagina, setPorPagina, totalPaginas, datosPagina, inicio } =
    usePaginacion(datosOrdenados, 10)

  const hayFiltrosActivos = Object.values(filtros).some((valor) => valor !== '')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-cafe-profundo">Muestras</h1>
        <p className="text-sm text-gris-oscuro/60 mt-1">{muestras.length} solicitudes de muestra</p>
      </div>

      <AdminToolbar
        busqueda={filtros.busqueda}
        onBusquedaChange={(valor) => actualizarFiltro('busqueda', valor)}
        placeholderBusqueda="Buscar por comprador, café o productor..."
        hayFiltrosActivos={hayFiltrosActivos}
        onLimpiarFiltros={limpiarFiltros}
        onExportarExcel={exportarExcel}
        onExportarPDF={exportarPDF}
        onRecargar={recargar}
      >
        <Select
          placeholder="Estado"
          value={filtros.estado}
          onChange={(e) => actualizarFiltro('estado', e.target.value)}
          opciones={Object.entries(etiquetasEstado).map(([value, label]) => ({ value, label }))}
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
          placeholder="País del comprador"
          value={filtros.paisComprador}
          onChange={(e) => actualizarFiltro('paisComprador', e.target.value)}
          opciones={paisesDisponibles.map((p) => ({ value: p, label: p }))}
        />
        <Select
          placeholder="Provincia del productor"
          value={filtros.provinciaProductor}
          onChange={(e) => actualizarFiltro('provinciaProductor', e.target.value)}
          opciones={provinciasDisponibles.map((p) => ({ value: p, label: p }))}
        />
      </AdminToolbar>

      <Table
        columnas={[
          { header: 'Comprador', render: (m: Muestra) => compradorDe(m)?.nombreCompleto ?? '—', sortKey: 'comprador' },
          { header: 'Café', render: (m: Muestra) => cafeDe(m)?.nombre ?? '—', sortKey: 'cafe' },
          { header: 'Productor', render: (m: Muestra) => productorDe(m)?.nombre ?? '—', sortKey: 'productor' },
          { header: 'Fecha', render: (m: Muestra) => formatearFecha(m.fecha), sortKey: 'fecha' },
          { header: 'Estado', render: (m: Muestra) => <Badge variant={badgePorEstado[m.estado]}>{etiquetasEstado[m.estado]}</Badge>, sortKey: 'estado' },
          {
            header: 'Guía',
            render: (m: Muestra) =>
              m.estado === 'enviada' || m.estado === 'entregada' ? (
                <span className="font-mono text-xs text-gris-oscuro/70">{codigoEnvio(m)}</span>
              ) : (
                <span className="text-gris-oscuro/40">—</span>
              ),
          },
          {
            header: 'Acciones',
            render: (m: Muestra) => {
              const siguiente = siguienteEstado(m.estado)
              const puedeGestionar = m.estado !== 'entregada' && m.estado !== 'cancelada'

              if (!puedeGestionar) {
                return <span className="text-gris-oscuro/30 text-xs">Sin acciones</span>
              }

              return (
                <div className="flex items-center gap-3">
                  {siguiente && (
                    <button
                      onClick={() => avanzarEstado(m.id)}
                      title={`Marcar como ${etiquetasEstado[siguiente].toLowerCase()}`}
                      className="flex items-center gap-1 text-verde-bosque hover:text-verde-bosque/70 text-xs font-medium"
                    >
                      <ArrowRight size={15} /> {etiquetasEstado[siguiente]}
                    </button>
                  )}
                  <button onClick={() => cancelar(m.id)} title="Cancelar" className="text-red-600/70 hover:text-red-600">
                    <XCircle size={16} />
                  </button>
                </div>
              )
            },
          },
        ]}
        datos={datosPagina}
        claveFila={(m) => m.id}
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

export default AdministracionMuestras