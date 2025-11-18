import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiCreditCard,
  FiTrendingUp,
  FiEye,
  FiTrash2,
  FiX,
  FiNavigation,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft
} from "react-icons/fi";
import { Helmet } from "react-helmet";
import { FaIndianRupeeSign } from "react-icons/fa6";

const FranchiseDrivers = () => {
  const { franchiseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { franchise, franchiseName } = location.state || {};
  
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dummy data for franchise drivers
  const dummyDrivers = [
    {
      _id: "1",
      name: "Rajesh Kumar",
      phone: "+91 9876543210",
      email: "rajesh@example.com",
      driver_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isActive: true,
      total_earning: 22500,
      total_complete_rides: 45,
      etoCard: { eto_id_num: "ETO001" },
      createdAt: "2024-01-15",
      vehicle: "Toyota Etios",
      vehicleNo: "MH01AB1234"
    },
    {
      _id: "2",
      name: "Suresh Patel",
      phone: "+91 9876543211",
      email: "suresh@example.com",
      driver_photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isActive: true,
      total_earning: 16000,
      total_complete_rides: 32,
      etoCard: { eto_id_num: "ETO002" },
      createdAt: "2024-02-20",
      vehicle: "Maruti Dzire",
      vehicleNo: "MH01CD5678"
    },
    {
      _id: "3",
      name: "Amit Sharma",
      phone: "+91 9876543212",
      email: "amit@example.com",
      driver_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      isActive: false,
      total_earning: 14000,
      total_complete_rides: 28,
      etoCard: { eto_id_num: "ETO003" },
      createdAt: "2024-03-10",
      vehicle: "Honda City",
      vehicleNo: "MH01EF9012"
    },
    {
      _id: "4",
      name: "Priya Singh",
      phone: "+91 9876543213",
      email: "priya@example.com",
      driver_photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      isActive: true,
      total_earning: 26000,
      total_complete_rides: 52,
      etoCard: { eto_id_num: "ETO004" },
      createdAt: "2024-01-05",
      vehicle: "Hyundai Verna",
      vehicleNo: "MH01GH3456"
    },
    {
      _id: "5",
      name: "Rahul Verma",
      phone: "+91 9876543214",
      email: "rahul@example.com",
      driver_photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
      isActive: true,
      total_earning: 18000,
      total_complete_rides: 36,
      etoCard: { eto_id_num: "ETO005" },
      createdAt: "2024-02-15",
      vehicle: "Toyota Innova",
      vehicleNo: "MH01IJ7890"
    },
    {
      _id: "6",
      name: "Neha Gupta",
      phone: "+91 9876543215",
      email: "neha@example.com",
      driver_photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      isActive: true,
      total_earning: 29500,
      total_complete_rides: 59,
      etoCard: { eto_id_num: "ETO006" },
      createdAt: "2024-01-20",
      vehicle: "Maruti Swift",
      vehicleNo: "MH01KL1234"
    },
    {
      _id: "7",
      name: "Vikram Joshi",
      phone: "+91 9876543216",
      email: "vikram@example.com",
      driver_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isActive: false,
      total_earning: 12000,
      total_complete_rides: 24,
      etoCard: { eto_id_num: "ETO007" },
      createdAt: "2024-03-25",
      vehicle: "Tata Indica",
      vehicleNo: "MH01MN5678"
    },
    {
      _id: "8",
      name: "Anjali Desai",
      phone: "+91 9876543217",
      email: "anjali@example.com",
      driver_photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      isActive: true,
      total_earning: 21000,
      total_complete_rides: 42,
      etoCard: { eto_id_num: "ETO008" },
      createdAt: "2024-02-10",
      vehicle: "Hyundai i20",
      vehicleNo: "MH01OP9012"
    },
    {
      _id: "9",
      name: "Sanjay Mehta",
      phone: "+91 9876543218",
      email: "sanjay@example.com",
      driver_photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      isActive: true,
      total_earning: 17500,
      total_complete_rides: 35,
      etoCard: { eto_id_num: "ETO009" },
      createdAt: "2024-03-01",
      vehicle: "Maruti Baleno",
      vehicleNo: "MH01QR3456"
    },
    {
      _id: "10",
      name: "Pooja Reddy",
      phone: "+91 9876543219",
      email: "pooja@example.com",
      driver_photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      isActive: true,
      total_earning: 24000,
      total_complete_rides: 48,
      etoCard: { eto_id_num: "ETO010" },
      createdAt: "2024-01-25",
      vehicle: "Honda Amaze",
      vehicleNo: "MH01ST7890"
    },
    {
      _id: "11",
      name: "Mohan Kumar",
      phone: "+91 9876543220",
      email: "mohan@example.com",
      driver_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      isActive: true,
      total_earning: 19500,
      total_complete_rides: 39,
      etoCard: { eto_id_num: "ETO011" },
      createdAt: "2024-02-28",
      vehicle: "Toyota Glanza",
      vehicleNo: "MH01UV1234"
    },
    {
      _id: "12",
      name: "Sunita Iyer",
      phone: "+91 9876543221",
      email: "sunita@example.com",
      driver_photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
      isActive: false,
      total_earning: 8500,
      total_complete_rides: 17,
      etoCard: { eto_id_num: "ETO012" },
      createdAt: "2024-03-20",
      vehicle: "Maruti Wagon R",
      vehicleNo: "MH01WX5678"
    }
  ];

  // Load dummy data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDrivers(dummyDrivers);
      setFilteredDrivers(dummyDrivers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter drivers
  useEffect(() => {
    const timerId = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm, activeFilter, drivers]);

  const applyFilters = useCallback(() => {
    let result = [...drivers];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((driver) => {
        const nameMatch = driver.name?.toLowerCase().includes(term) || false;
        const emailMatch = driver.email?.toLowerCase().includes(term) || false;
        const phoneMatch = driver.phone?.includes(term) || false;
        const etoIdMatch = driver.etoCard?.eto_id_num?.toLowerCase().includes(term) || false;
        const vehicleMatch = driver.vehicle?.toLowerCase().includes(term) || false;

        return nameMatch || emailMatch || phoneMatch || etoIdMatch || vehicleMatch;
      });
    }

    // Apply active status filter
    if (activeFilter !== "all") {
      const isActive = activeFilter === "active";
      result = result.filter((driver) => driver.isActive === isActive);
    }

    setFilteredDrivers(result);
    setCurrentPage(1);
  }, [searchTerm, activeFilter, drivers]);

  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm("Are you sure you want to delete this driver? This action cannot be undone.")) {
      return;
    }
    try {
      setDrivers((prev) => prev.filter((d) => d._id !== driverId));
      setFilteredDrivers((prev) => prev.filter((d) => d._id !== driverId));
    } catch (error) {
      alert("Failed to delete driver. Please try again.");
      console.error(error);
    }
  };
const viewDriverDetails = (driver) => {
  navigate(`/franchise-drivers-details/${driver._id}`, {
    state: { 
      driver: driver,
      franchiseId: franchiseId,
      franchiseName: franchiseName
    }
  });
};

  const handleBack = () => {
    navigate(`/franchise-details/${franchiseId}`, { state: { franchise } });
  };

  // Pagination
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDrivers = filteredDrivers.slice(startIndex, startIndex + itemsPerPage);

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
              <Helmet>
        <title>Admin | Franchise Drivers</title>
      </Helmet>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading drivers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
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
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Drivers - {franchiseName || `Franchise ${franchiseId}`}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage and monitor all drivers associated with this franchise
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Total Drivers</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">{drivers.length}</p>
              </div>
              <FiUser className="text-2xl sm:text-3xl text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Active Drivers</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {drivers.filter(d => d.isActive).length}
                </p>
              </div>
              <FiTrendingUp className="text-2xl sm:text-3xl text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Total Earnings</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  ₹{drivers.reduce((total, driver) => total + (driver.total_earning || 0), 0).toLocaleString()}
                </p>
              </div>
              <FaIndianRupeeSign className="text-2xl sm:text-3xl text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs sm:text-sm">Total Rides</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {drivers.reduce((total, driver) => total + (driver.total_complete_rides || 0), 0)}
                </p>
              </div>
              <FiNavigation className="text-2xl sm:text-3xl text-orange-200" />
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
                  placeholder="Search drivers..."
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
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                <option value="all">All Drivers</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Driver List ({filteredDrivers.length} drivers)
            </h2>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden">
            {currentDrivers.map((driver, index) => (
              <div 
                key={driver._id}
                className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                        src={driver.driver_photo}
                        alt={driver.name}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {driver.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Joined {new Date(driver.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      driver.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-1 ${driver.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {driver.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Phone</div>
                    <div className="text-gray-900 dark:text-white">
                      {driver.phone || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">ETO ID</div>
                    <div className="text-gray-900 dark:text-white">
                      {driver.etoCard?.eto_id_num || '-'}
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Vehicle</div>
                    <div className="text-gray-900 dark:text-white">
                      {driver.vehicle || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Vehicle No</div>
                    <div className="text-gray-900 dark:text-white">
                      {driver.vehicleNo || '-'}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Earnings</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      ₹{driver.total_earning?.toLocaleString() || '0'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Total Rides</div>
                    <div className="text-gray-900 dark:text-white">
                      {driver.total_complete_rides || '0'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => viewDriverDetails(driver)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
                  >
                    <FiEye size={14} className="mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteDriver(driver._id)}
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
                    Driver
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    ETO ID
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Rides
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {currentDrivers.map((driver) => (
                  <tr 
                    key={driver._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    {/* Driver Info */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12">
                          <img
                            className="h-10 w-10 lg:h-12 lg:w-12 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                            src={driver.driver_photo}
                            alt={driver.name}
                          />
                        </div>
                        <div className="ml-3 lg:ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {driver.name}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                            Joined {new Date(driver.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {driver.phone || '-'}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        {driver.email || '-'}
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {driver.vehicle || '-'}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        {driver.vehicleNo || '-'}
                      </div>
                    </td>

                    {/* ETO ID */}
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <FiCreditCard className="mr-2 text-gray-400" />
                        {driver.etoCard?.eto_id_num || '-'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          driver.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mr-1 ${driver.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {driver.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Earnings */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ₹{driver.total_earning?.toLocaleString() || '0'}
                      </div>
                    </td>

                    {/* Rides */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {driver.total_complete_rides || '0'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 lg:px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => viewDriverDetails(driver)}
                          className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
                        >
                          <FiEye size={14} className="mr-1" />
                          View
                        </button>
                       
                        <button
                          onClick={() => handleDeleteDriver(driver._id)}
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
          {filteredDrivers.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4">🚗</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                No drivers found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                {searchTerm || activeFilter !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "No drivers are currently registered in this franchise"}
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
                    {Math.min(startIndex + itemsPerPage, filteredDrivers.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredDrivers.length}</span> results
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

export default FranchiseDrivers;