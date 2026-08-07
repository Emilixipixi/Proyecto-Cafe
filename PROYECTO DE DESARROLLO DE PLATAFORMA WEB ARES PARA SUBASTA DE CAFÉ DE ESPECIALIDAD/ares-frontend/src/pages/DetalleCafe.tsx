import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { CheckCircle2 } from 'lucide-react'
import { cafes } from '../data/coffees'
import { productores } from '../data/producers'
import { subastas } from '../data/auctions'
import { concursos } from '../data/contests'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import { formatearPrecio } from '../utils/formatters'

const etiquetasEstado: Record<string, string> = {
  disponible: 'Disponible',
  en_subasta: 'En subasta',
  vendido: 'Vendido',
  no_disponible: 'No disponible',
}

function DetalleCafe() {
  const { id } = useParams<{ id: string }>()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [solicitudEnviada, setSolicitudEnviada] = useState(false)

  const cafe = cafes.find((c) => c.id === id)

  if (!cafe) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <EmptyState
          titulo="Café no encontrado"
          descripcion="El café que buscás no existe o fue removido del catálogo."
          accion={
            <Link to="/cafes">
              <Button variant="outline">Volver al catálogo</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const productor = productores.find((p) => p.id === cafe.productorId)!
  const concurso = cafe.concursoId ? concursos.find((c) => c.id === cafe.concursoId) : undefined
  const subastaActiva = subastas.find(
    (s) => (s.estado === 'en_vivo' || s.estado === 'programada') && s.cafes.some((c) => c.cafeId === cafe.id),
  )

  function abrirModal() {
    setSolicitudEnviada(false)
    setModalAbierto(true)
  }

  function confirmarSolicitud() {
    setSolicitudEnviada(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <img src={cafe.imagen} alt={cafe.nombre} className="w-full h-64 sm:h-96 object-cover rounded-xl" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="info">{etiquetasEstado[cafe.estado]}</Badge>
            {concurso && cafe.posicionConcurso && (
              <Badge variant="gold">Puesto #{cafe.posicionConcurso} — {concurso.nombre} {concurso.anio}</Badge>
            )}
          </div>

          <h1 className="font-display text-3xl text-cafe-profundo mb-1">{cafe.nombre}</h1>
          <p className="text-gris-oscuro/70 mb-4">
            {productor.nombre} · {productor.finca} · {productor.ubicacion}
          </p>

          <div className="flex flex-wrap gap-6 mb-6 text-sm">
            <div>
              <span className="text-gris-oscuro/50 block text-xs uppercase tracking-wide">Altitud</span>
              <span className="font-semibold text-cafe-profundo">{cafe.altitud} msnm</span>
            </div>
            <div>
              <span className="text-gris-oscuro/50 block text-xs uppercase tracking-wide">Variedad</span>
              <span className="font-semibold text-cafe-profundo">{cafe.variedad}</span>
            </div>
            <div>
              <span className="text-gris-oscuro/50 block text-xs uppercase tracking-wide">Proceso</span>
              <span className="font-semibold text-cafe-profundo">{cafe.proceso}</span>
            </div>
            <div>
              <span className="text-gris-oscuro/50 block text-xs uppercase tracking-wide">Puntaje</span>
              <span className="font-semibold text-dorado">{cafe.puntaje} pts</span>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-gris-oscuro/50 block text-xs uppercase tracking-wide mb-2">Notas de cata</span>
            <div className="flex flex-wrap gap-2">
              {cafe.notasCata.map((nota) => (
                <Badge key={nota} variant="info">{nota}</Badge>
              ))}
            </div>
          </div>

          <p className="text-sm text-gris-oscuro/80 mb-6">{cafe.descripcion}</p>

          <div className="flex items-center justify-between border-t border-beige-cafe/40 pt-5 mb-6">
            <div>
              <span className="text-gris-oscuro/50 block text-xs uppercase tracking-wide">
                {cafe.estado === 'en_subasta' ? 'Oferta inicial' : 'Precio base'}
              </span>
              <span className="text-2xl font-bold text-verde-bosque">{formatearPrecio(cafe.precioBase)} / kg</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" className="flex-1" onClick={abrirModal}>
              Solicitar muestra
            </Button>
            {subastaActiva ? (
              <Link to={`/subastas/${subastaActiva.id}`} className="flex-1">
                <Button variant="secondary" className="w-full">Ver subasta</Button>
              </Link>
            ) : (
              <Button variant="outline" className="flex-1" disabled>
                Sin subasta activa
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} titulo="Solicitar muestra">
        {solicitudEnviada ? (
          <div className="flex flex-col items-center text-center py-4">
            <CheckCircle2 size={48} className="text-verde-bosque mb-3" />
            <h4 className="font-semibold text-cafe-profundo mb-1">Muestra solicitada correctamente</h4>
            <p className="text-sm text-gris-oscuro/60 mb-4">
              Te contactaremos por correo para coordinar el envío de {cafe.nombre}.
            </p>
            <Button variant="outline" onClick={() => setModalAbierto(false)}>Cerrar</Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gris-oscuro/70 mb-4">
              Estás por solicitar una muestra de <strong>{cafe.nombre}</strong>, de {productor.nombre}.
            </p>
            <Button variant="primary" className="w-full" onClick={confirmarSolicitud}>
              Confirmar solicitud
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DetalleCafe