import { useState, useEffect, useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router'
import { subastas } from '../data/auctions'
import { cafes } from '../data/coffees'
import { productores } from '../data/producers'
import { ofertas as ofertasIniciales } from '../data/bids'
import { compradores } from '../data/buyers'
import { useAuth } from '../hooks/AuthContext'
import { useToasts } from '../hooks/useToasts'
import { numeroCompradorPublico, formatearPrecio } from '../utils/formatters'
import Countdown from '../components/Countdown'
import BidCard from '../components/BidCard'
import RealizarOferta from '../components/RealizarOferta'
import ToastContainer from '../components/ToastContainer'
import Badge from '../components/Badge'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import AuctionWinner from '../components/AuctionWinner'

interface OfertaLocal {
  id: string
  monto: number
  compradorId: string
}

function SalaSubasta() {
  const { id, cafeId } = useParams<{ id: string; cafeId: string }>()
  const { usuario } = useAuth()
  const { toasts, mostrarToast, cerrarToast } = useToasts()

  const subasta = subastas.find((s) => s.id === id)
  const cafe = cafes.find((c) => c.id === cafeId)
  const cafeSubasta = subasta?.cafes.find((c) => c.cafeId === cafeId)
  const productor = cafe ? productores.find((p) => p.id === cafe.productorId) : undefined
  const compradorIdLogueado = usuario?.rol === 'comprador' ? usuario.compradorId : undefined

  const [historial, setHistorial] = useState<OfertaLocal[]>(() => {
    if (!cafeId) return []
    return ofertasIniciales
      .filter((o) => o.cafeId === cafeId)
      .sort((a, b) => b.monto - a.monto)
      .map((o) => ({ id: o.id, monto: o.monto, compradorId: o.compradorId }))
  })

  const [finalizada, setFinalizada] = useState(false)
  const [fechaFin] = useState(() => new Date(Date.now() + 3 * 60 * 1000))

  const historialRef = useRef<OfertaLocal[]>(historial)
  useEffect(() => {
    historialRef.current = historial
  }, [historial])

  const ofertaActual = historial[0]?.monto ?? cafeSubasta?.ofertaActual ?? 0

  function manejarOfertar(monto: number) {
    if (!compradorIdLogueado) return
    const nuevaOferta: OfertaLocal = { id: `local-${Date.now()}`, monto, compradorId: compradorIdLogueado }
    setHistorial((anteriores) => [nuevaOferta, ...anteriores])
    mostrarToast('success', 'Tu oferta ha sido registrada.')
  }

  useEffect(() => {
    if (finalizada) return

    const intervalo = setInterval(() => {
      const actual = historialRef.current[0]?.monto ?? cafeSubasta?.ofertaActual ?? 0
      const liderAnterior = historialRef.current[0]?.compradorId

      const otrosCompradores = compradores.filter((c) => c.id !== compradorIdLogueado)
      const compradorAleatorio = otrosCompradores[Math.floor(Math.random() * otrosCompradores.length)]
      const incremento = [1, 1.5, 2][Math.floor(Math.random() * 3)]
      const nuevaOferta: OfertaLocal = {
        id: `sim-${Date.now()}`,
        monto: actual + incremento,
        compradorId: compradorAleatorio.id,
      }

      setHistorial((anteriores) => [nuevaOferta, ...anteriores])

      if (liderAnterior === compradorIdLogueado && compradorIdLogueado) {
        mostrarToast('warning', 'Has sido superado en una subasta.')
      }
    }, 8000)

    return () => clearInterval(intervalo)
  }, [finalizada, compradorIdLogueado, cafeSubasta, mostrarToast])

  if (!subasta || !cafe || !cafeSubasta || !productor) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <EmptyState
          titulo="Sala de subasta no encontrada"
          descripcion="Esta sala no existe o el café no forma parte de esta subasta."
          accion={
            <Link to="/subastas">
              <Button variant="outline">Volver a subastas</Button>
            </Link>
          }
        />
      </div>
    )
  }

  if (subasta.estado !== 'en_vivo') {
    return <Navigate to={`/subastas/${subasta.id}`} replace />
  }

  function etiquetaComprador(compradorId: string) {
    return compradorId === compradorIdLogueado ? 'Tú' : numeroCompradorPublico(compradorId)
  }

  const ganador = historial[0]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Badge variant={finalizada ? 'success' : 'live'}>{finalizada ? 'Finalizada' : 'En vivo'}</Badge>
        <h1 className="font-display text-2xl text-cafe-profundo">{subasta.nombre}</h1>
      </div>

      {finalizada && ganador ? (
        <AuctionWinner
          nombreCafe={cafe.nombre}
          etiquetaGanador={etiquetaComprador(ganador.compradorId)}
          montoGanador={ganador.monto}
          esUsuarioActual={ganador.compradorId === compradorIdLogueado}
          cafeId={cafe.id}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-6">
          <div className="bg-white border border-beige-cafe/40 rounded-xl overflow-hidden h-fit">
            <img src={cafe.imagen} alt={cafe.nombre} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h2 className="font-display text-lg text-cafe-profundo mb-1">{cafe.nombre}</h2>
              <p className="text-sm text-gris-oscuro/60 mb-4">
                {productor.nombre} · {productor.finca} · {productor.ubicacion}
              </p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gris-oscuro/50">Altitud</dt>
                  <dd className="font-medium text-cafe-profundo">{cafe.altitud} msnm</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gris-oscuro/50">Variedad</dt>
                  <dd className="font-medium text-cafe-profundo">{cafe.variedad}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gris-oscuro/50">Proceso</dt>
                  <dd className="font-medium text-cafe-profundo">{cafe.proceso}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gris-oscuro/50">Puntaje</dt>
                  <dd className="font-medium text-dorado">{cafe.puntaje} pts</dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {cafe.notasCata.map((nota) => (
                  <Badge key={nota} variant="info">{nota}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-cafe-profundo rounded-xl p-8 text-center flex flex-col items-center justify-center gap-6">
            <div>
              <span className="text-crema/60 text-xs uppercase tracking-widest">Oferta actual</span>
              <p className="font-display text-3xl sm:text-5xl font-bold text-crema mt-1">
                {formatearPrecio(ofertaActual)} <span className="text-lg font-normal text-crema/60">/ kg</span>
              </p>
              <p className="text-dorado text-sm font-medium mt-1">{historial.length} ofertas</p>
            </div>

            <div>
              <span className="text-crema/60 text-xs uppercase tracking-widest block mb-1">Tiempo restante</span>
              <Countdown fechaObjetivo={fechaFin} onFinalizar={() => setFinalizada(true)} />
            </div>

            <div className="w-full max-w-sm">
              {!compradorIdLogueado ? (
                <div className="bg-crema/10 border border-crema/20 rounded-lg p-4 text-center text-sm text-crema/80">
                  <Link to="/login" className="text-dorado font-medium hover:underline">
                    Inicia sesión
                  </Link>{' '}
                  como comprador para ofertar.
                </div>
              ) : (
                <RealizarOferta ofertaActual={ofertaActual} onOfertar={manejarOfertar} />
              )}
            </div>
          </div>

          <div className="bg-white border border-beige-cafe/40 rounded-xl p-5 h-fit">
            <h3 className="text-sm font-semibold text-cafe-profundo mb-3">Historial de ofertas</h3>
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
              {historial.map((oferta, indice) => (
                <BidCard
                  key={oferta.id}
                  monto={oferta.monto}
                  etiquetaComprador={etiquetaComprador(oferta.compradorId)}
                  destacado={indice === 0}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onCerrar={cerrarToast} />
    </div>
  )
}

export default SalaSubasta