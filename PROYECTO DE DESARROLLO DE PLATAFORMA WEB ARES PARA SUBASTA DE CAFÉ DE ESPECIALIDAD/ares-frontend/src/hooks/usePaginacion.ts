import { useState, useEffect } from 'react'

export function usePaginacion<T>(datos: T[], porPaginaInicial = 10) {
  const [paginaActual, setPaginaActual] = useState(1)
  const [porPagina, setPorPagina] = useState(porPaginaInicial)

  useEffect(() => {
    setPaginaActual(1)
  }, [datos.length, porPagina])

  const totalPaginas = Math.max(1, Math.ceil(datos.length / porPagina))
  const inicio = (paginaActual - 1) * porPagina
  const datosPagina = datos.slice(inicio, inicio + porPagina)

  return { paginaActual, setPaginaActual, porPagina, setPorPagina, totalPaginas, datosPagina, inicio }
}