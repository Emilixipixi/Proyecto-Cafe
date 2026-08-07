import type { Concurso } from '../types'

export const concursos: Concurso[] = [
  {
    id: 'concurso-taza-dorada-2025',
    nombre: 'Taza Dorada',
    anio: 2025,
    descripcion: 'El concurso más importante de café de especialidad de la provincia de Loja, que selecciona los mejores lotes para ser presentados en subastas internacionales.',
    ranking: [
      { posicion: 1, cafeId: 'cafe-06', productorId: 'prod-04', puntaje: 92.75 },
      { posicion: 2, cafeId: 'cafe-10', productorId: 'prod-07', puntaje: 93.0 },
      { posicion: 3, cafeId: 'cafe-01', productorId: 'prod-01', puntaje: 90.25 },
      { posicion: 4, cafeId: 'cafe-04', productorId: 'prod-03', puntaje: 91.0 },
      { posicion: 5, cafeId: 'cafe-03', productorId: 'prod-02', puntaje: 89.5 },
    ],
  },
  {
    id: 'concurso-prefectura-loja-2024',
    nombre: 'Concurso de la Prefectura de Loja',
    anio: 2024,
    descripcion: 'Certamen organizado por la Prefectura de Loja para reconocer a los productores destacados de la provincia.',
    ranking: [
      { posicion: 1, cafeId: 'cafe-10', productorId: 'prod-07', puntaje: 91.5 },
      { posicion: 2, cafeId: 'cafe-06', productorId: 'prod-04', puntaje: 90.0 },
      { posicion: 3, cafeId: 'cafe-01', productorId: 'prod-01', puntaje: 88.75 },
      { posicion: 4, cafeId: 'cafe-04', productorId: 'prod-03', puntaje: 87.5 },
    ],
  },
  {
    id: 'concurso-cosecha-oro-2025',
    nombre: 'Cosecha de Oro - Concurso Nacional',
    anio: 2025,
    descripcion: 'Concurso de alcance nacional que busca posicionar al café ecuatoriano de especialidad en mercados internacionales.',
    ranking: [
      { posicion: 1, cafeId: 'cafe-11', productorId: 'prod-07', puntaje: 90.0 },
      { posicion: 2, cafeId: 'cafe-02', productorId: 'prod-01', puntaje: 88.75 },
      { posicion: 3, cafeId: 'cafe-03', productorId: 'prod-02', puntaje: 89.5 },
    ],
  },
]