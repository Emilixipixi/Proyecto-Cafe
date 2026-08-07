import { useState } from 'react'
import { Link } from 'react-router'
import { Eye, Pencil, Power, Plus } from 'lucide-react'
import { productores as productoresIniciales } from '../data/producers'
import { cafes } from '../data/coffees'
import { concursos } from '../data/contests'
import { usePaginacion } from '../hooks/usePaginacion'
import { useOrdenamiento } from '../hooks/useOrdenamiento'
import { useToasts } from '../hooks/useToasts'
import type { Productor } from '../types'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import AdminToolbar from '../components/AdminToolbar'
import TableFooter from '../components/TableFooter'
import ToastContainer from '../components/ToastContainer'

const valoresVacios = { nombre: '', finca: '', ubicacion: '', provincia: 'Loja', altitud: '' }

const provinciasDisponibles = Array.from(new Set(productoresIniciales.map((p) => p.provincia))).sort()
const cantonesDisponibles = Array.from(new Set(productoresIniciales.map((p) => p.ubicacion))).sort()
const variedadesDisponibles = Array.from(new Set(productoresIniciales.flatMap((p) => p.variedades))).sort()
const procesosDisponibles = Array.from(new Set(productoresIniciales.flatMap((p) => p.procesos))).sort()

const idsConCafesEnSubasta = new Set(
  cafes.filter((c) => c.estado === 'en_subasta').map((c) => c.productorId),
)
const idsGanadoresConcurso = new Set(
  concursos.flatMap((concurso) => concurso.ranking.filter((r) => r.posicion === 1).map((r) => r.productorId)),
)

const filtrosIniciales = {
  busqueda: '',
  provincia: '',
  canton: '',
  altitudMin: '',
  variedad: '',
  proceso: '',
  cafesEnSubasta: '',
  ganadorConcurso: '',
  estado: '',
}

function numeroCafesDe(productorId: string) {
  return cafes.filter((c) => c.productorId === productorId).length
}

function obtenerValor(item: Productor, columna: string): string | number {
  switch (columna) {
    case 'nombre': return item.nombre
    case 'finca': return item.finca
    case 'provincia': return item.provincia
    case 'canton': return item.ubicacion
    case 'altitud': return item.altitud
    case 'variedad': return item.variedades[0] ?? ''
    case 'cafes': return numeroCafesDe(item.id)
    case 'estado': return item.estado
    default: return ''
  }
}

function AdministracionProductores() {
  const [productores, setProductores] = useState<Productor[]>(productoresIniciales)
  const [filtros, setFiltros] = useState(filtrosIniciales)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productorEnEdicion, setProductorEnEdicion] = useState<Productor | null>(null)
  const [valores, setValores] = useState(valoresVacios)
  const { toasts, mostrarToast, cerrarToast } = useToasts()

  function actualizarFiltro(campo: keyof typeof filtrosIniciales, valor: string) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  function limpiarFiltros() {
    setFiltros(filtrosIniciales)
  }

  function abrirNuevo() {
    setProductorEnEdicion(null)
    setValores(valoresVacios)
    setModalAbierto(true)
  }

  function abrirEdicion(productor: Productor) {
    setProductorEnEdicion(productor)
    setValores({
      nombre: productor.nombre,
      finca: productor.finca,
      ubicacion: productor.ubicacion,
      provincia: productor.provincia,
      altitud: String(productor.altitud),
    })
    setModalAbierto(true)
  }

  function guardar() {
    if (productorEnEdicion) {
      setProductores((anteriores) =>
        anteriores.map((p) =>
          p.id === productorEnEdicion.id
            ? { ...p, nombre: valores.nombre, finca: valores.finca, ubicacion: valores.ubicacion, provincia: valores.provincia, altitud: Number(valores.altitud) }
            : p,
        ),
      )
    } else {
      const nuevoId = `prod-${String(productores.length + 1).padStart(2, '0')}`
      const nuevoProductor: Productor = {
        id: nuevoId,
        nombre: valores.nombre,
        finca: valores.finca,
        ubicacion: valores.ubicacion,
        provincia: valores.provincia,
        altitud: Number(valores.altitud),
        variedades: [],
        procesos: [],
        puntaje: 0,
        descripcion: 'Productor recién incorporado a la red ARES.',
        historia: 'Historia pendiente de completar.',
        fotografia: `https://picsum.photos/seed/${nuevoId}/600/600`,
        premios: [],
        estado: 'activo',
      }
      setProductores((anteriores) => [...anteriores, nuevoProductor])
    }

    setModalAbierto(false)
  }

  function alternarEstado(id: string) {
    setProductores((anteriores) =>
      anteriores.map((p) => (p.id === id ? { ...p, estado: p.estado === 'activo' ? 'inactivo' : 'activo' } : p)),
    )
  }

  function exportarExcel() {
    mostrarToast('info', `Exportación a Excel simulada (${datosFiltrados.length} registros).`)
  }

  function exportarPDF() {
    mostrarToast('info', `Exportación a PDF simulada (${datosFiltrados.length} registros).`)
  }

  function recargar() {
    setProductores(productoresIniciales)
    mostrarToast('success', 'Datos actualizados.')
  }

  const datosFiltrados = productores.filter((p) => {
    const texto = filtros.busqueda.toLowerCase().trim()
    const coincideBusqueda =
      texto === '' ||
      p.nombre.toLowerCase().includes(texto) ||
      p.finca.toLowerCase().includes(texto) ||
      p.provincia.toLowerCase().includes(texto)

    const coincideProvincia = filtros.provincia === '' || p.provincia === filtros.provincia
    const coincideCanton = filtros.canton === '' || p.ubicacion === filtros.canton
    const coincideAltitud = filtros.altitudMin === '' || p.altitud >= Number(filtros.altitudMin)
    const coincideVariedad = filtros.variedad === '' || p.variedades.includes(filtros.variedad)
    const coincideProceso = filtros.proceso === '' || p.procesos.includes(filtros.proceso)
    const coincideEstado = filtros.estado === '' || p.estado === filtros.estado

    const coincideCafesSubasta =
      filtros.cafesEnSubasta === '' ||
      (filtros.cafesEnSubasta === 'si' ? idsConCafesEnSubasta.has(p.id) : !idsConCafesEnSubasta.has(p.id))
    const coincideGanador =
      filtros.ganadorConcurso === '' ||
      (filtros.ganadorConcurso === 'si' ? idsGanadoresConcurso.has(p.id) : !idsGanadoresConcurso.has(p.id))

    return (
      coincideBusqueda &&
      coincideProvincia &&
      coincideCanton &&
      coincideAltitud &&
      coincideVariedad &&
      coincideProceso &&
      coincideEstado &&
      coincideCafesSubasta &&
      coincideGanador
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
          <h1 className="font-display text-3xl text-cafe-profundo">Productores</h1>
          <p className="text-sm text-gris-oscuro/60 mt-1">{productores.length} productores registrados</p>
        </div>
        <Button variant="primary" onClick={abrirNuevo} className="flex items-center gap-2">
          <Plus size={18} /> Nuevo productor
        </Button>
      </div>

      <AdminToolbar
        busqueda={filtros.busqueda}
        onBusquedaChange={(valor) => actualizarFiltro('busqueda', valor)}
        placeholderBusqueda="Buscar por nombre, finca o provincia..."
        hayFiltrosActivos={hayFiltrosActivos}
        onLimpiarFiltros={limpiarFiltros}
        onExportarExcel={exportarExcel}
        onExportarPDF={exportarPDF}
        onRecargar={recargar}
      >
        <Select
          placeholder="Provincia"
          value={filtros.provincia}
          onChange={(e) => actualizarFiltro('provincia', e.target.value)}
          opciones={provinciasDisponibles.map((p) => ({ value: p, label: p }))}
        />
        <Select
          placeholder="Cantón"
          value={filtros.canton}
          onChange={(e) => actualizarFiltro('canton', e.target.value)}
          opciones={cantonesDisponibles.map((c) => ({ value: c, label: c }))}
        />
        <Select
          placeholder="Altitud mínima"
          value={filtros.altitudMin}
          onChange={(e) => actualizarFiltro('altitudMin', e.target.value)}
          opciones={[
            { value: '1500', label: '1500+ msnm' },
            { value: '1700', label: '1700+ msnm' },
            { value: '1900', label: '1900+ msnm' },
            { value: '2100', label: '2100+ msnm' },
          ]}
        />
        <Select
          placeholder="Variedad"
          value={filtros.variedad}
          onChange={(e) => actualizarFiltro('variedad', e.target.value)}
          opciones={variedadesDisponibles.map((v) => ({ value: v, label: v }))}
        />
        <Select
          placeholder="Proceso"
          value={filtros.proceso}
          onChange={(e) => actualizarFiltro('proceso', e.target.value)}
          opciones={procesosDisponibles.map((p) => ({ value: p, label: p }))}
        />
        <Select
          placeholder="Estado"
          value={filtros.estado}
          onChange={(e) => actualizarFiltro('estado', e.target.value)}
          opciones={[
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
          ]}
        />
        <Select
          placeholder="Cafés en subasta"
          value={filtros.cafesEnSubasta}
          onChange={(e) => actualizarFiltro('cafesEnSubasta', e.target.value)}
          opciones={[
            { value: 'si', label: 'Con cafés en subasta' },
            { value: 'no', label: 'Sin cafés en subasta' },
          ]}
        />
        <Select
          placeholder="Ganadores de concurso"
          value={filtros.ganadorConcurso}
          onChange={(e) => actualizarFiltro('ganadorConcurso', e.target.value)}
          opciones={[
            { value: 'si', label: 'Ganadores (puesto #1)' },
            { value: 'no', label: 'Sin puesto #1' },
          ]}
        />
      </AdminToolbar>

      <Table
        columnas={[
          { header: 'Productor', render: (p: Productor) => p.nombre, sortKey: 'nombre' },
          { header: 'Finca', render: (p: Productor) => p.finca, sortKey: 'finca' },
          { header: 'Provincia', render: (p: Productor) => p.provincia, sortKey: 'provincia' },
          { header: 'Cantón', render: (p: Productor) => p.ubicacion, sortKey: 'canton' },
          { header: 'Altitud', render: (p: Productor) => `${p.altitud} msnm`, sortKey: 'altitud' },
          { header: 'Variedad', render: (p: Productor) => p.variedades[0] ?? '—', sortKey: 'variedad' },
          { header: 'Cafés', render: (p: Productor) => numeroCafesDe(p.id), sortKey: 'cafes' },
          {
            header: 'Estado',
            render: (p: Productor) => <Badge variant={p.estado === 'activo' ? 'success' : 'error'}>{p.estado}</Badge>,
            sortKey: 'estado',
          },
          {
            header: 'Acciones',
            render: (p: Productor) => (
              <div className="flex items-center gap-3">
                <Link to={`/productores/${p.id}`} title="Ver" className="text-verde-bosque hover:text-verde-bosque/70">
                  <Eye size={17} />
                </Link>
                <button onClick={() => abrirEdicion(p)} title="Editar" className="text-gris-oscuro/60 hover:text-cafe-profundo">
                  <Pencil size={16} />
                </button>
                <button onClick={() => alternarEstado(p.id)} title={p.estado === 'activo' ? 'Desactivar' : 'Activar'} className="text-red-600/70 hover:text-red-600">
                  <Power size={16} />
                </button>
              </div>
            ),
          },
        ]}
        datos={datosPagina}
        claveFila={(p) => p.id}
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
        titulo={productorEnEdicion ? 'Editar productor' : 'Nuevo productor'}
      >
        <div className="space-y-4">
          <Input label="Nombre" required value={valores.nombre} onChange={(e) => setValores({ ...valores, nombre: e.target.value })} />
          <Input label="Finca" required value={valores.finca} onChange={(e) => setValores({ ...valores, finca: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ubicación (cantón)" required value={valores.ubicacion} onChange={(e) => setValores({ ...valores, ubicacion: e.target.value })} />
            <Input label="Provincia" required value={valores.provincia} onChange={(e) => setValores({ ...valores, provincia: e.target.value })} />
          </div>
          <Input label="Altitud (msnm)" type="number" required value={valores.altitud} onChange={(e) => setValores({ ...valores, altitud: e.target.value })} />
          <Button variant="primary" className="w-full" onClick={guardar}>
            {productorEnEdicion ? 'Guardar cambios' : 'Crear productor'}
          </Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onCerrar={cerrarToast} />
    </div>
  )
}

export default AdministracionProductores