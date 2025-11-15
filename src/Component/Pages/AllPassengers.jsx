import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { allPassengerAPI } from "../../apis/AllPassenger";
import Breadcrumbs from '../Breadcrumbs/BreadCrumbs';
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiPhone,
  FiTrendingUp,
  FiEye,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Helmet } from "react-helmet";

const AllPassengers = () => {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([]);
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rideFilter, setRideFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch passengers data
  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        setLoading(true);
        const passengersData = await allPassengerAPI.getAllPassengers();
        setPassengers(passengersData);
        setFilteredPassengers(passengersData);
      } catch (error) {
        console.error("Error fetching passengers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPassengers();
  }, []);

  // Filter passengers
  useEffect(() => {
    const timerId = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm, rideFilter, passengers]);

  const applyFilters = useCallback(() => {
    let result = [...passengers];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((passenger) => {
        const nameMatch = passenger.name?.toLowerCase().includes(term) || false;
        const phoneMatch = passenger.phone?.includes(term) || false;
        return nameMatch || phoneMatch;
      });
    }

    // Apply ride status filter
    if (rideFilter !== "all") {
      const isOnRide = rideFilter === "onride";
      result = result.filter((passenger) => passenger.is_on_ride === isOnRide);
    }

    setFilteredPassengers(result);
    setCurrentPage(1);
  }, [searchTerm, rideFilter, passengers]);

  const handleDeletePassenger = async (passengerId) => {
    if (!window.confirm("Are you sure you want to delete this passenger? This action cannot be undone.")) {
      return;
    }
    try {
      await allPassengerAPI.deletePassenger(passengerId);
      setPassengers((prev) => prev.filter((p) => p.id !== passengerId));
      setFilteredPassengers((prev) => prev.filter((p) => p.id !== passengerId));
    } catch (error) {
      alert("Failed to delete passenger. Please try again.");
      console.error(error);
    }
  };

  const viewPassengerDetails = (passenger) => {
    navigate(`/all-passenger-details/${passenger.id}`);
  };

  // Pagination
  const totalPages = Math.ceil(filteredPassengers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPassengers = filteredPassengers.slice(startIndex, startIndex + itemsPerPage);

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
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading passengers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
              <title>Admin | All Passengers</title>
            </Helmet>
      <Breadcrumbs />
      
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            All Passengers
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage and monitor all registered passengers in the system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Total Passengers</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">{passengers.length}</p>
              </div>
              <FiUser className="text-2xl sm:text-3xl text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">On Ride</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {passengers.filter(p => p.is_on_ride).length}
                </p>
              </div>
              <FiTrendingUp className="text-2xl sm:text-3xl text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Not On Ride</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {passengers.filter(p => !p.is_on_ride).length}
                </p>
              </div>
              <FiUser className="text-2xl sm:text-3xl text-purple-200" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search passengers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
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
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                value={rideFilter}
                onChange={(e) => setRideFilter(e.target.value)}
              >
                <option value="all">All Passengers</option>
                <option value="onride">On Ride</option>
                <option value="notonride">Not On Ride</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Passenger List ({filteredPassengers.length} passengers)
            </h2>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden">
            {currentPassengers.map((passenger, index) => (
              <div 
                key={index}
                className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                        src={passenger.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(passenger.name)}`}
                        alt={passenger.name}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {passenger.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {passenger.id}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      passenger.is_on_ride
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-1 ${passenger.is_on_ride ? 'bg-green-500' : 'bg-red-400'}`}></span>
                    {passenger.is_on_ride ? "On Ride" : "Not on Ride"}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Phone</div>
                    <div className="text-gray-900 dark:text-white">
                      {passenger.phone || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Total Rides</div>
                    <div className="text-gray-900 dark:text-white">
                      {passenger.total_rides || '0'}
                    </div>
                  </div>
                </div>

                {/* Joined Date */}
                <div className="mb-4 text-sm">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Joined Date</div>
                  <div className="text-gray-900 dark:text-white">
                    {passenger.createdAt ? new Date(passenger.createdAt).toLocaleDateString() : '-'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => viewPassengerDetails(passenger)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
                  >
                    <FiEye size={14} className="mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDeletePassenger(passenger.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm"
                  >
                    <FiTrash2 size={14} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Passenger
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Total Rides
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {currentPassengers.map((passenger, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    {/* Passenger Info */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12">
                          <img
                            className="h-10 w-10 lg:h-12 lg:w-12 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                            src={passenger.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(passenger.name)}`}
                            alt={passenger.name}
                          />
                        </div>
                        <div className="ml-3 lg:ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {passenger.name}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                            {passenger.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {passenger.phone || '-'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          passenger.is_on_ride
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mr-1 ${passenger.is_on_ride ? 'bg-green-500' : 'bg-red-400'}`}></span>
                        {passenger.is_on_ride ? "On Ride" : "Not on Ride"}
                      </span>
                    </td>

                    {/* Total Rides */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {passenger.total_rides || '0'}
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {passenger.createdAt ? new Date(passenger.createdAt).toLocaleDateString() : '-'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => viewPassengerDetails(passenger)}
                          className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
                        >
                          <FiEye size={14} className="mr-1" />
                          View
                        </button>
                       
                        <button
                          onClick={() => handleDeletePassenger(passenger.id)}
                          className="inline-flex items-center px-3 py-1 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm"
                        >
                          <FiTrash2 size={14} className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredPassengers.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4">👤</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                No passengers found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                {searchTerm || rideFilter !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "No passengers are currently registered"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredPassengers.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredPassengers.length}</span> results
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

export default AllPassengers;