import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { rideHistoryAPI } from "../../apis/RideHistory";
import Breadcrumbs from '../Breadcrumbs/BreadCrumbs';
import Pagination from "../../utils/Pagination";
import {
  FiEye,
  FiX,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiSearch,
  FiDollarSign
} from "react-icons/fi";
import { Helmet } from "react-helmet";
import { FaIndianRupeeSign } from "react-icons/fa6";
import toto from "../../assets/sidebar/toto.jpg"
import loginAPI from "../../apis/Login";

const RideHistory = () => {
  const navigate = useNavigate();

  // State management
  const [rides, setRides] = useState([]);
  const [summary, setSummary] = useState({
    totalRides: 0,
    totalAmount: 0,
    totalAdminProfit: 0,
    totalDriverProfit: 0,
    totalFranchiseProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("ride_end_time");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });

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

  // Fetch ride history from API
  const fetchRideHistory = useCallback(
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

        // Add filters
        if (paymentFilter !== "all") {
          apiParams.paymentMode = paymentFilter;
        }

        if (dateFilter) {
          apiParams.startDate = dateFilter;
          apiParams.endDate = dateFilter;
        }

        if (statusFilter !== "all") {
          apiParams.rideStatus = statusFilter;
        }

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

        console.log("Fetching ride history with params:", apiParams);

        const response = await rideHistoryAPI.getRideHistory(apiParams);

        console.log("API Response:", response);

        // Set summary statistics
        if (response.summary) {
          setSummary(response.summary);
        } else {
          setSummary({
            totalRides: response.pagination?.total || 0,
            totalAmount: 0,
            totalAdminProfit: 0,
            totalDriverProfit: 0,
            totalFranchiseProfit: 0,
          });
        }

        // Set rides data
        if (response.rides && Array.isArray(response.rides)) {
          setRides(response.rides);
        } else {
          setRides([]);
        }

        // Set pagination data
        if (response.pagination) {
          setPagination({
            page: response.pagination.page || 1,
            pages: response.pagination.totalPages || 1,
            total: response.pagination.total || 0,
            limit: response.pagination.limit || 10,
          });
        }
      } catch (err) {
        console.error("Error fetching ride history:", err);
        setError(err.message || "Failed to load ride history");
        setRides([]);
        setSummary({
          totalRides: 0,
          totalAmount: 0,
          totalAdminProfit: 0,
          totalDriverProfit: 0,
          totalFranchiseProfit: 0,
        });
        setPagination({
          page: 1,
          pages: 1,
          total: 0,
          limit: 10,
        });
      } finally {
        setLoading(false);
      }
    },
    [
      pagination.page,
      pagination.limit,
      searchTerm,
      paymentFilter,
      dateFilter,
      statusFilter,
      sortBy,
      sortOrder,
      getCurrentUserInfo,
    ]
  );

  // Initial fetch and when pagination/filters change
  useEffect(() => {
    fetchRideHistory();
  }, [pagination.page, sortBy, sortOrder]);

  // Debounced search effect
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchRideHistory({ search: searchTerm, page: 1 });
      }
    }, 800);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Reset filters and reload
  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchRideHistory({ page: 1 });
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [paymentFilter, dateFilter, statusFilter]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const handleViewDetails = (rideId) => {
    navigate(`/ride-history/${rideId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "No Date";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getPaymentStatusBadge = (isPaid) => {
    return isPaid 
      ? "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
      : "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700";
  };

  if (loading && rides.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Helmet>
          <title>Admin | Ride History</title>
        </Helmet>
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
          <div className="ml-3 sm:ml-4 text-sm sm:text-lg text-gray-600 dark:text-gray-300">
            Loading ride history...
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Helmet>
          <title>Admin | Ride History</title>
        </Helmet>
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
        <title>Admin | Ride History</title>
      </Helmet>
      <Breadcrumbs />

      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Ride History
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            View all completed rides with detailed information
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Total Rides</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">{summary.totalRides.toLocaleString()}</p>
              </div>
              <FiCalendar className="text-xl sm:text-3xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">₹{summary.totalAmount.toLocaleString()}</p>
              </div>
              <FaIndianRupeeSign className="text-xl sm:text-3xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Admin Profit</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">₹{summary.totalAdminProfit.toLocaleString()}</p>
              </div>
              <FaIndianRupeeSign className="text-xl sm:text-3xl text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs sm:text-sm">Driver Profit</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">₹{summary.totalDriverProfit.toLocaleString()}</p>
              </div>
              <FaIndianRupeeSign className="text-xl sm:text-3xl text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-xs sm:text-sm">Franchise Profit</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">₹{summary.totalFranchiseProfit.toLocaleString()}</p>
              </div>
              <FaIndianRupeeSign className="text-xl sm:text-3xl text-pink-200" />
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filters & Sorting
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rides..."
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
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

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Payment Modes</option>
              <option value="online">Online</option>
              <option value="cash">Cash</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="unpaid">Unpaid</option>
              <option value="canceled">Canceled</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              className="px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                className="w-full pl-3 pr-8 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <option value="ride_end_time">Sort by Date</option>
                <option value="total_km">Sort by Distance</option>
                <option value="total_amount">Sort by Amount</option>
                <option value="started_time">Sort by Start Time</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                {getSortIcon(sortBy)}
              </div>
            </div>
          </div>

          {/* Sort Order Toggle & Clear Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-between">
            {/* <button
              onClick={() => {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium"
            >
              {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
            </button> */}

            {(searchTerm || paymentFilter !== "all" || dateFilter || statusFilter !== "all") && (
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm"
                onClick={() => {
                  setSearchTerm("");
                  setPaymentFilter("all");
                  setDateFilter("");
                  setStatusFilter("all");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Completed Rides ({pagination.total.toLocaleString()} found)
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
                  {/* Driver and Passenger Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden mr-2">
                          {ride.driver?.driver_photo ? (
                            <img
                              src={ride.driver.driver_photo}
                              alt={ride.driver.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <FiUser size={12} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-xs">
                            Driver: {ride.driver?.name || "No Name"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {ride.driver?.phone || "No Phone"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden mr-2">
                          {ride.rider?.photo ? (
                            <img
                              src={ride.rider.photo}
                              alt={ride.rider.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <FiUser size={12} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-xs">
                            Passenger: {ride.rider?.name || "No Name"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {ride.rider?.phone || "No Phone"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ride Details */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Distance</div>
                      <div className="text-gray-900 dark:text-white text-sm flex items-center">
                        <FiMapPin size={12} className="mr-1" />
                        {ride.total_km || 0} km
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Amount</div>
                      <div className="text-green-600 dark:text-green-400 font-semibold text-sm">
                        ₹{(ride.total_amount || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Payment and Date */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Payment</div>
                      <div className="space-y-1">
                        <span className={`px-2 py-1 inline-flex items-center rounded-full text-xs font-medium ${getPaymentStatusBadge(ride.isPayment_done)}`}>
                          {ride.isPayment_done ? "Paid" : "Unpaid"}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {ride.payment_mode || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Date</div>
                      <div className="text-gray-900 dark:text-white text-sm flex items-center">
                        <FiCalendar size={12} className="mr-1" />
                        {formatDate(ride.ride_end_time)}
                      </div>
                    </div>
                  </div>

                 
                  {/* Action */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleViewDetails(ride.rideId)}
                      className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-xs font-medium"
                      title="View Details"
                    >
                      <FiEye size={12} className="mr-1" />
                      Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3 flex justify-center">
                  <img className="rounded-full h-28 w-28" src={toto} alt="" />
                </div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  No rides found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm || paymentFilter !== "all" || dateFilter || statusFilter !== "all"
                    ? "There are no rides matching your search criteria."
                    : "There are no ride history records available."
                  }
                </p>
                {(searchTerm || paymentFilter !== "all" || dateFilter || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setPaymentFilter("all");
                      setDateFilter("");
                      setStatusFilter("all");
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Clear Filters
                  </button>
                )}
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
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      className="flex items-center justify-center hover:text-blue-600 dark:hover:text-blue-400 w-full"
                      onClick={() => handleSortChange("total_km")}
                    >
                      Distance {getSortIcon("total_km")}
                    </button>
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      className="flex items-center justify-center hover:text-blue-600 dark:hover:text-blue-400 w-full"
                      onClick={() => handleSortChange("total_amount")}
                    >
                      Amount {getSortIcon("total_amount")}
                    </button>
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      className="flex items-center justify-center hover:text-blue-600 dark:hover:text-blue-400 w-full"
                      onClick={() => handleSortChange("ride_end_time")}
                    >
                      Date & Time {getSortIcon("ride_end_time")}
                    </button>
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Action
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
                          <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                            {ride.driver?.driver_photo ? (
                              <img
                                src={ride.driver.driver_photo}
                                alt={ride.driver.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <FiUser size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {ride.driver?.name || "No Name"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FiPhone size={14} className="mr-1" />
                              {ride.driver?.phone || "No Phone"}
                            </p>
                            {ride.driver?.eto_id_num && (
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                ETO: {ride.driver.eto_id_num}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Passenger Column */}
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                            {ride.rider?.photo ? (
                              <img
                                src={ride.rider.photo}
                                alt={ride.rider.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <FiUser size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {ride.rider?.name || "No Name"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FiPhone size={14} className="mr-1" />
                              {ride.rider?.phone || "No Phone"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Distance Column */}
                      <td className="px-4 lg:px-6 py-4 text-center">
                        <div className="flex items-center justify-center text-gray-700 dark:text-gray-300">
                          <FiMapPin size={14} className="mr-2" />
                          <span className="text-sm font-medium">
                            {ride.total_km || 0} km
                          </span>
                        </div>
                      </td>

                      {/* Amount Column */}
                      <td className="px-4 lg:px-6 py-4 text-center">
                        <div className="space-y-1">
                          <span className="px-3 py-1 inline-flex items-center rounded-full text-sm font-semibold text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200">
                            <FaIndianRupeeSign size={14} className="mr-1" />
                            ₹{(ride.total_amount || 0).toLocaleString()}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Driver: ₹{ride.driver_profit?.toLocaleString() || 0}
                          </div>
                        </div>
                      </td>

                      {/* Payment Column */}
                      <td className="px-4 lg:px-6 py-4 text-center">
                        <div className="space-y-1">
                          <span className={`px-2 py-1 inline-flex items-center rounded-full text-xs font-medium ${getPaymentStatusBadge(ride.isPayment_done)}`}>
                            {ride.isPayment_done ? "Paid" : "Unpaid"}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {ride.payment_mode || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Date Column */}
                      <td className="px-4 lg:px-6 py-4 text-center">
                        <div className="flex flex-col items-center text-gray-700 dark:text-gray-300">
                          <span className="text-sm font-medium">
                            {formatDate(ride.ride_end_time)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDateTime(ride.ride_end_time).split(', ')[1]}
                          </span>
                        </div>
                      </td>

                     

                      {/* Action Column */}
                      <td className="px-4 lg:px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(ride.rideId)}
                          className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
                          title="View Details"
                        >
                          <FiEye size={14} className="mr-1" />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 sm:py-12 text-center">
                      <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4 flex justify-center">
                        <img className="rounded-full w-28 h-28" src={toto} alt="" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No rides found
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm || paymentFilter !== "all" || dateFilter || statusFilter !== "all"
                          ? "Try adjusting your search terms"
                          : "There are no ride history records available."
                        }
                      </p>
                      {(searchTerm || paymentFilter !== "all" || dateFilter || statusFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setPaymentFilter("all");
                            setDateFilter("");
                            setStatusFilter("all");
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                        >
                          Clear Filters
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
      </div>
    </div>
  );
};

export default RideHistory;