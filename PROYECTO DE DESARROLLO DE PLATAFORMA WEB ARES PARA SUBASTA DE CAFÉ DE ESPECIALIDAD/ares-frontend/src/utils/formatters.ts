export function formatearFecha(fecha: string): string {
  const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-EC', opciones)
}

export function formatearPrecio(monto: number): string {
  return `$${monto.toFixed(2)}`
}

export function numeroCompradorPublico(compradorId: string): string {
  const numero = compradorId.replace('comprador-', '').padStart(2, '0')
  return `Comprador #${numero}`
}