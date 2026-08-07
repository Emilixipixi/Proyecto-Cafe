import { useState } from 'react'
import { Link } from 'react-router'
import { Eye, Pencil, Upload, Power, Plus } from 'lucide-react'
import { cafes as cafesIniciales } from '../data/coffees'
import { productores } from '../data/producers'
import { concursos } from '../data/contests'
import { muestras } from '../data/samples'
import { obtenerSubastaDeCafe } from '../utils/subastas'
import { usePaginacion } from '../hooks/usePaginacion'
import { useOrdenamiento } from '../hooks/useOrdenamiento'
import { useToasts } from '../hooks/useToasts'
import type { Cafe, EstadoCafe } from '../types'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import AdminToolbar from '../components/AdminToolbar'
import TableFooter from '../components/TableFooter'
import ToastContainer from '../components/ToastContainer'

const etiquetasEstado: Record<EstadoCafe, string> = {
  disponible: 'Disponible',
  en_subasta: 'En subasta',
  vendido: 'Vendido',
  no_disponible: 'No disponible',
}

const badgePorEstado: Record<EstadoCafe, 'success' | 'warning' | 'info' | 'error'> = {
  disponible: 'success',
  en_subasta: 'warning',
  vendido: 'info',
  no_disponible: 'error',
}

const provinciasDisponibles = Array.from(new Set(productores.map((p) => p.provincia))).sort()
const variedadesDisponibles = Array.from(new Set(cafesIniciales.map((c) => c.variedad))).sort()
const procesosDisponibles = Array.from(new Set(cafesIniciales.map((c) => c.proceso))).sort()
const idsConMuestras = new Set(muestras.map((m) => m.cafeId))

const valoresVacios = {
  nombre: '', productorId: '', variedad: '', proceso: '',
  altitud: '', puntaje: '', precioBase: '', descripcion: '',
}

const filtrosIniciales = {
  busqueda: '',
  provincia: '',
  productorId: '',
  variedad: '',
  proceso: '',
  puntajeMin: '',
  concursoId: '',
  estado: '',
  disponibleSubasta: '',
  yaSubastado: '',
  enMuestras: '',
  pendienteAprobacion: '',
}

function productorDe(cafe: Cafe) {
  return productores.find((p) => p.id === cafe.productorId)
}

function concursoDe(cafe: Cafe) {
  return cafe.concursoId ? concursos.find((c) => c.id === cafe.concursoId) : undefined
}

function obtenerValor(item: Cafe, columna: string): string | number {
  switch (columna) {
    case 'nombre': return item.nombre
    case 'productor': return productorDe(item)?.nombre ?? ''
    case 'finca': return productorDe(item)?.finca ?? ''
    case 'variedad': return item.variedad
    case 'proceso': return item.proceso
    case 'puntaje': return item.puntaje
    case 'estado': return item.estado
    case 'concurso': return concursoDe(item)?.nombre ?? ''
    case 'subasta': return obtenerSubastaDeCafe(item.id)?.nombre ?? ''
    default: return ''
  }
}

function AdministracionCafes() {
  const [cafes, setCafes] = useState<Cafe[]>(cafesIniciales)
  const [filtros, setFiltros] = useState(filtrosIniciales)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [cafeEnEdicion, setCafeEnEdicion] = useState<Cafe | null>(null)
  const [valores, setValores] = useState(valoresVacios)
  const { toasts, mostrarToast, cerrarToast } = useToasts()

  function actualizarFiltro(campo: keyof typeof filtrosIniciales, valor: string) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  function limpiarFiltros() {
    setFiltros(filtrosIniciales)
  }

  function abrirNuevo() {
    setCafeEnEdicion(null)
    setValores(valoresVacios)
    setModalAbierto(true)
  }

  function abrirEdicion(cafe: Cafe) {
    setCafeEnEdicion(cafe)
    setValores({
      nombre: cafe.nombre,
      productorId: cafe.productorId,
      variedad: cafe.variedad,
      proceso: cafe.proceso,
      altitud: String(cafe.altitud),
      puntaje: String(cafe.puntaje),
      precioBase: String(cafe.precioBase),
      descripcion: cafe.descripcion,
    })
    setModalAbierto(true)
  }

  function guardar() {
    if (cafeEnEdicion) {
      setCafes((anteriores) =>
        anteriores.map((c) =>
          c.id === cafeEnEdicion.id
            ? {
                ...c,
                nombre: valores.nombre,
                productorId: valores.productorId,
                variedad: valores.variedad,
                proceso: valores.proceso,
                altitud: Number(valores.altitud),
                puntaje: Number(valores.puntaje),
                precioBase: Number(valores.precioBase),
                descripcion: valores.descripcion,
              }
            : c,
        ),
      )
    } else {
      const nuevoId = `cafe-${String(cafes.length + 1).padStart(2, '0')}`
      const nuevoCafe: Cafe = {
        id: nuevoId,
        nombre: valores.nombre,
        productorId: valores.productorId,
        variedad: valores.variedad,
        proceso: valores.proceso,
        altitud: Number(valores.altitud),
        puntaje: Number(valores.puntaje),
        notasCata: [],
        precioBase: Number(valores.precioBase),
        estado: 'no_disponible',
        imagen: `https://picsum.photos/seed/${nuevoId}/800/600`,
        descripcion: valores.descripcion,
      }
      setCafes((anteriores) => [...anteriores, nuevoCafe])
    }

    setModalAbierto(false)
  }

  function alternarPublicacion(id: string) {
    setCafes((anteriores) =>
      anteriores.map((c) =>
        c.id === id ? { ...c, estado: c.estado === 'no_disponible' ? 'disponible' : 'no_disponible' } : c,
      ),
    )
  }

  function exportarExcel() {
    mostrarToast('info', `Exportación a Excel simulada (${datosFiltrados.length} registros).`)
  }

  function exportarPDF() {
    mostrarToast('info', `Exportación a PDF simulada (${datosFiltrados.length} registros).`)
  }

  function recargar() {
    setCafes(cafesIniciales)
    mostrarToast('success', 'Datos actualizados.')
  }

  const datosFiltrados = cafes.filter((c) => {
    const productor = productorDe(c)
    const texto = filtros.busqueda.toLowerCase().trim()
    const coincideBusqueda =
      texto === '' ||
      c.nombre.toLowerCase().includes(texto) ||
      (productor?.nombre.toLowerCase().includes(texto) ?? false) ||
      (productor?.finca.toLowerCase().includes(texto) ?? false)

    const coincideProvincia = filtros.provincia === '' || productor?.provincia === filtros.provincia
    const coincideProductor = filtros.productorId === '' || c.productorId === filtros.productorId
    const coincideVariedad = filtros.variedad === '' || c.variedad === filtros.variedad
    const coincideProceso = filtros.proceso === '' || c.proceso === filtros.proceso
    const coincidePuntaje = filtros.puntajeMin === '' || c.puntaje >= Number(filtros.puntajeMin)
    const coincideConcurso = filtros.concursoId === '' || c.concursoId === filtros.concursoId
    const coincideEstado = filtros.estado === '' || c.estado === filtros.estado

    const estaEnSubasta = !!obtenerSubastaDeCafe(c.id)
    const coincideDisponible =
      filtros.disponibleSubasta === '' ||
      (filtros.disponibleSubasta === 'si' ? c.estado === 'disponible' : c.estado !== 'disponible')
    const coincideYaSubastado =
      filtros.yaSubastado === '' || (filtros.yaSubastado === 'si' ? estaEnSubasta : !estaEnSubasta)
    const coincideMuestras =
      filtros.enMuestras === '' || (filtros.enMuestras === 'si' ? idsConMuestras.has(c.id) : !idsConMuestras.has(c.id))
    const coincidePendiente =
      filtros.pendienteAprobacion === '' ||
      (filtros.pendienteAprobacion === 'si' ? c.estado === 'no_disponible' : c.estado !== 'no_disponible')

    return (
      coincideBusqueda &&
      coincideProvincia &&
      coincideProductor &&
      coincideVariedad &&
      coincideProceso &&
      coincidePuntaje &&
      coincideConcurso &&
      coincideEstado &&
      coincideDisponible &&
      coincideYaSubastado &&
      coincideMuestras &&
      coincidePendiente
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
          <h1 className="font-display text-3xl text-cafe-profundo">Cafés</h1>
          <p className="text-sm text-gris-oscuro/60 mt-1">{cafes.length} cafés registrados</p>
        </div>
        <Button variant="primary" onClick={abrirNuevo} className="flex items-center gap-2">
          <Plus size={18} /> Nuevo café
        </Button>
      </div>

      <AdminToolbar
        busqueda={filtros.busqueda}
        onBusquedaChange={(valor) => actualizarFiltro('busqueda', valor)}
        placeholderBusqueda="Buscar por café, productor o finca..."
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
          placeholder="Productor"
          value={filtros.productorId}
          onChange={(e) => actualizarFiltro('productorId', e.target.value)}
          opciones={productores.map((p) => ({ value: p.id, label: p.nombre }))}
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
          placeholder="Puntaje mínimo"
          value={filtros.puntajeMin}
          onChange={(e) => actualizarFiltro('puntajeMin', e.target.value)}
          opciones={[
            { value: '85', label: '85+ puntos' },
            { value: '88', label: '88+ puntos' },
            { value: '90', label: '90+ puntos' },
            { value: '92', label: '92+ puntos' },
          ]}
        />
        <Select
          placeholder="Concurso"
          value={filtros.concursoId}
          onChange={(e) => actualizarFiltro('concursoId', e.target.value)}
          opciones={concursos.map((c) => ({ value: c.id, label: c.nombre }))}
        />
        <Select
          placeholder="Estado"
          value={filtros.estado}
          onChange={(e) => actualizarFiltro('estado', e.target.value)}
          opciones={Object.entries(etiquetasEstado).map(([value, label]) => ({ value, label }))}
        />
        <Select
          placeholder="Disponible para subasta"
          value={filtros.disponibleSubasta}
          onChange={(e) => actualizarFiltro('disponibleSubasta', e.target.value)}
          opciones={[
            { value: 'si', label: 'Disponibles' },
            { value: 'no', label: 'No disponibles' },
          ]}
        />
        <Select
          placeholder="Ya subastado"
          value={filtros.yaSubastado}
          onChange={(e) => actualizarFiltro('yaSubastado', e.target.value)}
          opciones={[
            { value: 'si', label: 'Asignados a subasta' },
            { value: 'no', label: 'Sin subasta' },
          ]}
        />
        <Select
          placeholder="En muestras"
          value={filtros.enMuestras}
          onChange={(e) => actualizarFiltro('enMuestras', e.target.value)}
          opciones={[
            { value: 'si', label: 'Con muestras solicitadas' },
            { value: 'no', label: 'Sin muestras' },
          ]}
        />
        <Select
          placeholder="Pendiente de aprobación"
          value={filtros.pendienteAprobacion}
          onChange={(e) => actualizarFiltro('pendienteAprobacion', e.target.value)}
          opciones={[
            { value: 'si', label: 'Pendientes' },
            { value: 'no', label: 'Aprobados' },
          ]}
        />
      </AdminToolbar>

      <Table
        columnas={[
          { header: 'Café', render: (c: Cafe) => c.nombre, sortKey: 'nombre' },
          { header: 'Productor', render: (c: Cafe) => productorDe(c)?.nombre ?? '—', sortKey: 'productor' },
          { header: 'Finca', render: (c: Cafe) => productorDe(c)?.finca ?? '—', sortKey: 'finca' },
          { header: 'Variedad', render: (c: Cafe) => c.variedad, sortKey: 'variedad' },
          { header: 'Proceso', render: (c: Cafe) => c.proceso, sortKey: 'proceso' },
          { header: 'Puntaje', render: (c: Cafe) => <span className="text-dorado font-semibold">{c.puntaje}</span>, sortKey: 'puntaje' },
          { header: 'Estado', render: (c: Cafe) => <Badge variant={badgePorEstado[c.estado]}>{etiquetasEstado[c.estado]}</Badge>, sortKey: 'estado' },
          { header: 'Concurso', render: (c: Cafe) => concursoDe(c)?.nombre ?? '—', sortKey: 'concurso' },
          { header: 'Subasta', render: (c: Cafe) => obtenerSubastaDeCafe(c.id)?.nombre ?? '—', sortKey: 'subasta' },
          {
            header: 'Acciones',
            render: (c: Cafe) => (
              <div className="flex items-center gap-3">
                <Link to={`/cafes/${c.id}`} title="Ver" className="text-verde-bosque hover:text-verde-bosque/70">
                  <Eye size={17} />
                </Link>
                <button onClick={() => abrirEdicion(c)} title="Editar" className="text-gris-oscuro/60 hover:text-cafe-profundo">
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => alternarPublicacion(c.id)}
                  title={c.estado === 'no_disponible' ? 'Publicar' : 'Desactivar'}
                  className={c.estado === 'no_disponible' ? 'text-verde-bosque hover:text-verde-bosque/70' : 'text-red-600/70 hover:text-red-600'}
                >
                  {c.estado === 'no_disponible' ? <Upload size={16} /> : <Power size={16} />}
                </button>
              </div>
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

      <Modal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        titulo={cafeEnEdicion ? 'Editar café' : 'Nuevo café'}
      >
        <div className="space-y-4">
          <Input label="Nombre" required value={valores.nombre} onChange={(e) => setValores({ ...valores, nombre: e.target.value })} />

          <Select
            label="Productor"
            required
            placeholder="Selecciona un productor"
            value={valores.productorId}
            onChange={(e) => setValores({ ...valores, productorId: e.target.value })}
            opciones={productores.map((p) => ({ value: p.id, label: `${p.nombre} — ${p.finca}` }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Variedad" required value={valores.variedad} onChange={(e) => setValores({ ...valores, variedad: e.target.value })} />
            <Input label="Proceso" required value={valores.proceso} onChange={(e) => setValores({ ...valores, proceso: e.target.value })} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Altitud (msnm)" type="number" required value={valores.altitud} onChange={(e) => setValores({ ...valores, altitud: e.target.value })} />
            <Input label="Puntaje" type="number" step="0.01" required value={valores.puntaje} onChange={(e) => setValores({ ...valores, puntaje: e.target.value })} />
            <Input label="Precio base ($)" type="number" required value={valores.precioBase} onChange={(e) => setValores({ ...valores, precioBase: e.target.value })} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gris-oscuro">Descripción</label>
            <textarea
              value={valores.descripcion}
              onChange={(e) => setValores({ ...valores, descripcion: e.target.value })}
              rows={3}
              className="px-4 py-2.5 rounded-lg border border-beige-cafe bg-white text-gris-oscuro focus:outline-none focus:ring-2 focus:ring-verde-bosque/30 focus:border-verde-bosque resize-none"
            />
          </div>

          <Button variant="primary" className="w-full" onClick={guardar}>
            {cafeEnEdicion ? 'Guardar cambios' : 'Crear café'}
          </Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onCerrar={cerrarToast} />
    </div>
  )
}

export default AdministracionCafes