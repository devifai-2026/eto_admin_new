import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiUsers,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

// Import components
import SummaryStats from "./SummaryStats";
import DriverFilters from "./DriverFilters";
import DriverTable from "./DriverTable";
import Pagination from "../../../../utils/Pagination";
import franchiseAPI from "../../../../apis/franchise";

const FranchiseDrivers = () => {
  const { franchiseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { franchise, franchiseName } = location.state || {};

  const [data, setData] = useState({
    drivers: [],
    summary: {},
    top_performers: [],
    commission_settings: {},
    pagination: {},
    franchise: {},
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch franchise drivers data
  const fetchFranchiseDrivers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: activeFilter, // "all", "active", "inactive", "pending", "onRide"
        search: searchTerm,
      };

      const response = await franchiseAPI.getFranchiseDrivers(
        franchiseId,
        params
      );

      if (response.success && response.data) {
        setData(response.data);
      } else {
        toast.error(response.message || "Failed to fetch drivers");
      }
    } catch (error) {
      console.error("Error fetching franchise drivers:", error);
      toast.error(error.response?.data?.message || "Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters or page changes
  useEffect(() => {
    const timerId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when filters change
      fetchFranchiseDrivers();
    }, 500); // Debounce search

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm, activeFilter]);

  // Fetch data when page changes
  useEffect(() => {
    fetchFranchiseDrivers();
  }, [currentPage]);

  // Pending drivers count from backend summary
  const enhancedSummary = {
    ...data.summary,
    total_pending_drivers: data.summary?.total_pending_drivers || 0,
  };

  const handleDeleteDriver = async (driverId, driverName) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${driverName} from this franchise?`
      )
    ) {
      return;
    }
    try {
      // Note: You'll need to implement an API endpoint to remove driver from franchise
      // For now, just show a message
      toast.info("Driver removal functionality will be implemented separately");
    } catch (error) {
      toast.error("Failed to remove driver");
      console.error(error);
    }
  };

  const viewDriverDetails = (driver) => {
    navigate(`/franchise-drivers-details/${driver.userId}`, {
      state: {
        driver: driver,
        franchiseId: franchiseId,
        franchiseName: franchiseName || data.franchise?.name,
      },
    });
  };

  const handleBack = () => {
    navigate(`/franchise-details/${franchiseId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (driver) => {

    if (driver.isApproved === false) {
      return {
        text: "Pending Approval",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700",
        dotColor: "bg-yellow-500",
        icon: FiClock,
      };
    }

   
    if (!driver.isActive) {
      return {
        text: "Inactive",
        color:
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-300 dark:border-red-700",
        dotColor: "bg-red-500",
        icon: FiClock,
      };
    }

    
    return {
      text: "Active",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-300 dark:border-green-700",
      dotColor: "bg-green-500",
      icon: FiCheckCircle,
    };
  };

  const getRideStatusBadge = (isOnRide) => {
    if (isOnRide) {
      return {
        text: "On Ride",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700",
        dotColor: "bg-blue-500",
      };
    }
    return {
      text: "Available",
      color:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-700",
      dotColor: "bg-gray-500",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Helmet>
          <title>Admin | Franchise Drivers</title>
        </Helmet>
        <div className="max-w-full mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl"
                ></div>
              ))}
            </div>
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | {data.franchise?.name || franchiseName} - Drivers</title>
      </Helmet>

      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FiArrowLeft size={20} />
              <span>Back to Franchise</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Drivers -{" "}
                {data.franchise?.name ||
                  franchiseName ||
                  `Franchise ${franchiseId}`}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {data.franchise?.address
                  ? `${data.franchise.address.city}, ${data.franchise.address.state} - ${data.franchise.address.pincode}`
                  : "Manage and monitor all drivers associated with this franchise"}
              </p>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <FiUsers size={16} />
              <span>Total Drivers: {data.summary?.total_drivers || 0}</span>
              {enhancedSummary.total_pending_drivers > 0 && (
                <span className="text-yellow-600 dark:text-yellow-400">
                  ({enhancedSummary.total_pending_drivers} pending)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Summary Stats Cards - enhancedSummary */}
        <SummaryStats
          summary={enhancedSummary}
          commissionSettings={data.commission_settings}
        />

        {/* Top Performers Section */}
        {data.top_performers && data.top_performers.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiTrendingUp className="mr-2 text-green-600" />
                Top Performers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {data.top_performers.map((driver, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {index + 1}. {driver.name}
                      </div>
                      {index === 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded">
                          Top
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-gray-600 dark:text-gray-400">
                        Earnings
                      </div>
                      <div className="text-right font-medium text-green-600 dark:text-green-400">
                        ₹{driver.total_earnings?.toLocaleString() || "0"}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Rides
                      </div>
                      <div className="text-right">
                        {driver.total_rides || "0"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <DriverFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Driver List ({data.drivers?.length || 0} drivers)
              </h2>
              {data.pagination && data.pagination.total > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing{" "}
                  {(data.pagination.page - 1) * data.pagination.limit + 1} to{" "}
                  {Math.min(
                    data.pagination.page * data.pagination.limit,
                    data.pagination.total
                  )}{" "}
                  of {data.pagination.total} drivers
                </div>
              )}
            </div>
          </div>

          {/* Driver Table */}
          <DriverTable
            drivers={data.drivers || []}
            viewDriverDetails={viewDriverDetails}
            getStatusBadge={getStatusBadge}
            getRideStatusBadge={getRideStatusBadge}
            formatDate={formatDate}
          />

          {/* Empty State */}
          {(!data.drivers || data.drivers.length === 0) && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4">
                🚗
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                No drivers found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                {searchTerm || activeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No drivers are currently registered in this franchise"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {data.pagination && data.pagination.total > 0 && (
            <Pagination
              pagination={data.pagination}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FranchiseDrivers;
