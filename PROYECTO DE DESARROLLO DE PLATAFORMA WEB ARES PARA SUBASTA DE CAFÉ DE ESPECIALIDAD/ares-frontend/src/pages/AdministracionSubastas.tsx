import { useState } from 'react'
import { Link } from 'react-router'
import { Eye, Pencil, Plus } from 'lucide-react'
import { subastas as subastasIniciales } from '../data/auctions'
import { ofertas } from '../data/bids'
import { cafes } from '../data/coffees'
import { concursos } from '../data/contests'
import { usePaginacion } from '../hooks/usePaginacion'
import { useOrdenamiento } from '../hooks/useOrdenamiento'
import { useToasts } from '../hooks/useToasts'
import type { Subasta, EstadoSubasta } from '../types'
import Table from '../components/Table'
import AuctionStatus from '../components/AuctionStatus'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import AdminToolbar from '../components/AdminToolbar'
import TableFooter from '../components/TableFooter'
import ToastContainer from '../components/ToastContainer'
import { formatearFecha, formatearPrecio } from '../utils/formatters'

const opcionesEstado: { value: EstadoSubasta; label: string }[] = [
  { value: 'borrador', label: 'Borrador' },
  { value: 'programada', label: 'Programada' },
  { value: 'en_vivo', label: 'En vivo' },
  { value: 'finalizada', label: 'Finalizada' },
  { value: 'cancelada', label: 'Cancelada' },
]

const nombresMes: Record<string, string> = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril', '05': 'Mayo', '06': 'Junio',
  '07': 'Julio', '08': 'Agosto', '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre',
}

const aniosDisponibles = Array.from(new Set(subastasIniciales.map((s) => s.fecha.slice(0, 4)))).sort()
const mesesDisponibles = Array.from(new Set(subastasIniciales.map((s) => s.fecha.slice(5, 7)))).sort()

const valoresVacios = { nombre: '', fecha: '', hora: '', estado: 'borrador' as EstadoSubasta }

function participantesDe(subastaId: string) {
  return new Set(ofertas.filter((o) => o.subastaId === subastaId).map((o) => o.compradorId)).size
}



function ofertaMasAltaDe(subasta: Subasta) {
  if (subasta.cafes.length === 0) return 0
  return Math.max(...subasta.cafes.map((c) => c.ofertaActual))
}

function concursoAsociadoDe(subasta: Subasta) {
  for (const cafeSubasta of subasta.cafes) {
    const cafe = cafes.find((c) => c.id === cafeSubasta.cafeId)
    if (cafe?.concursoId) {
      return concursos.find((con) => con.id === cafe.concursoId)
    }
  }
  return undefined
}

const filtrosIniciales = {
  busqueda: '',
  estado: '',
  fecha: '',
  anio: '',
  mes: '',
  participantesMin: '',
  cafesMin: '',
  concursoId: '',
}

function obtenerValor(item: Subasta, columna: string): string | number {
  switch (columna) {
    case 'nombre': return item.nombre
    case 'fecha': return item.fecha
    case 'hora': return item.hora
    case 'estado': return item.estado
    case 'cafes': return item.cafes.length
    case 'participantes': return participantesDe(item.id)
    case 'ofertaMasAlta': return ofertaMasAltaDe(item)
    default: return ''
  }
}

function AdministracionSubastas() {
  const [subastas, setSubastas] = useState<Subasta[]>(subastasIniciales)
  const [filtros, setFiltros] = useState(filtrosIniciales)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [subastaEnEdicion, setSubastaEnEdicion] = useState<Subasta | null>(null)
  const [valores, setValores] = useState(valoresVacios)
  const { toasts, mostrarToast, cerrarToast } = useToasts()

  function actualizarFiltro(campo: keyof typeof filtrosIniciales, valor: string) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  function limpiarFiltros() {
    setFiltros(filtrosIniciales)
  }

  function abrirNueva() {
    setSubastaEnEdicion(null)
    setValores(valoresVacios)
    setModalAbierto(true)
  }

  function abrirEdicion(subasta: Subasta) {
    setSubastaEnEdicion(subasta)
    setValores({ nombre: subasta.nombre, fecha: subasta.fecha, hora: subasta.hora, estado: subasta.estado })
    setModalAbierto(true)
  }

  function guardar() {
    if (subastaEnEdicion) {
      setSubastas((anteriores) =>
        anteriores.map((s) =>
          s.id === subastaEnEdicion.id
            ? { ...s, nombre: valores.nombre, fecha: valores.fecha, hora: valores.hora, estado: valores.estado }
            : s,
        ),
      )
    } else {
      const nuevoId = `subasta-${String(subastas.length + 1).padStart(2, '0')}`
      const nuevaSubasta: Subasta = {
        id: nuevoId,
        nombre: valores.nombre,
        fecha: valores.fecha,
        hora: valores.hora,
        estado: valores.estado,
        cafes: [],
      }
      setSubastas((anteriores) => [...anteriores, nuevaSubasta])
    }

    setModalAbierto(false)
  }

  function exportarExcel() {
    mostrarToast('info', `Exportación a Excel simulada (${datosFiltrados.length} registros).`)
  }

  function exportarPDF() {
    mostrarToast('info', `Exportación a PDF simulada (${datosFiltrados.length} registros).`)
  }

  function recargar() {
    setSubastas(subastasIniciales)
    mostrarToast('success', 'Datos actualizados.')
  }

  const datosFiltrados = subastas.filter((s) => {
   

    const texto = filtros.busqueda.toLowerCase().trim()
    const nombresCafes = s.cafes
      .map((cs) => cafes.find((c) => c.id === cs.cafeId)?.nombre.toLowerCase() ?? '')
      .join(' ')
    const coincideBusqueda =
      texto === '' ||
      s.nombre.toLowerCase().includes(texto) ||
      nombresCafes.includes(texto)

    const coincideEstado = filtros.estado === '' || s.estado === filtros.estado
    const coincideFecha = filtros.fecha === '' || s.fecha === filtros.fecha
    const coincideAnio = filtros.anio === '' || s.fecha.slice(0, 4) === filtros.anio
    const coincideMes = filtros.mes === '' || s.fecha.slice(5, 7) === filtros.mes
    const coincideParticipantes = filtros.participantesMin === '' || participantesDe(s.id) >= Number(filtros.participantesMin)
    const coincideCafes = filtros.cafesMin === '' || s.cafes.length >= Number(filtros.cafesMin)
    const coincideConcurso = filtros.concursoId === '' || concursoAsociadoDe(s)?.id === filtros.concursoId

    return (
      coincideBusqueda &&
      coincideEstado &&
      coincideFecha &&
      coincideAnio &&
      coincideMes &&
      coincideParticipantes &&
      coincideCafes &&
      coincideConcurso
    )
  })

  const { columna, direccion, ordenarPor, datosOrdenados } = useOrdenamiento(datosFiltrados, obtenerValor)
  const { paginaActual, setPaginaActual, porPagina, setPorPagina, totalPaginas, datosPagina, inicio } =
    usePaginacion(datosOrdenados, 10)

  const hayFiltrosActivos = Object.values(filtros).some((valor) => valor !== '')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-cafe-profundo">Subastas</h1>
          <p className="text-sm text-gris-oscuro/60 mt-1">{subastas.length} subastas registradas</p>
        </div>
        <Button variant="primary" onClick={abrirNueva} className="flex items-center gap-2">
          <Plus size={18} /> Crear subasta
        </Button>
      </div>

      <AdminToolbar
        busqueda={filtros.busqueda}
        onBusquedaChange={(valor) => actualizarFiltro('busqueda', valor)}
        placeholderBusqueda="Buscar por nombre o café..."
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
          opciones={opcionesEstado}
        />
        <Input
          type="date"
          value={filtros.fecha}
          onChange={(e) => actualizarFiltro('fecha', e.target.value)}
          className="text-sm"
        />
        <Select
          placeholder="Año"
          value={filtros.anio}
          onChange={(e) => actualizarFiltro('anio', e.target.value)}
          opciones={aniosDisponibles.map((a) => ({ value: a, label: a }))}
        />
        <Select
          placeholder="Mes"
          value={filtros.mes}
          onChange={(e) => actualizarFiltro('mes', e.target.value)}
          opciones={mesesDisponibles.map((m) => ({ value: m, label: nombresMes[m] }))}
        />
        <Select
          placeholder="Participantes mínimos"
          value={filtros.participantesMin}
          onChange={(e) => actualizarFiltro('participantesMin', e.target.value)}
          opciones={[
            { value: '1', label: '1+' },
            { value: '5', label: '5+' },
            { value: '8', label: '8+' },
          ]}
        />
        <Select
          placeholder="Cantidad de cafés"
          value={filtros.cafesMin}
          onChange={(e) => actualizarFiltro('cafesMin', e.target.value)}
          opciones={[
            { value: '1', label: '1+' },
            { value: '2', label: '2+' },
            { value: '4', label: '4+' },
          ]}
        />
        <Select
          placeholder="Concurso asociado"
          value={filtros.concursoId}
          onChange={(e) => actualizarFiltro('concursoId', e.target.value)}
          opciones={concursos.map((c) => ({ value: c.id, label: c.nombre }))}
        />
      </AdminToolbar>

      <Table
        columnas={[
          { header: 'Nombre', render: (s: Subasta) => s.nombre, sortKey: 'nombre' },
          { header: 'Fecha', render: (s: Subasta) => formatearFecha(s.fecha), sortKey: 'fecha' },
          { header: 'Hora', render: (s: Subasta) => s.hora, sortKey: 'hora' },
          { header: 'Estado', render: (s: Subasta) => <AuctionStatus estado={s.estado} />, sortKey: 'estado' },
          { header: 'Cafés', render: (s: Subasta) => s.cafes.length, sortKey: 'cafes' },
          { header: 'Participantes', render: (s: Subasta) => participantesDe(s.id), sortKey: 'participantes' },
          {
            header: 'Oferta más alta',
            render: (s: Subasta) => (s.cafes.length > 0 ? formatearPrecio(ofertaMasAltaDe(s)) : '—'),
            sortKey: 'ofertaMasAlta',
          },
          {
            header: 'Acciones',
            render: (s: Subasta) => (
              <div className="flex items-center gap-3">
                <Link to={`/subastas/${s.id}`} title="Ver" className="text-verde-bosque hover:text-verde-bosque/70">
                  <Eye size={17} />
                </Link>
                <button onClick={() => abrirEdicion(s)} title="Editar" className="text-gris-oscuro/60 hover:text-cafe-profundo">
                  <Pencil size={16} />
                </button>
              </div>
            ),
          },
        ]}
        datos={datosPagina}
        claveFila={(s) => s.id}
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

      <Modal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        titulo={subastaEnEdicion ? 'Editar subasta' : 'Crear subasta'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            required
            value={valores.nombre}
            onChange={(e) => setValores({ ...valores, nombre: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha"
              type="date"
              required
              value={valores.fecha}
              onChange={(e) => setValores({ ...valores, fecha: e.target.value })}
            />
            <Input
              label="Hora"
              type="time"
              required
              value={valores.hora}
              onChange={(e) => setValores({ ...valores, hora: e.target.value })}
            />
          </div>

          <Select
            label="Estado"
            required
            value={valores.estado}
            onChange={(e) => setValores({ ...valores, estado: e.target.value as EstadoSubasta })}
            opciones={opcionesEstado}
          />

          {!subastaEnEdicion && (
            <p className="text-xs text-gris-oscuro/50">
              La subasta se crea sin cafés asignados. Podrás asociarlos cuando el backend esté conectado.
            </p>
          )}

          <Button variant="primary" className="w-full" onClick={guardar}>
            {subastaEnEdicion ? 'Guardar cambios' : 'Crear subasta'}
          </Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onCerrar={cerrarToast} />
    </div>
  )
}

export default AdministracionSubastas