import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages, total, limit } = pagination;
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (pages <= maxVisiblePages) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(pages);
      } else if (page >= pages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = pages - 3; i <= pages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(pages);
      }
    }

    return pageNumbers;
  };

  if (total <= limit) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-600">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{startIndex}</span> to{" "}
          <span className="font-medium">{endIndex}</span> of{" "}
          <span className="font-medium">{total}</span> results
        </p>

        <div className="flex items-center space-x-1">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
          >
            <FiChevronLeft size={14} className="mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1 mx-1 sm:mx-2">
            {getPageNumbers().map((pageNum, index) =>
              pageNum === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm"
                >
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    page === pageNum
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
            className="flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <FiChevronRight size={14} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
