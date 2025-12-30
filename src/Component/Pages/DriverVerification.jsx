import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { driverVerificationAPI } from "../../apis/DriverVerification";
import {
  FiUser,
  FiClock,
  FiXCircle,
  FiCheckCircle,
  FiMessageCircle,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiBriefcase,
  FiUsers,
  FiRefreshCw,
  FiArrowLeft,
  FiPhone,
  FiCreditCard,
  FiAlertCircle,
  FiMail,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import { Helmet } from "react-helmet";
import Breadcrumbs from "../../Component/Breadcrumbs/BreadCrumbs";
import toto from "../../assets/sidebar/toto.jpg";
import loginAPI from "../../apis/Login";

const DriverVerification = () => {
  const navigate = useNavigate();
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);
  const [newDrivers, setNewDrivers] = useState([]);
  const [rejectedDrivers, setRejectedDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [activeTab, setActiveTab] = useState("new");
  const [loading, setLoading] = useState({ fetch: false });
  const [error, setError] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDriverForReject, setSelectedDriverForReject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    rejected: 0,
    verifiedToday: 0,
  });

  // Get current user information
  const getCurrentUserInfo = useCallback(() => {
    try {
      const user = loginAPI.getCurrentUser();
      const userType = loginAPI.getUserType();

      console.log("Current user info:", { user, userType });

      return {
        user,
        userType,
        userId: user?._id || user?.userId || user?.id,
        franchiseId: user?.franchiseId || user?._id,
      };
    } catch (error) {
      console.error("Error getting user info:", error);
      return { user: null, userType: "", userId: null, franchiseId: null };
    }
  }, []);

  // Fetch drivers data
  const fetchDrivers = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, fetch: true }));
      setError(null);

      // Get current user information
      const { userType, userId, franchiseId } = getCurrentUserInfo();

      // Prepare query parameters based on user type
      const apiParams = {};

      if (userType === "admin" && userId) {
        apiParams.adminId = userId;
        console.log("Fetching as ADMIN with ID:", userId);
      } else if (userType === "franchise" && franchiseId) {
        apiParams.franchiseId = franchiseId;
        console.log("Fetching as FRANCHISE with ID:", franchiseId);
      } else {
        console.warn("Invalid user type or missing IDs:", { userType, userId, franchiseId });
        setError("Please login to access driver verification");
        return;
      }

      // Fetch both new and rejected drivers in parallel
      const [newResponse, rejectedResponse] = await Promise.all([
        driverVerificationAPI.getNewDrivers(apiParams),
        driverVerificationAPI.getRejectedDrivers(apiParams),
      ]);

      console.log("New drivers response:", newResponse);
      console.log("Rejected drivers response:", rejectedResponse);

      // Update state with fetched data
      const newDriversData = newResponse.data?.drivers || [];
      const rejectedDriversData = rejectedResponse.data?.drivers || [];

      setNewDrivers(newDriversData);
      setRejectedDrivers(rejectedDriversData);

      // Apply search filter if exists
      applyFilters(searchTerm, newDriversData, rejectedDriversData);

      // Update statistics
      setStats({
        total: newDriversData.length + rejectedDriversData.length,
        new: newDriversData.length,
        rejected: rejectedDriversData.length,
        verifiedToday: 0,
      });
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError(err.message || "Failed to load drivers");
      setNewDrivers([]);
      setRejectedDrivers([]);
      setFilteredDrivers([]);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, [getCurrentUserInfo, searchTerm]);

  // Apply filters to drivers
  const applyFilters = useCallback((searchTerm, newDriversData, rejectedDriversData) => {
    const driversToFilter = activeTab === "new" ? newDriversData : rejectedDriversData;
    
    if (!searchTerm.trim()) {
      setFilteredDrivers(driversToFilter);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = driversToFilter.filter((driver) => {
      const nameMatch = driver.name?.toLowerCase().includes(term) || false;
      const phoneMatch = driver.phone?.includes(term) || false;
      const emailMatch = driver.email?.toLowerCase().includes(term) || false;
      const licenseMatch = driver.license_number?.toLowerCase().includes(term) || false;
      const aadharMatch = driver.aadhar_number?.includes(term) || false;
      const franchiseMatch = driver.franchise?.name?.toLowerCase().includes(term) || false;

      return nameMatch || phoneMatch || emailMatch || licenseMatch || aadharMatch || franchiseMatch;
    });

    setFilteredDrivers(filtered);
  }, [activeTab]);

  // Initial fetch
  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Apply filters when search term or active tab changes
  useEffect(() => {
    applyFilters(searchTerm, newDrivers, rejectedDrivers);
  }, [searchTerm, activeTab, newDrivers, rejectedDrivers, applyFilters]);

  // Handle approve driver
  const handleApprove = async (driver) => {
    const driverId = driver._id;

    // Get current user info for authorization check
    const { userType, userId, franchiseId } = getCurrentUserInfo();

    // Check authorization for franchise users
    if (userType === "franchise") {
      const driverFranchiseId = driver.franchise?._id;
      if (driverFranchiseId !== franchiseId) {
        alert("You can only approve drivers assigned to your franchise");
        return;
      }
    }

    setLoading((prev) => ({ ...prev, [driverId]: "approve" }));

    try {
      // Prepare request body based on user type
      const requestBody = { driverId };

      if (userType === "admin" && userId) {
        requestBody.adminId = userId;
      } else if (userType === "franchise" && franchiseId) {
        requestBody.franchiseId = franchiseId;
        requestBody.adminId = userId; // Still need adminId for Khata
      }

      console.log("Approving driver with body:", requestBody);

      const response = await driverVerificationAPI.approveDriver(requestBody);

      // Remove driver from new drivers list
      setNewDrivers((prev) => prev.filter((d) => d._id !== driverId));
      
      // Update stats
      setStats((prev) => ({
        ...prev,
        new: prev.new - 1,
        total: prev.total - 1,
      }));

      // Update filtered drivers
      applyFilters(searchTerm, newDrivers.filter(d => d._id !== driverId), rejectedDrivers);

      alert(`Driver ${driver.name} approved successfully!`);
      console.log("Approve response:", response);
    } catch (error) {
      console.error(`Error approving driver ${driver.name}:`, error);
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          "Failed to approve driver";
      alert(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, [driverId]: null }));
    }
  };

  // Handle reject driver
  const handleReject = (driver) => {
    // Get current user info for authorization check
    const { userType, franchiseId } = getCurrentUserInfo();

    // Check authorization for franchise users
    if (userType === "franchise") {
      const driverFranchiseId = driver.franchise?._id;
      if (driverFranchiseId !== franchiseId) {
        alert("You can only reject drivers assigned to your franchise");
        return;
      }
    }

    setSelectedDriverForReject(driver);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedDriverForReject || !rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    const driverId = selectedDriverForReject._id;
    const { userType, userId, franchiseId } = getCurrentUserInfo();

    setLoading((prev) => ({ ...prev, [driverId]: "reject" }));

    try {
      // Prepare request body
      const requestBody = {
        driverId,
        rejectionReason,
      };

      if (userType === "admin" && userId) {
        requestBody.adminId = userId;
      } else if (userType === "franchise" && franchiseId) {
        requestBody.franchiseId = franchiseId;
        requestBody.adminId = userId;
      }

      console.log("Rejecting driver with body:", requestBody);

      const response = await driverVerificationAPI.rejectDriver(requestBody);

      // Remove from new drivers and add to rejected
      const updatedNewDrivers = newDrivers.filter((d) => d._id !== driverId);
      const newRejectedDriver = {
        ...selectedDriverForReject,
        rejectionReason,
        rejectedAt: new Date().toISOString(),
        rejectedBy: userType,
      };

      setNewDrivers(updatedNewDrivers);
      setRejectedDrivers((prev) => [...prev, newRejectedDriver]);

      // Update stats
      setStats((prev) => ({
        ...prev,
        new: prev.new - 1,
        rejected: prev.rejected + 1,
      }));

      // Update filtered drivers
      applyFilters(searchTerm, updatedNewDrivers, [...rejectedDrivers, newRejectedDriver]);

      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedDriverForReject(null);

      alert(`Driver ${selectedDriverForReject.name} rejected successfully!`);
      console.log("Reject response:", response);
    } catch (error) {
      console.error(`Error rejecting driver ${selectedDriverForReject.name}:`, error);
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          "Failed to reject driver";
      alert(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, [driverId]: null }));
    }
  };

  // Handle delete driver
  const handleDelete = async (driver) => {
    const driverId = driver._id;

    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${driver.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoading((prev) => ({ ...prev, [driverId]: "delete" }));

    try {
      await driverVerificationAPI.deleteDriver(driverId);

      // Remove from rejected drivers
      const updatedRejectedDrivers = rejectedDrivers.filter((d) => d._id !== driverId);
      setRejectedDrivers(updatedRejectedDrivers);

      // Update stats
      setStats((prev) => ({
        ...prev,
        rejected: prev.rejected - 1,
        total: prev.total - 1,
      }));

      // Update filtered drivers
      applyFilters(searchTerm, newDrivers, updatedRejectedDrivers);

      alert(`Driver ${driver.name} deleted successfully!`);
    } catch (error) {
      console.error(`Error deleting driver ${driver.name}:`, error);
      const errorMessage = error.response?.data?.message ||
                          "Failed to delete driver";
      alert(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, [driverId]: null }));
    }
  };

  // Handle WhatsApp
  const handleWhatsApp = (phone) => {
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/+91${cleanPhone}`, "_blank");
  };

  // Handle view profile
  const handleViewProfile = (user) => {
    setSelectedUserData(user);
    setToggleModal(true);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilteredDrivers(tab === "new" ? newDrivers : rejectedDrivers);
  };

  // Loading spinner component
  const LoadingSpinner = ({ size = 4 }) => (
    <div
      className={`animate-spin rounded-full h-${size} w-${size} border-2 border-white border-t-transparent`}
    ></div>
  );

  // Get user type for display
  const { userType } = getCurrentUserInfo();
  const isAdminUser = userType === "admin";

  if (error && !loading.fetch) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center h-64">
          <FiAlertCircle className="text-4xl text-red-500 mb-4" />
          <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
          <button
            onClick={fetchDrivers}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>{isAdminUser ? "Admin" : "Franchise"} | Driver Verification</title>
      </Helmet>
      <Breadcrumbs />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 ${
                  isAdminUser
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "bg-green-100 dark:bg-green-900"
                } rounded-lg`}
              >
                {isAdminUser ? (
                  <FiUser className="text-2xl text-blue-600 dark:text-blue-400" />
                ) : (
                  <FiBriefcase className="text-2xl text-green-600 dark:text-green-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {isAdminUser ? "Admin" : "Franchise"} - Driver Verification
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {isAdminUser
                    ? "Manage and verify all driver registrations"
                    : "Verify drivers assigned to your franchise"}
                </p>
              </div>
            </div>
            <button
              onClick={fetchDrivers}
              disabled={loading.fetch}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading.fetch ? (
                <LoadingSpinner size={4} />
              ) : (
                <FiRefreshCw size={16} />
              )}
              <span>Refresh</span>
            </button>
          </div>

          {/* User Type Badge */}
          <div className="mb-4">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full ${
                isAdminUser
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              }`}
            >
              {isAdminUser ? (
                <>
                  <FiUser size={16} className="mr-2" />
                  <span className="font-medium">Admin Mode</span>
                </>
              ) : (
                <>
                  <FiBriefcase size={16} className="mr-2" />
                  <span className="font-medium">Franchise Mode</span>
                </>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search drivers by name, phone, email, license, or franchise..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading.fetch}
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <FiFilter size={16} />
                <span>Filter:</span>
                <span className="font-medium">
                  {filteredDrivers.length} of {activeTab === "new" ? stats.new : stats.rejected} drivers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Drivers</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <FiUsers className="text-2xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pending Verification</p>
                <p className="text-2xl font-bold mt-1">{stats.new}</p>
              </div>
              <FiClock className="text-2xl text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Rejected Drivers</p>
                <p className="text-2xl font-bold mt-1">{stats.rejected}</p>
              </div>
              <FiXCircle className="text-2xl text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Verified Today</p>
                <p className="text-2xl font-bold mt-1">{stats.verifiedToday}</p>
              </div>
              <FiCheckCircle className="text-2xl text-green-200" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap">
              <button
                className={`flex items-center space-x-2 py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "new"
                    ? "text-blue-600 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => handleTabChange("new")}
              >
                <FiUser size={16} />
                <span>New Registrations</span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                  {stats.new}
                </span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "rejected"
                    ? "text-blue-600 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => handleTabChange("rejected")}
              >
                <FiXCircle size={16} />
                <span>Rejected Drivers</span>
                <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                  {stats.rejected}
                </span>
              </button>
            </div>
          </div>

          {/* Drivers List */}
          <div className="p-6">
            {loading.fetch ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading drivers...
                </p>
              </div>
            ) : filteredDrivers.length > 0 ? (
              <div className="grid gap-4">
                {filteredDrivers.map((user, key) => (
                  <div
                    className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    key={key}
                  >
                    {/* User Info */}
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <img
                        src={user.driver_photo || "/default-avatar.png"}
                        alt={user.name}
                        className="h-14 w-14 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/56?text=Driver";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                            {user.name}
                          </h5>
                          {activeTab === "rejected" ? (
                            <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                              Rejected
                            </span>
                          ) : user.franchise ? (
                            <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                              {user.franchise.name}
                            </span>
                          ) : (
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                              No Franchise
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <FiPhone size={14} />
                            <span>{user.phone}</span>
                          </div>
                          {user.email && (
                            <div className="flex items-center space-x-1">
                              <FiMail size={14} />
                              <span>{user.email}</span>
                            </div>
                          )}
                          {user.license_number && (
                            <div className="flex items-center space-x-1">
                              <FiCreditCard size={14} />
                              <span className="font-mono">
                                {user.license_number}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <FiCalendar size={14} />
                            <span>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {activeTab === "rejected" && user.rejectionReason && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                            <span className="font-medium">Reason:</span>{" "}
                            {user.rejectionReason}
                          </p>
                        )}
                        {activeTab === "rejected" && user.rejectedAt && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Rejected on:{" "}
                            {new Date(user.rejectedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                      <button
                        onClick={() => handleViewProfile(user)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                      >
                        <FiEye size={16} />
                        <span>View</span>
                      </button>

                      {activeTab === "new" ? (
                        <>
                          {/* Check if user is authorized to approve/reject */}
                          {isAdminUser || (!isAdminUser && user.franchise?._id === getCurrentUserInfo().franchiseId) ? (
                            <>
                              <button
                                onClick={() => handleApprove(user)}
                                disabled={!!loading[user._id]}
                                className={`flex items-center justify-center space-x-2 px-4 py-2 ${
                                  isAdminUser
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-green-600 hover:bg-green-700"
                                } text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-w-[100px]`}
                              >
                                {loading[user._id] === "approve" ? (
                                  <LoadingSpinner size={4} />
                                ) : (
                                  <FiCheckCircle size={16} />
                                )}
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => handleReject(user)}
                                disabled={!!loading[user._id]}
                                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-w-[100px]"
                              >
                                <FiXCircle size={16} />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 italic">
                              Not authorized
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleWhatsApp(user.phone)}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                          >
                            <FiMessageCircle size={16} />
                            <span>WhatsApp</span>
                          </button>
                          {isAdminUser && (
                            <button
                              onClick={() => handleDelete(user)}
                              disabled={!!loading[user._id]}
                              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-w-[100px]"
                            >
                              {loading[user._id] === "delete" ? (
                                <LoadingSpinner size={4} />
                              ) : (
                                <FiTrash2 size={16} />
                              )}
                              <span>Delete</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  <img
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full mx-auto"
                    src={toto}
                    alt="Toto"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No {activeTab === "new" ? "pending" : "rejected"} drivers found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm
                    ? "No drivers match your search criteria."
                    : isAdminUser
                    ? "All drivers have been processed."
                    : "No drivers are assigned to your franchise for verification."}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Confirmation Modal */}
      {showRejectModal && selectedDriverForReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <FiXCircle
                    className="text-red-600 dark:text-red-400"
                    size={20}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Reject Driver
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {selectedDriverForReject.name}
                  </p>
                  {!isAdminUser && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      (Rejecting as Franchise)
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Please provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setSelectedDriverForReject(null);
                  }}
                >
                  <span>Cancel</span>
                </button>
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={confirmReject}
                  disabled={
                    !rejectionReason.trim() ||
                    !!loading[selectedDriverForReject._id]
                  }
                >
                  {loading[selectedDriverForReject._id] === "reject" ? (
                    <LoadingSpinner size={4} />
                  ) : (
                    <FiXCircle size={16} />
                  )}
                  <span>Confirm Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {toggleModal && selectedUserData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 ${
                      selectedUserData.franchise
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-blue-100 dark:bg-blue-900"
                    } rounded-lg`}
                  >
                    {selectedUserData.franchise ? (
                      <FiBriefcase
                        className="text-green-600 dark:text-green-400"
                        size={24}
                      />
                    ) : (
                      <FiUser
                        className="text-blue-600 dark:text-blue-400"
                        size={24}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Driver Profile
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {selectedUserData.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setToggleModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2"
                >
                  <FiXCircle size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FiUser className="text-gray-400 mr-3" size={18} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedUserData.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Full Name
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FiPhone className="text-gray-400 mr-3" size={18} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedUserData.phone}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Phone Number
                          </p>
                        </div>
                      </div>
                      {selectedUserData.email && (
                        <div className="flex items-center">
                          <FiMail className="text-gray-400 mr-3" size={18} />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedUserData.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Email Address
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedUserData.pin_code && (
                        <div className="flex items-center">
                          <FiMapPin className="text-gray-400 mr-3" size={18} />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedUserData.pin_code}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PIN Code
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Driver Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Driver Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FiCreditCard className="text-gray-400 mr-3" size={18} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedUserData.license_number}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            License Number
                          </p>
                        </div>
                      </div>
                      {selectedUserData.aadhar_number && (
                        <div className="flex items-center">
                          <FiCreditCard className="text-gray-400 mr-3" size={18} />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedUserData.aadhar_number}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Aadhar Number
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center">
                        <FiCalendar className="text-gray-400 mr-3" size={18} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(selectedUserData.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Registration Date
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-3">
                          <span className={`inline-block w-3 h-3 rounded-full ${selectedUserData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${selectedUserData.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {selectedUserData.isActive ? 'Active' : 'Inactive'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Status
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                {(selectedUserData.village || selectedUserData.district || selectedUserData.landmark) && (
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Address Information
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedUserData.village && (
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Village</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedUserData.village}
                              </p>
                            </div>
                          )}
                          {selectedUserData.district && (
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">District</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedUserData.district}
                              </p>
                            </div>
                          )}
                          {selectedUserData.police_station && (
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Police Station</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedUserData.police_station}
                              </p>
                            </div>
                          )}
                          {selectedUserData.post_office && (
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Post Office</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedUserData.post_office}
                              </p>
                            </div>
                          )}
                          {selectedUserData.landmark && (
                            <div className="md:col-span-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Landmark</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedUserData.landmark}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Franchise Information */}
                {selectedUserData.franchise && (
                  <div className="md:col-span-2 space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                        Assigned Franchise
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Franchise Name
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedUserData.franchise.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Phone
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedUserData.franchise.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Email
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedUserData.franchise.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Photos Section */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Photos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedUserData.driver_photo && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Driver Photo
                        </p>
                        <img
                          src={selectedUserData.driver_photo}
                          alt="Driver"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200?text=Driver+Photo";
                          }}
                        />
                      </div>
                    )}
                    {selectedUserData.car_photo && selectedUserData.car_photo.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Car Photos ({selectedUserData.car_photo.length})
                        </p>
                        <div className="space-y-2">
                          {selectedUserData.car_photo.slice(0, 2).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Car ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/300x150?text=Car+Photo";
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {(selectedUserData.aadhar_front_photo || selectedUserData.aadhar_back_photo) && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Aadhar Documents
                        </p>
                        <div className="space-y-2">
                          {selectedUserData.aadhar_front_photo && (
                            <img
                              src={selectedUserData.aadhar_front_photo}
                              alt="Aadhar Front"
                              className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/300x150?text=Aadhar+Front";
                              }}
                            />
                          )}
                          {selectedUserData.aadhar_back_photo && (
                            <img
                              src={selectedUserData.aadhar_back_photo}
                              alt="Aadhar Back"
                              className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/300x150?text=Aadhar+Back";
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setToggleModal(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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

export default DriverVerification;