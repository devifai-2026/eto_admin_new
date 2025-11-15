import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activeRidesAPI } from "../../apis/ActiveRides";
import Breadcrumbs from '../Breadcrumbs/BreadCrumbs';
import socket, { 
  connectSocket, 
  setupListeners, 
  registerAdmin,
  requestDriverLocation,
  onDriverLocationUpdate 
} from '../../socket';
import {
  FiMapPin,
  FiPhone,
  FiUser,
  FiTruck,
  FiEye,
  FiMap,
  FiX,
  FiClock,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { Helmet } from "react-helmet";

const ActiveRides = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Initialize Socket.io
  useEffect(() => {
    connectSocket();
    setupListeners();
    registerAdmin("admin_id_here"); // Replace with actual admin ID

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    fetchActiveRides();
  }, []);

  const fetchActiveRides = async () => {
    try {
      setLoading(true);
      const ridesData = await activeRidesAPI.getActiveRides();
      setRides(ridesData);
      setFilteredRides(ridesData);
    } catch (error) {
      console.error("Error fetching active rides:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm, rides]);

  const applyFilters = () => {
    let result = [...rides];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((ride) =>
        ride.driver?.name?.toLowerCase().includes(term) ||
        ride.driver?.phone?.includes(term) ||
        ride.rider?.name?.toLowerCase().includes(term) ||
        ride.rider?.phone?.includes(term)
      );
    }

    setFilteredRides(result);
    setCurrentPage(1);
  };

  const handleViewLocation = (rideId) => {
    setSelectedRideId(rideId);
    setShowMapModal(true);
    
    // Request driver location via socket
    requestDriverLocation(rideId, "admin_id_here"); // Replace with actual admin ID
    
    // Listen for location updates
    onDriverLocationUpdate((data) => {
      console.log("Location data received:", data);
      if (data.success && data.location) {
        const [lng, lat] = data.location.coordinates;
        setDriverLocation({ lat, lng, rideId: data.rideId });
      }
    });
  };

  const handleViewDetails = (ride) => {
    navigate(`/active-rides-details/${ride.rideId}`);
  };

  const closeMapModal = () => {
    setShowMapModal(false);
    setSelectedRideId(null);
    setDriverLocation(null);
  };

  // Pagination
  const totalPages = Math.ceil(filteredRides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRides = filteredRides.slice(startIndex, startIndex + itemsPerPage);

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
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading active rides...</div>
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
                <p className="text-blue-100 text-xs sm:text-sm">Total Active Rides</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">{rides.length}</p>
              </div>
              <FiTruck className="text-2xl sm:text-3xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Avg Distance</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {rides.length > 0 
                    ? (rides.reduce((sum, ride) => sum + (ride.total_km || 0), 0) / rides.length).toFixed(1) 
                    : '0'} km
                </p>
              </div>
              <FiMapPin className="text-2xl sm:text-3xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Total Distance</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {rides.reduce((sum, ride) => sum + (ride.total_km || 0), 0)} km
                </p>
              </div>
              <FiClock className="text-2xl sm:text-3xl text-purple-200" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by driver name, phone, passenger name or phone..."
              className="w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                <FiX size={16} className="sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Rides ({filteredRides.length} active)
            </h2>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden">
            {currentRides.length > 0 ? (
              currentRides.map((ride) => (
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
                          {ride.driver?.name || '-'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <FiPhone size={12} className="mr-1" />
                          {ride.driver?.phone || '-'}
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
                        {ride.rider?.name || '-'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <FiPhone size={12} className="mr-1" />
                        {ride.rider?.phone || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Distance and Actions */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 inline-flex items-center rounded-full text-xs font-semibold text-purple-800 bg-purple-100 dark:bg-purple-900 dark:text-purple-200">
                      <FiMapPin size={12} className="mr-1" />
                      {ride.total_km || 0} km
                    </span>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(ride)}
                        className="inline-flex items-center p-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-xs"
                        title="View Details"
                      >
                        <FiEye size={12} />
                      </button>

                      <button
                        onClick={() => handleViewLocation(ride.rideId)}
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
                <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">🚗</div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  No active rides
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  There are currently no active rides in the system
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
                    Passenger
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {currentRides.length > 0 ? (
                  currentRides.map((ride) => (
                    <tr key={ride.rideId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                            <FiUser size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{ride.driver?.name || '-'}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FiPhone size={14} className="mr-1" />
                              {ride.driver?.phone || '-'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                            <FiUser size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{ride.rider?.name || '-'}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FiPhone size={14} className="mr-1" />
                              {ride.rider?.phone || '-'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 lg:px-6 py-4 text-center">
                        <span className="px-3 py-1 inline-flex items-center rounded-full text-sm font-semibold text-purple-800 bg-purple-100 dark:bg-purple-900 dark:text-purple-200">
                          <FiMapPin size={14} className="mr-1" />
                          {ride.total_km || 0} km
                        </span>
                      </td>

                      <td className="px-4 lg:px-6 py-4 text-center">
                        <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <span className="w-2 h-2 rounded-full mr-1 bg-green-500"></span>
                          Active
                        </span>
                      </td>

                      <td className="px-4 lg:px-6 py-4 text-center">
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
                            onClick={() => handleViewLocation(ride.rideId)}
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
                    <td colSpan={5} className="py-12 text-center">
                      <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🚗</div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No active rides
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        There are currently no active rides in the system
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

      {/* Map Modal */}
      {showMapModal && selectedRideId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="relative bg-white dark:bg-gray-800 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <button
              onClick={closeMapModal}
              className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
              title="Close"
            >
              <FiX size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Map Content */}
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
              <div className="text-center">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                  <FiMapPin className="text-blue-600 dark:text-blue-400" size={24} className="sm:w-10 sm:h-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Live Location Tracking
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                  Ride ID: <span className="font-mono font-semibold text-xs sm:text-sm">{selectedRideId}</span>
                </p>
                
                {driverLocation ? (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg mb-6">
                    <p className="text-green-800 dark:text-green-200 font-semibold mb-2 text-sm sm:text-base">Driver Location Found!</p>
                    <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                      Latitude: <span className="font-mono">{driverLocation.lat.toFixed(6)}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                      Longitude: <span className="font-mono">{driverLocation.lng.toFixed(6)}</span>
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg mb-6">
                    <p className="text-blue-800 dark:text-blue-200 text-sm sm:text-base">Fetching driver location via Socket.io...</p>
                  </div>
                )}
                
                <button
                  onClick={closeMapModal}
                  className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRides;