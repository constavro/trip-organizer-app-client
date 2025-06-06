import React from 'react';
import './Pagination.css'; // Add some basic styling

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or no pages
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const pageNumbers = [];
  const maxPageNumbersToShow = 5; // Adjust as needed

  if (totalPages <= maxPageNumbersToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }
    
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
  }


  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        « Prev
      </button>

      {pageNumbers.map((number, index) =>
        typeof number === 'number' ? (
          <button
            key={index}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        ) : (
          <span key={index} className="pagination-ellipsis">{number}</span>
        )
      )}

      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        Next »
      </button>
      {totalItems && itemsPerPage && (
         <span className="pagination-info">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} trips
        </span>
      )}
    </div>
  );
};

export default Pagination;