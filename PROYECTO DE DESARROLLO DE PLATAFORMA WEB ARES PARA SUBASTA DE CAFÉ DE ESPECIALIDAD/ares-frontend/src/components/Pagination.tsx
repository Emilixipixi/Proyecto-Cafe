interface PaginationProps {
  paginaActual: number
  totalPaginas: number
  onCambiarPagina: (pagina: number) => void
}

function Pagination({ paginaActual, totalPaginas, onCambiarPagina }: PaginationProps) {
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => onCambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        className="px-3 py-1.5 rounded-md text-sm border border-beige-cafe disabled:opacity-30 hover:bg-beige-cafe/20"
      >
        Anterior
      </button>

      {paginas.map((pagina) => (
        <button
          key={pagina}
          onClick={() => onCambiarPagina(pagina)}
          className={`w-9 h-9 rounded-md text-sm font-medium ${
            pagina === paginaActual ? 'bg-verde-bosque text-crema' : 'text-gris-oscuro hover:bg-beige-cafe/20'
          }`}
        >
          {pagina}
        </button>
      ))}

      <button
        onClick={() => onCambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className="px-3 py-1.5 rounded-md text-sm border border-beige-cafe disabled:opacity-30 hover:bg-beige-cafe/20"
      >
        Siguiente
      </button>
    </div>
  )
}

export default Pagination