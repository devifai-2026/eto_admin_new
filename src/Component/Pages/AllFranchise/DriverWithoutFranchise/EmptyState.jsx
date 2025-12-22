import React from "react";
import toto from "../../../../assets/sidebar/toto.jpg"

const EmptyState = ({ searchTerm, pincodeFilter, districtFilter }) => {
  return (
    <div className="text-center py-8 sm:py-12">
      <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4 flex justify-center">
        <img className="rounded-full h-28 w-28" src={toto} alt="" />
      </div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
        No drivers found
      </h3>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
        {searchTerm || pincodeFilter || districtFilter
          ? "Try adjusting your search or filters"
          : "All drivers are assigned to franchises"}
      </p>
    </div>
  );
};

export default EmptyState;
