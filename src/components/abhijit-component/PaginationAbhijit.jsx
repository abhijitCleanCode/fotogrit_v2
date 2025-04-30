import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationAbhijit = ({
  currentPage,
  setCurrentPage,
  totalPages,
  className = "",
}) => {
  const maxPageLinks = 5;

  // if (totalPages <= 1) return null; // don't render as there is only one page, thus no pagination is required

  // ensure current page is within bounds
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const handlePrev = () => {
    if (safeCurrentPage > 1) {
      setCurrentPage(safeCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (safeCurrentPage < totalPages) {
      setCurrentPage(safeCurrentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // memoize page numbers calculations
  const { startPage, pageNumbers, endPage } = React.useMemo(() => {
    let numbers = [];
    let startPage = Math.max(1, safeCurrentPage - Math.floor(maxPageLinks / 2));
    let endPage = startPage + maxPageLinks - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageLinks + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i);
    }

    return { startPage, pageNumbers: numbers, endPage };
  }, [safeCurrentPage, totalPages]);

  return (
    <div
      className={`flex items-center justify-center gap-4 py-4 ${className}`}
      aria-label="pagination"
    >
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="flex items-center gap-1 border rounded-[0.5rem] px-3 py-1.5 text-sm disabled:opacity-50"
        aria-label="Previous page"
      >
        <FaChevronLeft size={16} />
        &nbsp;Previous
      </button>

      <div className="flex items-center gap-2 text-sm">
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageClick(1)}
              className={`px-2 py-1 rounded-[0.5rem] ${
                currentPage === 1 ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              aria-label="Go to first page"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-2 py-1 rounded ${
              currentPage === page
                ? "bg-gray-200 font-medium"
                : "hover:bg-gray-100"
            }`}
            aria-label={`Go to page ${page}`}
            aria-current={safeCurrentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-1" aria-hidden="true">
                ...
              </span>
            )}
            <button
              onClick={() => handlePageClick(totalPages)}
              className={`px-2 py-1 rounded-[0.5rem] ${
                currentPage === totalPages
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-100"
              }`}
              aria-label="Go to last page"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 border rounded px-3 py-1.5 text-sm disabled:opacity-50"
        aria-label="Next page"
      >
        Next <FaChevronRight size={16} />
      </button>
    </div>
  );
};

export default React.memo(PaginationAbhijit);
