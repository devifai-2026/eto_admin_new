import React, { useEffect, useState } from 'react';
import { driverVerificationAPI } from '../../apis/DriverVerification';
import { 
  FiUser, 
  FiClock, 
  FiXCircle, 
  FiCheckCircle, 
  FiMessageCircle,
  FiTrash2,
  FiEye,
  FiArrowLeft,
  FiPhone,
  FiCreditCard,
  FiTruck,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import { Helmet } from 'react-helmet';

const DriverVerification = () => {
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);
  const [newDrivers, setNewDrivers] = useState([]);
  const [rejectedDrivers, setRejectedDrivers] = useState([]);
  const [activeTab, setActiveTab] = useState("new");
  const [loading, setLoading] = useState({});
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDriverForReject, setSelectedDriverForReject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const ADMIN_ID = "683c1f9d95518b0e2d0e71d0";

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(prev => ({ ...prev, fetch: true }));
      
      const [newResponse, rejectedResponse] = await Promise.all([
        driverVerificationAPI.getNewDrivers(),
        driverVerificationAPI.getRejectedDrivers()
      ]);

      setNewDrivers(newResponse.data.drivers || []);
      setRejectedDrivers(rejectedResponse.data.drivers || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      alert("Failed to fetch drivers. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, fetch: false }));
    }
  };

  const handleApprove = async (driver) => {
    const driverId = driver._id;

    setLoading(prev => ({ ...prev, [driverId]: "approve" }));

    try {
      await driverVerificationAPI.approveDriver(ADMIN_ID, driverId);

      setNewDrivers(prev => prev.filter(d => d._id !== driverId));
      setRejectedDrivers(prev => prev.filter(d => d._id !== driverId));
    } catch (error) {
      console.error(`Error approving driver ${driver.name}:`, error);
      alert("Failed to approve driver. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, [driverId]: null }));
    }
  };

  const handleReject = (driver) => {
    setSelectedDriverForReject(driver);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedDriverForReject || !rejectionReason.trim()) return;

    const driverId = selectedDriverForReject._id;

    setLoading(prev => ({ ...prev, [driverId]: "reject" }));

    try {
      await driverVerificationAPI.rejectDriver(ADMIN_ID, driverId, rejectionReason);

      setNewDrivers(prev => prev.filter(d => d._id !== driverId));
      setRejectedDrivers(prev => [...prev, {
        ...selectedDriverForReject,
        rejectionReason,
        rejectedAt: new Date().toISOString()
      }]);

      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedDriverForReject(null);
    } catch (error) {
      console.error(`Error rejecting driver ${selectedDriverForReject.name}:`, error);
      alert("Failed to reject driver. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, [driverId]: null }));
    }
  };

  const handleDelete = async (driver) => {
    const driverId = driver._id;

    if (!window.confirm(`Are you sure you want to delete ${driver.name}? This action cannot be undone.`)) {
      return;
    }

    setLoading(prev => ({ ...prev, [driverId]: "delete" }));

    try {
      await driverVerificationAPI.deleteDriver(driverId);

      setRejectedDrivers(prev => prev.filter(d => d._id !== driverId));
    } catch (error) {
      console.error(`Error deleting driver ${driver.name}:`, error);
      alert("Failed to delete driver. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, [driverId]: null }));
    }
  };

  const handleWhatsApp = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleViewProfile = (user) => {
    setSelectedUserData(user);
    setToggleModal(true);
  };

  const filteredDrivers = (activeTab === "new" ? newDrivers : rejectedDrivers).filter(driver =>
    driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone?.includes(searchTerm) ||
    driver.aadhar_number?.includes(searchTerm) ||
    driver.vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LoadingSpinner = ({ size = 4 }) => (
    <div className={`animate-spin rounded-full h-${size} w-${size} border-2 border-white border-t-transparent`}></div>
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Helmet>
              <title>Admin | Driver Verification</title>
            </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiUser className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Driver Verification
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and verify driver registrations
                </p>
              </div>
            </div>
            <button
              onClick={fetchDrivers}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft size={16} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search drivers by name, phone, Aadhar, or vehicle..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <FiFilter size={16} />
                <span>Filter:</span>
                <span className="font-medium">{filteredDrivers.length} drivers</span>
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
                <p className="text-2xl font-bold mt-1">
                  {newDrivers.length + rejectedDrivers.length}
                </p>
              </div>
              <FiUser className="text-2xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pending Verification</p>
                <p className="text-2xl font-bold mt-1">
                  {newDrivers.length}
                </p>
              </div>
              <FiClock className="text-2xl text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Rejected Drivers</p>
                <p className="text-2xl font-bold mt-1">
                  {rejectedDrivers.length}
                </p>
              </div>
              <FiXCircle className="text-2xl text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Verified Today</p>
                <p className="text-2xl font-bold mt-1">
                  0
                </p>
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
                onClick={() => setActiveTab("new")}
              >
                <FiUser size={16} />
                <span>New Registrations</span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                  {newDrivers.length}
                </span>
              </button>
              <button
                className={`flex items-center space-x-2 py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "rejected" 
                    ? "text-blue-600 border-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                    : "text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("rejected")}
              >
                <FiXCircle size={16} />
                <span>Rejected Drivers</span>
                <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                  {rejectedDrivers.length}
                </span>
              </button>
            </div>
          </div>

          {/* Drivers List */}
          <div className="p-6">
            {loading.fetch ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading drivers...</p>
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
                          e.target.src = "https://via.placeholder.com/56?text=Driver";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                            {user.name}
                          </h5>
                          {activeTab === "rejected" && (
                            <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                              Rejected
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <FiPhone size={14} />
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiCreditCard size={14} />
                            <span className="font-mono">{user.aadhar_number}</span>
                          </div>
                          {user.vehicle_number && (
                            <div className="flex items-center space-x-1">
                              <FiTruck size={14} />
                              <span className="font-mono">{user.vehicle_number}</span>
                            </div>
                          )}
                        </div>
                        {activeTab === "rejected" && user.rejectionReason && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                            <span className="font-medium">Reason:</span> {user.rejectionReason}
                          </p>
                        )}
                        {activeTab === "rejected" && user.rejectedAt && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Rejected on: {new Date(user.rejectedAt).toLocaleDateString()}
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
                          <button
                            onClick={() => handleApprove(user)}
                            disabled={!!loading[user._id]}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-w-[100px]"
                          >
                            {loading[user._id] === "approve" ? (
                              <LoadingSpinner />
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
                        <>
                          <button
                            onClick={() => handleWhatsApp(user.phone)}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                          >
                            <FiMessageCircle size={16} />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={!!loading[user._id]}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-w-[100px]"
                          >
                            {loading[user._id] === "delete" ? (
                              <LoadingSpinner />
                            ) : (
                              <FiTrash2 size={16} />
                            )}
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No {activeTab === "new" ? "pending" : "rejected"} drivers found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm 
                    ? "No drivers match your search criteria." 
                    : activeTab === "new" 
                      ? "All drivers have been processed." 
                      : "No drivers have been rejected yet."}
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
                  <FiXCircle className="text-red-600 dark:text-red-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Reject Driver
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {selectedDriverForReject.name}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rejection Reason
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
                  disabled={!rejectionReason.trim() || !!loading[selectedDriverForReject._id]}
                >
                  {loading[selectedDriverForReject._id] === "reject" ? (
                    <LoadingSpinner />
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
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FiUser className="text-blue-600 dark:text-blue-400" size={24} />
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
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FiUser className="text-gray-600 dark:text-gray-400 flex-shrink-0" size={18} />
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Full Name
                      </label>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {selectedUserData.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FiPhone className="text-gray-600 dark:text-gray-400 flex-shrink-0" size={18} />
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Phone Number
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedUserData.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FiCreditCard className="text-gray-600 dark:text-gray-400 flex-shrink-0" size={18} />
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Aadhar Number
                      </label>
                      <p className="text-gray-900 dark:text-white font-mono">
                        {selectedUserData.aadhar_number}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {selectedUserData.vehicle_number && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <FiTruck className="text-gray-600 dark:text-gray-400 flex-shrink-0" size={18} />
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Vehicle Number
                        </label>
                        <p className="text-gray-900 dark:text-white font-mono">
                          {selectedUserData.vehicle_number}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Driver Photo
                    </label>
                    <img
                      src={selectedUserData.driver_photo || "/default-avatar.png"}
                      alt={selectedUserData.name}
                      className="h-32 w-32 rounded-lg object-cover border border-gray-300 dark:border-gray-600 mx-auto"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/128?text=Driver";
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {activeTab === "rejected" && selectedUserData.rejectionReason && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiXCircle className="text-red-600 dark:text-red-400" size={16} />
                    <label className="block text-sm font-medium text-red-600 dark:text-red-400">
                      Rejection Reason
                    </label>
                  </div>
                  <p className="text-red-700 dark:text-red-300">
                    {selectedUserData.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverVerification;