// src/components/TopDriver.jsx
import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Breadcrumbs/BreadCrumbs';
import { useNavigate } from 'react-router-dom';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { PiUsersThreeFill } from 'react-icons/pi';
import { TbCarSuvFilled } from 'react-icons/tb';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { topDriverAPI } from '../../apis/TopDriver';
import { Helmet } from 'react-helmet';
import toto from "../../assets/sidebar/toto.jpg"

const TopDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopDrivers = async () => {
      try {
        const response = await topDriverAPI.getAllTopDrivers();
        setDrivers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top drivers:', error);
        setLoading(false);
      }
    };

    fetchTopDrivers();
  }, []);

  function registerdAt(dateString) {
    let date = new Date(dateString);
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear().toString().slice(-2);
    return `${day} / ${month} / ${year}`;
  }

  const handleViewProfile = (driver) => {
    navigate(`/top-driver-details/${driver.driverId || driver.driverDetails._id}`);
  };

  // Pagination
  const totalPages = Math.ceil(drivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDrivers = drivers.slice(startIndex, startIndex + itemsPerPage);

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
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading top drivers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
       <Helmet>
              <title>Admin | Top Drivers</title>
            </Helmet>
      <Breadcrumbs />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Top Drivers
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Our most successful and reliable drivers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Total Drivers</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">{drivers.length}</p>
              </div>
              <div className="text-2xl sm:text-3xl"><PiUsersThreeFill /></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Total Rides</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {drivers.reduce((total, driver) => total + driver.rideCount, 0)}
                </p>
              </div>
              <div className="text-2xl sm:text-3xl"><img className='w-8 h-8 md:w-12 md:h-12 rounded-full' src={toto} alt="" /></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Total Earnings</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  ₹{drivers.reduce((total, driver) => total + (driver.driverDetails.total_earning || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="text-2xl sm:text-3xl"><FaIndianRupeeSign /></div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
              Driver Performance
            </h2>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden">
            {currentDrivers.map((driver, index) => (
              <div 
                key={index}
                className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full border-2 border-blue-200 dark:border-blue-800 object-cover"
                        src={driver.driverDetails.driver_photo}
                        alt={driver.driverDetails.name}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {driver.driverDetails.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {driver.driverDetails.phone}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                    {driver.rideCount} rides
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Registered</div>
                    <div className="text-gray-900 dark:text-white">
                      {registerdAt(driver.driverDetails.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Earnings</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      ₹{driver.driverDetails.total_earning?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleViewProfile(driver)}
                  className="w-full flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Profile
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Total Rides
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {currentDrivers.map((driver, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    {/* Driver Info */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12">
                          <img
                            className="h-10 w-10 lg:h-12 lg:w-12 rounded-full border-2 border-blue-200 dark:border-blue-800 object-cover"
                            src={driver.driverDetails.driver_photo}
                            alt={driver.driverDetails.name}
                          />
                        </div>
                        <div className="ml-3 lg:ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {driver.driverDetails.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {driver.driverDetails.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Total Rides */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-1 lg:mr-2"></span>
                          {driver.rideCount} rides
                        </span>
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {registerdAt(driver.driverDetails.createdAt)}
                      </div>
                    </td>

                    {/* Earnings */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ₹{driver.driverDetails.total_earning?.toLocaleString() || '0'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewProfile(driver)}
                        className="inline-flex items-center px-3 lg:px-4 py-2 border border-transparent text-xs lg:text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
                      >
                        <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, drivers.length)}
                  </span>{" "}
                  of <span className="font-medium">{drivers.length}</span> top drivers
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

        {/* Empty State */}
        {drivers.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4 flex items-center justify-center"><img className='rounded-full w-28 h-28' src={toto} alt="" /></div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
              No drivers found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              There are no top drivers to display at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopDrivers;