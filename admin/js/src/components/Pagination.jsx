import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Função para gerar os números de página a serem mostrados
  const getPageNumbers = () => {
    let pages = [];
    
    // Sempre mostramos a primeira página
    pages.push(1);
    
    // Mostramos páginas ao redor da página atual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // Sempre mostramos a última página se houver mais de uma
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Removemos duplicatas e ordenamos
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="ir-pagination">
      {/* Botão Anterior */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`ir-page-button ${currentPage === 1 ? 'ir-opacity-50 ir-cursor-not-allowed' : ''}`}
      >
        &laquo; Anterior
      </button>
      
      {/* Números das Páginas */}
      <div className="ir-flex ir-space-x-1">
        {pageNumbers.map((page, index) => {
          // Adicionar ellipsis se houver salto de páginas
          if (index > 0 && page - pageNumbers[index - 1] > 1) {
            return (
              <React.Fragment key={`ellipsis-${index}`}>
                <span className="ir-px-3 ir-py-1 ir-text-gray-500">...</span>
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`ir-page-button ${currentPage === page ? 'ir-page-button-active' : ''}`}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          }
          
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`ir-page-button ${currentPage === page ? 'ir-page-button-active' : ''}`}
            >
              {page}
            </button>
          );
        })}
      </div>
      
      {/* Botão Próximo */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`ir-page-button ${currentPage === totalPages ? 'ir-opacity-50 ir-cursor-not-allowed' : ''}`}
      >
        Próximo &raquo;
      </button>
    </nav>
  );
};

export default Pagination;