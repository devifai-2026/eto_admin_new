import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { activeRidesAPI } from "../../apis/ActiveRides";
import Breadcrumbs from "../Breadcrumbs/BreadCrumbs";
import Pagination from "../../utils/Pagination";
import {
  FiMapPin,
  FiPhone,
  FiUser,
  FiEye,
  FiMap,
  FiX,
  FiSearch,
  FiFilter,
  FiNavigation,
} from "react-icons/fi";
import { Helmet } from "react-helmet";
import toto from "../../assets/sidebar/toto.jpg";
import loginAPI from "../../apis/Login";
import { FaIndianRupeeSign } from "react-icons/fa6";

const ActiveRides = () => {
  const navigate = useNavigate();

  // State management
  const [rides, setRides] = useState([]);
  const [summary, setSummary] = useState({
    totalActiveRides: 0,
    totalDistance: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false,
  });

  // Modal states
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);

  // Get current user information
  const getCurrentUserInfo = useCallback(() => {
    const user = loginAPI.getCurrentUser();
    const userType = loginAPI.getUserType();

    return {
      user,
      userType,
      userId: user?._id,
      franchiseId: user?.franchiseId || user?._id,
    };
  }, []);

  // Fetch active rides from API
  const fetchActiveRides = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        // Get current user information
        const { userType, userId, franchiseId } = getCurrentUserInfo();

        // Prepare query parameters for the API
        const apiParams = {
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          search: params.search !== undefined ? params.search : searchTerm,
          sortBy: params.sortBy || sortBy,
          sortOrder: params.sortOrder || sortOrder,
          ...params,
        };

        // Add user type specific parameters
        if (userType === "admin" && userId) {
          apiParams.adminId = userId;
        } else if (userType === "franchise" && franchiseId) {
          apiParams.franchiseId = franchiseId;
        }

        // Remove empty search
        if (apiParams.search === "") {
          delete apiParams.search;
        }

        // Remove undefined values
        Object.keys(apiParams).forEach(
          (key) => apiParams[key] === undefined && delete apiParams[key]
        );

        console.log("Fetching active rides with params:", apiParams);

        const response = await activeRidesAPI.getActiveRides(apiParams);

        console.log("API Response:", response);

        if (response.status === 200) {
          const data = response.data.data;

          // Set summary statistics
          if (data.summary) {
            setSummary(data.summary);
          } else {
            // Calculate summary from rides if not provided
            const totalActiveRides =
              data.pagination?.total || data.rides?.length || 0;
            const totalDistance =
              data.rides?.reduce(
                (sum, ride) => sum + (ride.total_km || 0),
                0
              ) || 0;
            const totalEarnings =
              data.rides?.reduce(
                (sum, ride) => sum + (ride.total_amount || 0),
                0
              ) || 0;

            setSummary({
              totalActiveRides,
              totalDistance,
              totalEarnings,
            });
          }

          // Set rides data
          if (data.rides && Array.isArray(data.rides)) {
            setRides(data.rides);
          } else {
            setRides([]);
          }

          // Set pagination data
          if (data.pagination) {
            setPagination({
              page: data.pagination.page,
              pages: data.pagination.totalPages,
              total: data.pagination.total,
              limit: data.pagination.limit,
              hasNext: data.pagination.hasNext,
              hasPrev: data.pagination.hasPrev,
            });
          }
        } else {
          throw new Error(response.message || "Failed to fetch active rides");
        }
      } catch (err) {
        console.error("Error fetching active rides:", err);
        setError(err.message || "Failed to load active rides");
        setRides([]);
        setSummary({
          totalActiveRides: 0,
          totalDistance: 0,
          totalEarnings: 0,
        });
        setPagination({
          page: 1,
          pages: 1,
          total: 0,
          limit: 10,
          hasNext: false,
          hasPrev: false,
        });
      } finally {
        setLoading(false);
      }
    },
    [
      pagination.page,
      pagination.limit,
      searchTerm,
      sortBy,
      sortOrder,
      getCurrentUserInfo,
    ]
  );

  // Initial fetch and when pagination/filters change
  useEffect(() => {
    fetchActiveRides();
  }, [pagination.page, sortBy, sortOrder]);

  // Debounced search effect
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchActiveRides({ search: searchTerm, page: 1 });
      }
    }, 800);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field with default descending order
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Handle view location
  const handleViewLocation = (ride) => {
    setSelectedRide(ride);
    
    // Extract driver location from ride data
    if (ride.driver?.current_location?.coordinates) {
      const [lng, lat] = ride.driver.current_location.coordinates;
      setDriverLocation({ lat, lng });
    } else if (ride.pickup_location?.coordinates) {
      // Fallback to pickup location if driver location not available
      const [lng, lat] = ride.pickup_location.coordinates;
      setDriverLocation({ lat, lng });
    } else {
      setDriverLocation(null);
    }
    
    setShowMapModal(true);
  };

  // Open Google Maps with driver location
  const openGoogleMaps = () => {
    if (driverLocation) {
      const { lat, lng } = driverLocation;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle view details
  const handleViewDetails = (ride) => {
    navigate(`/active-rides-details/${ride.rideId}`);
  };

  // Close map modal
  const closeMapModal = () => {
    setShowMapModal(false);
    setSelectedRide(null);
    setDriverLocation(null);
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  if (error && !loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | Active Rides</title>
      </Helmet>
      <Breadcrumbs />

      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Active Rides
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Monitor and manage all ongoing rides in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">
                  Total Active Rides
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {summary.totalActiveRides}
                </p>
              </div>
              <img className="h-8 w-8 rounded-full" src={toto} alt="Stats" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">
                  Total Distance
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {summary.totalDistance.toFixed(1)} km
                </p>
              </div>
              <FiMapPin className="text-2xl sm:text-3xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">
                  Total Earnings
                </p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  ₹{summary.totalEarnings.toLocaleString()}
                </p>
              </div>
              <FaIndianRupeeSign className="text-2xl sm:text-3xl text-purple-200" />
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filters & Sorting
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  className="w-full sm:w-48 pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                >
                  <option value="createdAt">Sort by Date</option>
                  <option value="total_km">Sort by Distance</option>
                  <option value="total_amount">Sort by Amount</option>
                  <option value="started_time">Sort by Start Time</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {getSortIcon(sortBy)}
                </div>
              </div>

              {/* Sort Order Toggle */}
              <button
                onClick={() => {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium"
              >
                {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
              </button>

              {/* Search Input */}
              <div className="relative flex-1 lg:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rides..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setSearchTerm("")}
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rides Table */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Active Rides ({pagination.total})
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {pagination.pages}
                </div>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden">
              {rides.length > 0 ? (
                rides.map((ride) => (
                  <div
                    key={ride.rideId}
                    className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {/* Driver Info */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                          <FiUser size={16} />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {ride.driver?.name || "-"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <FiPhone size={12} className="mr-1" />
                            {ride.driver?.phone || "-"}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 inline-flex items-center rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <span className="w-2 h-2 rounded-full mr-1 bg-green-500"></span>
                        Active
                      </span>
                    </div>

                    {/* Passenger Info */}
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                        <FiUser size={12} />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {ride.rider?.name || "-"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <FiPhone size={12} className="mr-1" />
                          {ride.rider?.phone || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Ride Info */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Distance
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {ride.total_km || 0} km
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Amount
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{ride.total_amount || 0}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(ride.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(ride)}
                          className="inline-flex items-center p-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-xs"
                          title="View Details"
                        >
                          <FiEye size={12} />
                        </button>
                        <button
                          onClick={() => handleViewLocation(ride)}
                          className="inline-flex items-center p-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-xs"
                          title="View Location"
                        >
                          <FiMap size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3 flex justify-center">
                    <img
                      className="w-28 h-28 rounded-full"
                      src={toto}
                      alt="No rides"
                    />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                    No active rides
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "No rides found for your search"
                      : "There are currently no active rides in the system"}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Passenger
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      <button
                        className="flex items-center hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => handleSortChange("total_km")}
                      >
                        Distance {getSortIcon("total_km")}
                      </button>
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      <button
                        className="flex items-center hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => handleSortChange("total_amount")}
                      >
                        Amount {getSortIcon("total_amount")}
                      </button>
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      <button
                        className="flex items-center hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => handleSortChange("createdAt")}
                      >
                        Date {getSortIcon("createdAt")}
                      </button>
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {rides.length > 0 ? (
                    rides.map((ride) => (
                      <tr
                        key={ride.rideId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {/* Driver Column */}
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                              <FiUser size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {ride.driver?.name || "-"}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <FiPhone size={14} className="mr-1" />
                                {ride.driver?.phone || "-"}
                              </p>
                              {ride.franchiseInfo && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  {ride.franchiseInfo.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Passenger Column */}
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                              <FiUser size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {ride.rider?.name || "-"}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <FiPhone size={14} className="mr-1" />
                                {ride.rider?.phone || "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Distance Column */}
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center">
                            <FiMapPin
                              className="text-blue-500 mr-2"
                              size={16}
                            />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {ride.total_km || 0} km
                            </span>
                          </div>
                        </td>

                        {/* Amount Column */}
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center">
                            <FaIndianRupeeSign
                              className="text-green-500 mr-2"
                              size={16}
                            />
                            <span className="font-medium text-gray-900 dark:text-white">
                              ₹{ride.total_amount || 0}
                            </span>
                          </div>
                          {ride.payment_mode && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                ride.payment_mode === "cash"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {ride.payment_mode}
                            </span>
                          )}
                        </td>

                        {/* Status Column */}
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <span className="w-2 h-2 rounded-full mr-1 bg-green-500"></span>
                              Active
                            </span>
                            {ride.isRide_started && !ride.isRide_ended && (
                              <span className="text-xs text-blue-600 dark:text-blue-400">
                                In Progress
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date Column */}
                        <td className="px-4 lg:px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(ride.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(ride.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(ride)}
                              className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
                              title="View Details"
                            >
                              <FiEye size={14} />
                              <span className="ml-1">Details</span>
                            </button>
                            <button
                              onClick={() => handleViewLocation(ride)}
                              className="inline-flex items-center px-3 py-1 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-sm font-medium"
                              title="View Location"
                            >
                              <FiMap size={14} />
                              <span className="ml-1">Map</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4 flex justify-center">
                          <img
                            className="rounded-full w-28 h-28"
                            src={toto}
                            alt="No rides"
                          />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No active rides found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "There are currently no active rides in the system"}
                        </p>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Clear Search
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            {pagination.pages > 1 && (
              <Pagination
                pagination={{
                  page: pagination.page,
                  pages: pagination.pages,
                  total: pagination.total,
                  limit: pagination.limit,
                }}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </div>

      {/* Map Modal */}
      {showMapModal && selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="relative bg-white dark:bg-gray-800 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <button
              onClick={closeMapModal}
              className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
              title="Close"
            >
              <FiX size={20} />
            </button>

            {/* Map Content */}
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
              <div className="text-center">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                  <FiMapPin
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Driver Location
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                  Ride ID:{" "}
                  <span className="font-mono font-semibold text-xs sm:text-sm">
                    {selectedRide.rideId}
                  </span>
                </p>

                {driverLocation ? (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg mb-6">
                    <p className="text-green-800 dark:text-green-200 font-semibold mb-2 text-sm sm:text-base">
                      Driver Location Available!
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                      Latitude:{" "}
                      <span className="font-mono">
                        {driverLocation.lat.toFixed(6)}
                      </span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                      Longitude:{" "}
                      <span className="font-mono">
                        {driverLocation.lng.toFixed(6)}
                      </span>
                    </p>
                    
                    {/* Driver Information */}
                    <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                      <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                        Driver: <span className="font-semibold">{selectedRide.driver?.name || "Unknown"}</span>
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                        Phone: <span className="font-mono">{selectedRide.driver?.phone || "N/A"}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 sm:p-4 rounded-lg mb-6">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm sm:text-base">
                      Driver location not available
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={openGoogleMaps}
                    disabled={!driverLocation}
                    className={`inline-flex items-center px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                      driverLocation
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FiNavigation className="mr-2" />
                    Open in Google Maps
                  </button>
                  <button
                    onClick={closeMapModal}
                    className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRides;