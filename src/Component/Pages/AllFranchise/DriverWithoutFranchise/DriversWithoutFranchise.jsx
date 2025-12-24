import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
import franchiseAPI from "../../../../apis/franchise";

// Import components
import DriversWithoutFranchiseStats from "./DriversWithoutFranchiseStats";
import DriversWithoutFranchiseFilters from "./DriversWithoutFranchiseFilters";
import Pagination from "../../../../utils/Pagination";
import DriversWithoutFranchiseTableRow from "./DriversWithoutFranchiseTableRow";
import MobileDriverCard from "./MobileDriverCard";
import EmptyState from "./EmptyState";
import LoadingState from "../Franchice/LoadingState";
import ErrorState from "../Franchice/ErrorState";
import BulkAssignmentModal from "./BulkAssignmentModal";

const DriversWithoutFranchise = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pincodeFilter, setPincodeFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driversData, setDriversData] = useState({
    drivers: [],
    statistics: {
      totalWithoutFranchise: 0,
      withFranchiseAvailable: 0,
      readyForAssignment: 0,
      onRide: 0,
    },
    filters: {
      pincode: "",
      district: "",
      includeOnRide: false,
    },
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      pages: 1,
    },
  });

  // Fetch drivers data
  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        pincode: pincodeFilter,
        district: districtFilter,
        includeOnRide: false,
      };

      const response = await franchiseAPI.getDriversWithoutFranchise(params);

      if (response.success) {
        setDriversData(response.data);
        // Reset selections
        setSelectedDrivers([]);
      } else {
        throw new Error(response.message || "Failed to fetch drivers");
      }
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError(err.message || "Failed to load drivers. Please try again.");
      toast.error("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, pincodeFilter, districtFilter, itemsPerPage]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchDrivers();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, pincodeFilter, districtFilter]);

  // Fetch when page changes
  useEffect(() => {
    fetchDrivers();
  }, [currentPage]);

  // Handle driver selection
  const handleDriverSelect = (driverId) => {
    setSelectedDrivers((prev) =>
      prev.includes(driverId)
        ? prev.filter((id) => id !== driverId)
        : [...prev, driverId]
    );
  };

  // Handle select all on current page
  const handleSelectAll = () => {
    const eligibleDrivers = driversData.drivers.filter(
      (driver) => driver.franchiseAvailability.canBeAssigned
    );

    if (selectedDrivers.length === eligibleDrivers.length) {
      setSelectedDrivers([]);
    } else {
      const eligibleIds = eligibleDrivers.map((driver) => driver._id);
      setSelectedDrivers(eligibleIds);
    }
  };

  // Handle bulk assignment
  const handleBulkAssignment = async (franchiseId) => {
    try {
      const response = await franchiseAPI.assignDriversToFranchise(
        franchiseId,
        selectedDrivers
      );

      if (response.success) {
        toast.success(
          `${response.data.assignmentSummary.totalAssigned} drivers assigned successfully`
        );
        setShowBulkAssignModal(false);
        setSelectedDrivers([]);
        fetchDrivers(); // Refresh list
      }
    } catch (error) {
      toast.error("Failed to assign drivers");
      console.error("Assignment error:", error);
    }
  };

  // Handle individual assignment
  const handleIndividualAssignment = async (driverId, franchiseId) => {
    try {
      const response = await franchiseAPI.assignDriversToFranchise(
        franchiseId,
        [driverId]
      );

      if (response.success) {
        toast.success("Driver assigned successfully");
        fetchDrivers(); // Refresh list
      }
    } catch (error) {
      toast.error("Failed to assign driver");
      console.error("Individual assignment error:", error);
    }
  };

  // Loading state
  if (loading && !driversData.drivers.length) {
    return <LoadingState retry={fetchDrivers} />;
  }

  // Error state
  if (error && !driversData.drivers.length) {
    return <ErrorState error={error} retry={fetchDrivers} />;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | Drivers Without Franchise</title>
      </Helmet>

      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FiUsers className="text-2xl sm:text-3xl text-blue-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                  Drivers Without Franchise
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Manage drivers who are not assigned to any franchise
                </p>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedDrivers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedDrivers.length} selected
                </span>
                <button
                  onClick={() => setShowBulkAssignModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Assign Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <DriversWithoutFranchiseStats statistics={driversData.statistics} />

        {/* Filters Section */}
        <DriversWithoutFranchiseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          pincodeFilter={pincodeFilter}
          setPincodeFilter={setPincodeFilter}
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
        />

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Available Drivers ({driversData.pagination.total} drivers)
              </h2>

              {/* Select All Checkbox */}
              {driversData.drivers.length > 0 && (
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={
                      selectedDrivers.length ===
                      driversData.drivers.filter(
                        (d) => d.franchiseAvailability.canBeAssigned
                      ).length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Select All (Ready)
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Content based on whether there are drivers or not */}
          {driversData.drivers.length > 0 ? (
            <>
              {/* Mobile Cards */}
              <div className="sm:hidden">
                {driversData.drivers.map((driver) => (
                  <MobileDriverCard
                    key={driver._id}
                    driver={driver}
                    selectedDrivers={selectedDrivers}
                    onSelect={handleDriverSelect}
                    onAssign={handleIndividualAssignment}
                  />
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Select
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Statistics
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Franchise Availability
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {driversData.drivers.map((driver) => (
                      <DriversWithoutFranchiseTableRow
                        key={driver._id}
                        driver={driver}
                        selectedDrivers={selectedDrivers}
                        onSelect={handleDriverSelect}
                        onAssign={handleIndividualAssignment}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {driversData.pagination.pages > 1 && (
                <Pagination
                  pagination={driversData.pagination}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            // Empty State - Shows for all screen sizes
            <EmptyState
              searchTerm={searchTerm}
              pincodeFilter={pincodeFilter}
              districtFilter={districtFilter}
            />
          )}
        </div>
      </div>

      {/* Bulk Assignment Modal */}
      {showBulkAssignModal && (
        <BulkAssignmentModal
          selectedCount={selectedDrivers.length}
          onClose={() => setShowBulkAssignModal(false)}
          onAssign={handleBulkAssignment}
        />
      )}
    </div>
  );
};

export default DriversWithoutFranchise;