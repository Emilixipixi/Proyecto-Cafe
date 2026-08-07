import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cafes } from '../data/coffees'
import { productores } from '../data/producers'
import { concursos } from '../data/contests'
import type { EstadoCafe } from '../types'
import CoffeeCard from '../components/CoffeeCard'
import Input from '../components/Input'
import Select from '../components/Select'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'

const cafesConProductor = cafes.map((cafe) => ({
  cafe,
  productor: productores.find((p) => p.id === cafe.productorId)!,
}))

const provinciasDisponibles = Array.from(new Set(productores.map((p) => p.provincia)))
const variedadesDisponibles = Array.from(new Set(cafes.map((c) => c.variedad)))
const procesosDisponibles = Array.from(new Set(cafes.map((c) => c.proceso)))

const etiquetasEstado: Record<EstadoCafe, string> = {
  disponible: 'Disponible',
  en_subasta: 'En subasta',
  vendido: 'Vendido',
  no_disponible: 'No disponible',
}

const opcionesOrden = [
  { value: 'puntaje-desc', label: 'Puntaje: mayor a menor' },
  { value: 'puntaje-asc', label: 'Puntaje: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'nombre-asc', label: 'Nombre: A - Z' },
]

const filtrosIniciales = {
  busqueda: '',
  provincia: '',
  variedad: '',
  proceso: '',
  puntajeMin: '',
  concurso: '',
  estado: '',
}

function Cafes() {
  const [filtros, setFiltros] = useState(filtrosIniciales)
  const [orden, setOrden] = useState('puntaje-desc')

  function actualizarFiltro(campo: keyof typeof filtrosIniciales, valor: string) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  function limpiarFiltros() {
    setFiltros(filtrosIniciales)
    setOrden('puntaje-desc')
  }

  const resultado = cafesConProductor
    .filter(({ cafe, productor }) => {
      const texto = filtros.busqueda.toLowerCase().trim()
      const coincideBusqueda =
        texto === '' ||
        cafe.nombre.toLowerCase().includes(texto) ||
        productor.nombre.toLowerCase().includes(texto) ||
        productor.finca.toLowerCase().includes(texto)

      const coincideProvincia = filtros.provincia === '' || productor.provincia === filtros.provincia
      const coincideVariedad = filtros.variedad === '' || cafe.variedad === filtros.variedad
      const coincideProceso = filtros.proceso === '' || cafe.proceso === filtros.proceso
      const coincidePuntaje = filtros.puntajeMin === '' || cafe.puntaje >= Number(filtros.puntajeMin)
      const coincideConcurso = filtros.concurso === '' || cafe.concursoId === filtros.concurso
      const coincideEstado = filtros.estado === '' || cafe.estado === filtros.estado

      return (
        coincideBusqueda &&
        coincideProvincia &&
        coincideVariedad &&
        coincideProceso &&
        coincidePuntaje &&
        coincideConcurso &&
        coincideEstado
      )
    })
    .sort((a, b) => {
      switch (orden) {
        case 'puntaje-desc':
          return b.cafe.puntaje - a.cafe.puntaje
        case 'puntaje-asc':
          return a.cafe.puntaje - b.cafe.puntaje
        case 'precio-desc':
          return b.cafe.precioBase - a.cafe.precioBase
        case 'precio-asc':
          return a.cafe.precioBase - b.cafe.precioBase
        case 'nombre-asc':
          return a.cafe.nombre.localeCompare(b.cafe.nombre)
        default:
          return 0
      }
    })

  const hayFiltrosActivos = Object.values(filtros).some((valor) => valor !== '')

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl text-cafe-profundo mb-2">Catálogo de cafés</h1>
      <p className="text-sm text-gris-oscuro/60 mb-6">
        {resultado.length} de {cafes.length} cafés
      </p>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-oscuro/40" />
        <Input
          placeholder="Buscar por café, productor o finca..."
          value={filtros.busqueda}
          onChange={(e) => actualizarFiltro('busqueda', e.target.value)}
          className="pl-11"
        />
      </div>

      <div className="bg-white border border-beige-cafe/50 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-cafe-profundo">
            <SlidersHorizontal size={16} />
            Filtros
          </div>
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-1 text-xs text-red-600 hover:underline"
            >
              <X size={14} /> Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Select
            placeholder="Provincia"
            value={filtros.provincia}
            onChange={(e) => actualizarFiltro('provincia', e.target.value)}
            opciones={provinciasDisponibles.map((p) => ({ value: p, label: p }))}
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
            value={filtros.concurso}
            onChange={(e) => actualizarFiltro('concurso', e.target.value)}
            opciones={concursos.map((c) => ({ value: c.id, label: c.nombre }))}
          />
          <Select
            placeholder="Estado"
            value={filtros.estado}
            onChange={(e) => actualizarFiltro('estado', e.target.value)}
            opciones={Object.entries(etiquetasEstado).map(([value, label]) => ({ value, label }))}
          />
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <div className="w-64">
          <Select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            opciones={opcionesOrden}
          />
        </div>
      </div>

      {resultado.length === 0 ? (
        <EmptyState
          titulo="No encontramos cafés"
          descripcion="Probá ajustando o limpiando los filtros para ver más resultados."
          accion={<Button variant="outline" onClick={limpiarFiltros}>Limpiar filtros</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resultado.map(({ cafe, productor }) => (
            <CoffeeCard key={cafe.id} cafe={cafe} productor={productor} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Cafes