import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { rideHistoryAPI } from "../../apis/RideHistory";
import Breadcrumbs from '../Breadcrumbs/BreadCrumbs';
import {
  FiEye,
  FiX,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiFilter
} from "react-icons/fi";
import { Helmet } from "react-helmet";
import { FaIndianRupeeSign } from "react-icons/fa6";
import toto from "../../assets/sidebar/toto.jpg"

const RideHistory = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search, filter, and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRideHistory();
  }, []);

  const fetchRideHistory = async () => {
    try {
      setLoading(true);
      const ridesData = await rideHistoryAPI.getRideHistory();
      setRides(ridesData);
    } catch (error) {
      console.error("Error fetching ride history:", error);
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtered and searched rides
  const filteredRides = useMemo(() => {
    let result = [...rides];

    // Search by driver/rider name or phone
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((ride) =>
        (ride.driverId?.name?.toLowerCase() || "").includes(term) ||
        (ride.driverId?.phone || "").includes(term) ||
        (ride.riderId?.name?.toLowerCase() || "").includes(term) ||
        (ride.riderId?.phone || "").includes(term)
      );
    }

    // Payment mode filter
    if (paymentFilter !== "all") {
      result = result.filter(
        (ride) => ride.payment_mode?.toLowerCase() === paymentFilter
      );
    }

    // Date filter (createdAt)
    if (dateFilter) {
      result = result.filter((ride) => {
        const rideDate = new Date(ride.createdAt);
        const selectedDate = new Date(dateFilter);
        return (
          rideDate.getFullYear() === selectedDate.getFullYear() &&
          rideDate.getMonth() === selectedDate.getMonth() &&
          rideDate.getDate() === selectedDate.getDate()
        );
      });
    }

    return result;
  }, [rides, searchTerm, paymentFilter, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredRides.slice(startIndex, startIndex + itemsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Reset to first page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, paymentFilter, dateFilter, rides]);

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
      ? "bg-green-100 text-green-800 border border-green-300"
      : "bg-red-100 text-red-800 border border-red-300";
  };

  const getTotalRevenue = () => {
    return rides.reduce((sum, ride) => sum + (ride.total_amount || 0), 0);
  };

  const getTotalAdminProfit = () => {
    return rides.reduce((sum, ride) => sum + (ride.admin_profit || 0), 0);
  };

  const getTotalDriverProfit = () => {
    return rides.reduce((sum, ride) => sum + (ride.driver_profit || 0), 0);
  };

  const getTotalRides = () => {
    return rides.length;
  };

  if (loading) {
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

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumbs />

      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Ride History
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            View and manage all completed rides
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Total Rides</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">{getTotalRides()}</p>
              </div>
              <FiCalendar className="text-xl sm:text-3xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">₹{getTotalRevenue().toLocaleString()}</p>
              </div>
              <FaIndianRupeeSign className="text-xl sm:text-3xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Admin Profit</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">₹{getTotalAdminProfit().toLocaleString()}</p>
              </div>
              <FaIndianRupeeSign className="text-xl sm:text-3xl text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs sm:text-sm">Driver Profit</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">₹{getTotalDriverProfit().toLocaleString()}</p>
              </div>
              <FaIndianRupeeSign className="text-xl sm:text-3xl text-orange-200" />
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by driver/rider name or phone..."
                className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

            {/* Date Filter */}
            <input
              type="date"
              className="px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {/* Clear Filters */}
          {(searchTerm || paymentFilter !== "all" || dateFilter) && (
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm"
                onClick={() => {
                  setSearchTerm("");
                  setPaymentFilter("all");
                  setDateFilter("");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Rides ({filteredRides.length} found)
            </h2>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden">
            {currentData.length > 0 ? (
              currentData.map((ride) => (
                <div 
                  key={ride._id}
                  className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Driver and Passenger Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden mr-2">
                          {ride.driverId?.driver_photo ? (
                            <img
                              src={ride.driverId.driver_photo}
                              alt={ride.driverId.name}
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
                            Driver: {ride.driverId?.name || "No Name"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {ride.driverId?.phone || "No Phone"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden mr-2">
                          {ride.riderId?.photo ? (
                            <img
                              src={ride.riderId.photo}
                              alt={ride.riderId.name}
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
                            Passenger: {ride.riderId?.name || "No Name"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {ride.riderId?.phone || "No Phone"}
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
                        {formatDate(ride.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleViewDetails(ride._id)}
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
                  {rides.length === 0 
                    ? "There are no ride history records available."
                    : "There are no rides matching your search criteria."
                  }
                </p>
                {(searchTerm || paymentFilter !== "all" || dateFilter) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setPaymentFilter("all");
                      setDateFilter("");
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
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Passenger
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {currentData.length > 0 ? (
                  currentData.map((ride) => (
                    <tr
                      key={ride._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {/* Driver Column */}
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                            {ride.driverId?.driver_photo ? (
                              <img
                                src={ride.driverId.driver_photo}
                                alt={ride.driverId.name}
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
                              {ride.driverId?.name || "No Name"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FiPhone size={14} className="mr-1" />
                              {ride.driverId?.phone || "No Phone"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Passenger Column */}
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                            {ride.riderId?.photo ? (
                              <img
                                src={ride.riderId.photo}
                                alt={ride.riderId.name}
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
                              {ride.riderId?.name || "No Name"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FiPhone size={14} className="mr-1" />
                              {ride.riderId?.phone || "No Phone"}
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
                        <span className="px-3 py-1 inline-flex items-center rounded-full text-sm font-semibold text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200">
                          <FaIndianRupeeSign size={14} className="mr-1" />
                          ₹{(ride.total_amount || 0).toLocaleString()}
                        </span>
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
                        <div className="flex items-center justify-center text-gray-700 dark:text-gray-300">
                          <FiCalendar size={14} className="mr-2" />
                          <span className="text-sm font-medium">
                            {formatDateTime(ride.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Action Column */}
                      <td className="px-4 lg:px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(ride._id)}
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
                    <td colSpan={7} className="py-8 sm:py-12 text-center">
                      <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4 flex justify-center">
                        <img className="rounded-full w-28 h-28" src={toto} alt="" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No rides found
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
                        {rides.length === 0 
                          ? "There are no ride history records available."
                          : "There are no rides matching your search criteria."
                        }
                      </p>
                      {(searchTerm || paymentFilter !== "all" || dateFilter) && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setPaymentFilter("all");
                            setDateFilter("");
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
          {totalPages > 1 && (
            <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredRides.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredRides.length}</span> results
                </p>
                
                <div className="flex items-center space-x-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
                  >
                    <FiChevronLeft size={14} className="mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1 mx-1 sm:mx-2">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-xs sm:text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <FiChevronRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideHistory;