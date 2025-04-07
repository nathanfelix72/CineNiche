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

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="flex items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          if (
            pageNumber === currentPage - 1 ||
            pageNumber === currentPage + 1 ||
            pageNumber === currentPage ||
            pageNumber === 1 ||
            pageNumber === totalPages
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                disabled={currentPage === pageNumber}
              >
                {pageNumber}
              </button>
            );
          }
          return null;
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Page Input Field and Go Button on a new line */}
      <div className="mt-2">
        <input
          type="text"
          value={pageInput}
          onChange={handlePageInputChange}
          onBlur={handlePageJump}
          className="ml-2 w-16 text-center"
          maxLength={5}
        />
        <button onClick={handlePageJump}>Go</button>
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