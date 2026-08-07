import { compradores } from '../data/buyers'
import { subastas } from '../data/auctions'
import { ofertas } from '../data/bids'
import { productores } from '../data/producers'
import { cafes } from '../data/coffees'

const nombresMes: Record<string, string> = {
  '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Ago', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic',
}

export function compradoresRegistradosPorMes() {
  const conteo: Record<string, number> = {}
  compradores.forEach((comprador) => {
    const mes = comprador.fechaRegistro.slice(5, 7)
    conteo[mes] = (conteo[mes] || 0) + 1
  })
  return Object.entries(conteo)
    .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
    .map(([mes, cantidad]) => ({ mes: nombresMes[mes], cantidad }))
}

export function participacionPorSubasta() {
  return subastas.map((subasta) => {
    const compradoresUnicos = new Set(
      ofertas.filter((oferta) => oferta.subastaId === subasta.id).map((oferta) => oferta.compradorId),
    )
    return {
      nombre: subasta.nombre.length > 18 ? subasta.nombre.slice(0, 18) + '…' : subasta.nombre,
      participantes: compradoresUnicos.size,
    }
  })
}

export function cafesPorRegion() {
  const conteo: Record<string, number> = {}
  cafes.forEach((cafe) => {
    const productor = productores.find((p) => p.id === cafe.productorId)
    if (!productor) return
    conteo[productor.ubicacion] = (conteo[productor.ubicacion] || 0) + 1
  })
  return Object.entries(conteo).map(([region, cantidad]) => ({ region, cantidad }))
}

export function evolucionDeOfertas() {
  const conteo: Record<string, number> = {}
  ofertas.forEach((oferta) => {
    const mes = oferta.fechaHora.slice(5, 7)
    conteo[mes] = (conteo[mes] || 0) + 1
  })
  return Object.entries(conteo)
    .sort(([mesA], [mesB]) => mesA.localeCompare(mesB))
    .map(([mes, cantidad]) => ({ mes: nombresMes[mes], cantidad }))
}