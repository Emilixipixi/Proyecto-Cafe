import { ofertas } from '../data/bids'
import { subastas } from '../data/auctions'
import type { Oferta } from '../types'

export function obtenerGanador(cafeId: string): Oferta | undefined {
  const ofertasDelCafe = ofertas.filter((oferta) => oferta.cafeId === cafeId)
  if (ofertasDelCafe.length === 0) return undefined
  return ofertasDelCafe.reduce((mayor, actual) => (actual.monto > mayor.monto ? actual : mayor))
}

export function obtenerSubastaDeCafe(cafeId: string) {
  return subastas.find((subasta) => subasta.cafes.some((c) => c.cafeId === cafeId))
}
