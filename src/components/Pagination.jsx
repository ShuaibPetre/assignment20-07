import React from 'react';

const Pagination = ({ currentPage, totalPages, setCurrentPage, manualPage, setManualPage, goToManualPage }) => (
  <div className="mt-6">
    <div className="flex justify-center items-center gap-2 mb-2">
      <button
        className="px-2 py-1 border"
        disabled={currentPage <= 5}
        onClick={() => setCurrentPage(Math.max(currentPage - 5, 1))}
      >«</button>
      <button
        className="px-2 py-1 border"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >←</button>

      <span className="px-3 py-1 border bg-gray-200 font-bold">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="px-2 py-1 border"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >→</button>
      <button
        className="px-2 py-1 border"
        disabled={currentPage > totalPages - 5}
        onClick={() => setCurrentPage(Math.min(currentPage + 5, totalPages))}
      >»</button>
    </div>

    <div className="flex justify-center items-center gap-2">
      <input
        type="number"
        min="1"
        max={totalPages}
        value={manualPage}
        onChange={e => setManualPage(e.target.value)}
        className="border px-3 py-1 w-24 text-center"
        placeholder="Page #"
      />
      <button
        onClick={goToManualPage}
        className="px-3 py-1 border bg-blue-100 hover:bg-blue-200"
      >
        Go
      </button>
    </div>
  </div>
);

export default Pagination;
