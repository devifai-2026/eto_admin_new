import React from "react";
import {
  FiFilter,
  FiSearch,
  FiX,
  FiMapPin,
  FiNavigation,
} from "react-icons/fi";

const DriversWithoutFranchiseFilters = ({
  searchTerm,
  setSearchTerm,
  pincodeFilter,
  setPincodeFilter,
  districtFilter,
  setDistrictFilter,
}) => {
  const clearFilters = () => {
    setSearchTerm("");
    setPincodeFilter("");
    setDistrictFilter("");
  };

  const hasFilters = searchTerm || pincodeFilter || districtFilter;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FiFilter className="text-blue-600 dark:text-blue-400" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Filter Drivers
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Narrow down drivers by various criteria
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 lg:w-72">
            <FiSearch
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            {/* Pincode */}
            <div className="relative w-36">
              <FiMapPin
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Pincode"
                className="w-full pl-9 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm shadow-sm"
                value={pincodeFilter}
                onChange={(e) => setPincodeFilter(e.target.value)}
              />
            </div>

            {/* District */}
            <div className="relative w-40">
              <FiNavigation
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="District"
                className="w-full pl-9 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm shadow-sm"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Clear Button */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-400 
                rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 
                transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
            >
              <FiX size={14} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Active filters:
            </span>
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                Search: "{searchTerm}"
              </span>
            )}
            {pincodeFilter && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                Pincode: {pincodeFilter}
              </span>
            )}
            {districtFilter && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                District: {districtFilter}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversWithoutFranchiseFilters;
