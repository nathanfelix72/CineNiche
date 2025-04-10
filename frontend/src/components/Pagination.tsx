import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const [pageInput, setPageInput] = useState(currentPage.toString());

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  const handlePageJump = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    } else {
      alert(`Page must be between 1 and ${totalPages}`);
    }
  };

  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    const siblings = 1;
    const totalNumbers = siblings * 2 + 5;
    const showEllipsis = totalPages > totalNumbers;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
      return range;
    }

    const leftSibling = Math.max(currentPage - siblings, 2);
    const rightSibling = Math.min(currentPage + siblings, totalPages - 1);

    range.push(1);

    if (leftSibling > 2) {
      range.push('...');
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      range.push(i);
    }

    if (rightSibling < totalPages - 1) {
      range.push('...');
    }

    range.push(totalPages);

    return range;
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="flex items-center space-x-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        {getPaginationRange().map((item, index) => {
          if (item === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            );
          }

          return (
            <button
              key={item}
              onClick={() => onPageChange(Number(item))}
              disabled={currentPage === item}
              className={`px-2 py-1 border rounded ${
                currentPage === item
                  ? 'font-bold underline bg-gray-200'
                  : ''
              }`}
            >
              {item}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="mt-2 flex items-center space-x-2">
        <input
          type="text"
          value={pageInput}
          onChange={handlePageInputChange}
          onBlur={handlePageJump}
          className="w-16 text-center border rounded"
          maxLength={5}
        />
        <button onClick={handlePageJump} className="px-2 py-1 border rounded">
          Go
        </button>
      </div>

      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(p) => {
            onPageSizeChange(Number(p.target.value));
            onPageChange(1);
          }}
          className="ml-2 border rounded px-2 py-1 text-black"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </div>
  );
};

export default Pagination;
