import React, { useState, useEffect } from "react";
import {
  FiX,
  FiPackage,
  FiUsers,
  FiAlertCircle,
  FiCheck,
  FiMapPin,
} from "react-icons/fi";
import { MdBusiness } from "react-icons/md";
import franchiseAPI from "../../../../apis/franchise";

const BulkAssignmentModal = ({ selectedCount, onClose, onAssign, drivers }) => {
  const [franchises, setFranchises] = useState([]);
  const [selectedFranchise, setSelectedFranchise] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        setLoading(true);
        const response = await franchiseAPI.getAllFranchises({
          page: 1,
          limit: 100,
          status: "active",
          search: searchTerm,
        });

        if (response.success) {
          setFranchises(response.data.franchises);

          // Auto-select if only one franchise matches driver pincodes
          const uniquePincodes = [...new Set(drivers.map((d) => d.pin_code))];
          const matchingFranchises = response.data.franchises.filter((f) =>
            uniquePincodes.includes(f.address?.pincode)
          );

          if (matchingFranchises.length === 1) {
            setSelectedFranchise(matchingFranchises[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching franchises:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFranchises();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, drivers]);

  const handleSubmit = () => {
    if (!selectedFranchise) {
      return;
    }
    onAssign(selectedFranchise);
  };

  const selectedFranchiseData = franchises.find(
    (f) => f._id === selectedFranchise
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FiPackage className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Bulk Assignment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assign multiple drivers at once
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiX className="text-gray-500 dark:text-gray-400" size={20} />
            </button>
          </div>

          {/* Selection Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <FiUsers
                    className="text-blue-600 dark:text-blue-400"
                    size={18}
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {selectedCount}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Drivers Selected
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Pincodes
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {[...new Set(drivers.map((d) => d.pin_code))].length} unique
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Warning */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FiAlertCircle
                className="text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0"
                size={18}
              />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Important Notice
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  All selected drivers will be assigned to the same franchise.
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Franchise Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-900 dark:text-white">
                Select Franchise
              </label>
              <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                Required
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search franchises by name, city..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiPackage
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>

            {/* Franchise List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Loading franchises...
                  </p>
                </div>
              ) : franchises.length > 0 ? (
                franchises.map((franchise) => (
                  <div
                    key={franchise._id}
                    onClick={() => setSelectedFranchise(franchise._id)}
                    className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      selectedFranchise === franchise._id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            selectedFranchise === franchise._id
                              ? "bg-blue-100 dark:bg-blue-800"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          <MdBusiness
                            size={14}
                            className={
                              selectedFranchise === franchise._id
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400"
                            }
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {franchise.name}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <FiMapPin size={10} className="mr-1" />
                            {franchise.address?.city} •{" "}
                            {franchise.total_drivers || 0} drivers
                          </div>
                        </div>
                      </div>
                      {selectedFranchise === franchise._id && (
                        <div className="p-1 bg-blue-500 rounded-full">
                          <FiCheck className="text-white" size={12} />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No franchises found
                </div>
              )}
            </div>
          </div>

          {/* Selected Franchise Preview */}
          {selectedFranchiseData && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                  <FiCheck
                    className="text-emerald-600 dark:text-emerald-400"
                    size={16}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    Assignment Confirmed
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Drivers will be assigned to: {selectedFranchiseData.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedFranchise || loading}
              className={`flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]
                ${
                  !selectedFranchise || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "shadow-lg hover:shadow-xl"
                }`}
            >
              {loading ? "Processing..." : `Assign ${selectedCount} Drivers`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkAssignmentModal;
