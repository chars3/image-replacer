import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];

    pages.push(1);

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center mt-6 space-x-1 text-sm">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded border ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-100'
        }`}
      >
        &laquo; Anterior
      </button>

      {pageNumbers.map((page, index) => {
        const hasGap =
          index > 0 && page - pageNumbers[index - 1] > 1;

        return (
          <React.Fragment key={`page-${page}`}>
            {hasGap && (
              <span className="px-2 text-gray-400 select-none">...</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded border ${
                currentPage === page
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          </React.Fragment>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded border ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-100'
        }`}
      >
        Próximo &raquo;
      </button>
    </nav>
  );
};

export default Pagination;
