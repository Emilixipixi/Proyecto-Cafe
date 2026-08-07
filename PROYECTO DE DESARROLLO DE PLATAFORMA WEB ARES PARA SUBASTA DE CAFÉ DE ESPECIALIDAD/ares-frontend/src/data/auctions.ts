import type { Subasta } from '../types'

export const subastas: Subasta[] = [
  {
    id: 'subasta-01',
    nombre: 'Subasta Taza Dorada 2025 - Ganadores',
    fecha: '2026-08-05',
    hora: '19:30',
    estado: 'en_vivo',
    cafes: [
      { cafeId: 'cafe-06', ofertaActual: 58.5, numeroOfertas: 14 },
      { cafeId: 'cafe-10', ofertaActual: 52.0, numeroOfertas: 11 },
      { cafeId: 'cafe-01', ofertaActual: 41.0, numeroOfertas: 8 },
      { cafeId: 'cafe-04', ofertaActual: 37.5, numeroOfertas: 6 },
    ],
  },
  {
    id: 'subasta-02',
    nombre: 'Subasta Cafés de Especialidad - Agosto',
    fecha: '2026-08-20',
    hora: '10:00',
    estado: 'programada',
    cafes: [
      { cafeId: 'cafe-02', ofertaActual: 28, numeroOfertas: 0 },
      { cafeId: 'cafe-07', ofertaActual: 40, numeroOfertas: 0 },
      { cafeId: 'cafe-11', ofertaActual: 34, numeroOfertas: 0 },
      { cafeId: 'cafe-12', ofertaActual: 21, numeroOfertas: 0 },
    ],
  },
  {
    id: 'subasta-03',
    nombre: 'Subasta Reserva Sidra',
    fecha: '2026-09-05',
    hora: '09:00',
    estado: 'borrador',
    cafes: [
      { cafeId: 'cafe-09', ofertaActual: 22, numeroOfertas: 0 },
    ],
  },
  {
    id: 'subasta-04',
    nombre: 'Subasta Regional Loja - Julio 2026',
    fecha: '2026-07-15',
    hora: '16:00',
    estado: 'finalizada',
    cafes: [
      { cafeId: 'cafe-05', ofertaActual: 34.5, numeroOfertas: 9 },
      { cafeId: 'cafe-03', ofertaActual: 27, numeroOfertas: 2 },
      { cafeId: 'cafe-08', ofertaActual: 24, numeroOfertas: 0 },
    ],
  },
  {
    id: 'subasta-05',
    nombre: 'Subasta Cosecha Anterior - Junio 2026',
    fecha: '2026-06-10',
    hora: '14:00',
    estado: 'cancelada',
    cafes: [],
  },
]