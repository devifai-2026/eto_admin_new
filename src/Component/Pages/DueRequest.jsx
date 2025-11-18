import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { dueRequestAPI } from "../../apis/DueRequest";
import Breadcrumbs from '../Breadcrumbs/BreadCrumbs';
import {
  FiEye,
  FiX,
  FiCalendar,
  FiUser,
  FiPhone,
  FiChevronLeft,
  FiChevronRight,
  FiFilter
} from "react-icons/fi";
import { Helmet } from "react-helmet";
import { FaIndianRupeeSign } from "react-icons/fa6";

const DueRequest = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDueRequests();
  }, []);

  const fetchDueRequests = async () => {
    try {
      setLoading(true);
      const requestsData = await dueRequestAPI.getPendingDueRequests();
      setRequests(requestsData);
      setFilteredRequests(requestsData);
    } catch (error) {
      console.error("Error fetching due requests:", error);
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm, filterStatus, requests]);

  const applyFilters = useCallback(() => {
    let result = [...requests];

    if (filterStatus !== "all") {
      result = result.filter((request) => request.status === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((request) =>
        request.driver?.name?.toLowerCase().includes(term) ||
        request.driver?.phone?.includes(term) ||
        request.dueAmount?.toString().includes(term)
      );
    }

    setFilteredRequests(result);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, requests]);

  const handleViewDetails = (requestId) => {
    navigate(`/due-request/${requestId}`);
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

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      approved: "bg-green-100 text-green-800 border border-green-300",
      rejected: "bg-red-100 text-red-800 border border-red-300",
    };
    return styles[status] || styles.pending;
  };

  const getTotalAmount = () => {
    return requests.reduce((sum, req) => sum + (req.dueAmount || 0), 0);
  };

  const getStatusCount = (status) => {
    return requests.filter((req) => req.status === status).length;
  };

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = filteredRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
          <div className="ml-3 sm:ml-4 text-sm sm:text-lg text-gray-600 dark:text-gray-300">
            Loading due requests...
          </div>
        </div>
      </div>
    );
  }

  if (!loading && requests.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="max-w-full mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Due Requests
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage and process all driver due payment requests
            </p>
          </div>
          
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📭</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Due Requests Found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
              There are currently no due requests in the system.
            </p>
            <button
              onClick={fetchDueRequests}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
                    <title>Admin | Due Requests</title>
                  </Helmet>
      <Breadcrumbs />

      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Due Requests
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage and process all driver due payment requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Total Requests</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">{requests.length}</p>
              </div>
              <FaIndianRupeeSign className="text-xl sm:text-3xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-xs sm:text-sm">Pending</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">{getStatusCount("pending")}</p>
              </div>
              <FiCalendar className="text-xl sm:text-3xl text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Approved</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">{getStatusCount("approved")}</p>
              </div>
              <FiEye className="text-xl sm:text-3xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-xs sm:text-sm">Total Amount</p>
                <p className="text-lg sm:text-2xl font-bold mt-1">₹{getTotalAmount().toLocaleString()}</p>
              </div>
              <FaIndianRupeeSign className="text-xl sm:text-3xl text-red-200" />
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by driver name, phone, or amount..."
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

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Requests ({filteredRequests.length} found)
            </h2>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden">
            {currentRequests.length > 0 ? (
              currentRequests.map((request) => (
                <div 
                  key={request._id}
                  className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* Driver Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                        {request.driver?.photo ? (
                          <img
                            src={request.driver.photo}
                            alt={request.driver.name || 'Driver'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <FiUser size={16} />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {request.driver?.name || "No Name"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <FiPhone size={12} className="mr-1" />
                          {request.driver?.phone || "No Phone"}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 inline-flex items-center rounded-full text-xs font-medium ${getStatusBadge(request.status || 'pending')}`}>
                      <span className="w-2 h-2 rounded-full mr-1 bg-current opacity-50"></span>
                      {(request.status || 'pending')?.charAt(0).toUpperCase() + (request.status || 'pending')?.slice(1)}
                    </span>
                  </div>

                  {/* Amount and Date */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Amount</div>
                      <div className="text-green-600 dark:text-green-400 font-semibold text-sm">
                        ₹{(request.dueAmount || 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Requested</div>
                      <div className="text-gray-900 dark:text-white text-sm flex items-center">
                        <FiCalendar size={12} className="mr-1" />
                        {formatDate(request.requestedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method and Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">Payment Method</div>
                      <div className="text-gray-900 dark:text-white text-sm">
                        {(request.paymentMethod || 'N/A')?.charAt(0).toUpperCase() + (request.paymentMethod || 'N/A')?.slice(1)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(request._id)}
                      className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-xs font-medium"
                      title="View Details"
                    >
                      <FiEye size={12} className="mr-1" />
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">💰</div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  No due requests found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  There are no due requests matching your search criteria
                </p>
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
                    Amount
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Requested At
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {currentRequests.length > 0 ? (
                  currentRequests.map((request) => (
                    <tr
                      key={request._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                            {request.driver?.photo ? (
                              <img
                                src={request.driver.photo}
                                alt={request.driver.name || 'Driver'}
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
                              {request.driver?.name || "No Name"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FiPhone size={14} className="mr-1" />
                              {request.driver?.phone || "No Phone"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 lg:px-6 py-4">
                        <span className="px-3 py-1 inline-flex items-center rounded-full text-sm font-semibold text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200">
                          <FaIndianRupeeSign size={14} className="mr-1" />
                          ₹{(request.dueAmount || 0).toLocaleString()}
                        </span>
                      </td>

                      <td className="px-4 lg:px-6 py-4 text-center">
                        <div className="flex items-center justify-center text-gray-700 dark:text-gray-300">
                          <FiCalendar size={14} className="mr-2" />
                          <span className="text-sm font-medium">
                            {formatDate(request.requestedAt)}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 lg:px-6 py-4 text-center">
                        <span className={`px-3 py-1 inline-flex items-center rounded-full text-xs font-medium ${getStatusBadge(request.status || 'pending')}`}>
                          <span className="w-2 h-2 rounded-full mr-2 bg-current opacity-50"></span>
                          {(request.status || 'pending')?.charAt(0).toUpperCase() + (request.status || 'pending')?.slice(1)}
                        </span>
                      </td>

                      <td className="px-4 lg:px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {(request.paymentMethod || 'N/A')?.charAt(0).toUpperCase() + (request.paymentMethod || 'N/A')?.slice(1)}
                        </span>
                      </td>

                      <td className="px-4 lg:px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(request._id)}
                          className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
                          title="View Details"
                        >
                          <FiEye size={14} className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 sm:py-12 text-center">
                      <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4">
                        💰
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No due requests found
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                        There are no due requests matching your search criteria
                      </p>
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
                    {Math.min(startIndex + itemsPerPage, filteredRequests.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredRequests.length}</span> results
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

export default DueRequest;