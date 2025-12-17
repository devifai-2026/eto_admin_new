import React from "react";

const EmptyState = ({ searchTerm, statusFilter }) => {
  return (
    <div className="text-center py-8 sm:py-12">
      <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4">
        🏢
      </div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
        No franchises found
      </h3>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
        {searchTerm || statusFilter !== "all"
          ? "Try adjusting your search or filters"
          : "No franchises are currently registered"}
      </p>
    </div>
  );
};

export default EmptyState;
