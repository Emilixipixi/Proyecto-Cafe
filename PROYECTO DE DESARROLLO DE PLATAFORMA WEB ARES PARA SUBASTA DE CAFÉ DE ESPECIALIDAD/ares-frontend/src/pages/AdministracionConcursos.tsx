import { useState } from 'react'
import { Eye } from 'lucide-react'
import { concursos as concursosIniciales } from '../data/contests'
import { cafes } from '../data/coffees'
import { productores } from '../data/producers'
import { usePaginacion } from '../hooks/usePaginacion'
import { useOrdenamiento } from '../hooks/useOrdenamiento'
import { useToasts } from '../hooks/useToasts'
import type { Concurso } from '../types'
import Table from '../components/Table'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import Select from '../components/Select'
import AdminToolbar from '../components/AdminToolbar'
import TableFooter from '../components/TableFooter'
import ToastContainer from '../components/ToastContainer'

const colorPorPosicion: Record<number, string> = {
  1: 'text-dorado',
  2: 'text-gris-oscuro/70',
  3: 'text-beige-cafe',
}

const aniosDisponibles = Array.from(new Set(concursosIniciales.map((c) => String(c.anio)))).sort()

const filtrosIniciales = {
  busqueda: '',
  anio: '',
}

function primerLugarDe(concurso: Concurso) {
  const primero = concurso.ranking.find((r) => r.posicion === 1)
  if (!primero) return undefined
  return {
    cafe: cafes.find((c) => c.id === primero.cafeId),
    productor: productores.find((p) => p.id === primero.productorId),
  }
}

function obtenerValor(item: Concurso, columna: string): string | number {
  switch (columna) {
    case 'nombre': return item.nombre
    case 'anio': return item.anio
    case 'posiciones': return item.ranking.length
    case 'primerLugar': return primerLugarDe(item)?.cafe?.nombre ?? ''
    default: return ''
  }
}

function AdministracionConcursos() {
  const [concursoSeleccionado, setConcursoSeleccionado] = useState<Concurso | null>(null)
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
    mostrarToast('success', 'Datos actualizados.')
  }

  const datosFiltrados = concursosIniciales.filter((c) => {
    const texto = filtros.busqueda.toLowerCase().trim()
    const coincideBusqueda = texto === '' || c.nombre.toLowerCase().includes(texto)
    const coincideAnio = filtros.anio === '' || String(c.anio) === filtros.anio

    return coincideBusqueda && coincideAnio
  })

  const { columna, direccion, ordenarPor, datosOrdenados } = useOrdenamiento(datosFiltrados, obtenerValor)
  const { paginaActual, setPaginaActual, porPagina, setPorPagina, totalPaginas, datosPagina, inicio } =
    usePaginacion(datosOrdenados, 10)

  const hayFiltrosActivos = Object.values(filtros).some((valor) => valor !== '')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-cafe-profundo">Concursos</h1>
        <p className="text-sm text-gris-oscuro/60 mt-1">{concursosIniciales.length} concursos registrados</p>
      </div>

      <AdminToolbar
        busqueda={filtros.busqueda}
        onBusquedaChange={(valor) => actualizarFiltro('busqueda', valor)}
        placeholderBusqueda="Buscar por nombre del concurso..."
        hayFiltrosActivos={hayFiltrosActivos}
        onLimpiarFiltros={limpiarFiltros}
        onExportarExcel={exportarExcel}
        onExportarPDF={exportarPDF}
        onRecargar={recargar}
      >
        <Select
          placeholder="Año"
          value={filtros.anio}
          onChange={(e) => actualizarFiltro('anio', e.target.value)}
          opciones={aniosDisponibles.map((a) => ({ value: a, label: a }))}
        />
      </AdminToolbar>

      <Table
        columnas={[
          { header: 'Concurso', render: (c: Concurso) => c.nombre, sortKey: 'nombre' },
          { header: 'Año', render: (c: Concurso) => c.anio, sortKey: 'anio' },
          { header: 'Posiciones en ranking', render: (c: Concurso) => c.ranking.length, sortKey: 'posiciones' },
          {
            header: 'Primer lugar',
            render: (c: Concurso) => {
              const primero = primerLugarDe(c)
              if (!primero?.cafe) return '—'
              return (
                <span>
                  <span className="text-dorado font-semibold">{primero.cafe.nombre}</span>
                  <span className="text-gris-oscuro/50"> — {primero.productor?.nombre}</span>
                </span>
              )
            },
            sortKey: 'primerLugar',
          },
          {
            header: 'Acciones',
            render: (c: Concurso) => (
              <button
                onClick={() => setConcursoSeleccionado(c)}
                title="Ver ranking completo"
                className="flex items-center gap-1.5 text-verde-bosque hover:text-verde-bosque/70 text-xs font-medium"
              >
                <Eye size={15} /> Ver ranking
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

      <Modal
        abierto={!!concursoSeleccionado}
        onCerrar={() => setConcursoSeleccionado(null)}
        titulo={concursoSeleccionado ? `${concursoSeleccionado.nombre} ${concursoSeleccionado.anio}` : ''}
      >
        {concursoSeleccionado && (
          <div>
            <p className="text-sm text-gris-oscuro/70 mb-4">{concursoSeleccionado.descripcion}</p>
            <ul className="space-y-2">
              {concursoSeleccionado.ranking.map((puesto) => {
                const cafe = cafes.find((c) => c.id === puesto.cafeId)
                const productor = productores.find((p) => p.id === puesto.productorId)
                return (
                  <li
                    key={puesto.posicion}
                    className="flex items-center justify-between border-b border-beige-cafe/30 pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-display text-xl font-bold ${colorPorPosicion[puesto.posicion] ?? 'text-gris-oscuro/50'}`}>
                        #{puesto.posicion}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-cafe-profundo">{cafe?.nombre}</p>
                        <p className="text-xs text-gris-oscuro/50">{productor?.nombre}</p>
                      </div>
                    </div>
                    <Badge variant="gold">{puesto.puntaje} pts</Badge>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </Modal>

      <ToastContainer toasts={toasts} onCerrar={cerrarToast} />
    </div>
  )
}

export default AdministracionConcursos