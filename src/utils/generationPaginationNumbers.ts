export const generatePaginationNumbers = ( currentPage: number, totalPages: number ) => {
  // Si el numero total de paginas es 7 o menos, 
  // vamos a mostrar todos los numeros de paginas sin puntos

  if( totalPages <= 7 ) {
    return Array.from( { length: totalPages }, ( _, i ) => i + 1 )
  }

  // Si el numero actual de pagina es entre las primeras 3 paginas,
  // vamos a mostrar los primeros 3 numeros de paginas con puntos y 2 al final

  if( currentPage <= 3 ) {
    return [ 1, 2, 3, '...', totalPages - 1, totalPages]
  }

  // Si el numero actual de pagina es entre las ultimas 3 paginas,
  // vamos a mostrar los primeros 2 numeros de paginas con puntos y 3 al final

  if( currentPage >= totalPages - 2 ) {
    return [ 1, 2, '...', totalPages - 2, totalPages - 1, totalPages ]
  }

  // Si el numero actual de pagina esta entre las paginas intermedias,
  // vamos a mostrar la primera paginas con puntos despues, el numero actual de pagina y 2 paginas al final

  return [ 1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages ]
}