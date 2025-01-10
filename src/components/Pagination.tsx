import React from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex justify-center flex-wrap gap-2 overflow-x-auto">
  {[...Array(totalPages)].map((_, index) => (
    <button
      key={index}
      onClick={() => onPageChange(index + 1)}
      className={`px-3 py-1 text-sm rounded transition ${
        currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
      } hover:bg-blue-400 hover:text-white`}
    >
      {index + 1}
    </button>
  ))}
</div>

  );
};

export default Pagination;
