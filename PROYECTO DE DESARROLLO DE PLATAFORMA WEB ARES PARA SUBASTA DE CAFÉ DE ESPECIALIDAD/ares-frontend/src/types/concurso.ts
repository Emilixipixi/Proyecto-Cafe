export interface PosicionRanking {
  posicion: number
  cafeId: string
  productorId: string
  puntaje: number
}

export interface Concurso {
  id: string
  nombre: string
  anio: number
  descripcion: string
  ranking: PosicionRanking[]
}