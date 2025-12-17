import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiFileText,
  FiArrowLeft,
  FiEdit,
  FiNavigation,
  FiShield,
  FiTruck,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";
import { Helmet } from "react-helmet";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { allDriverAPI } from "../../../apis/AllDriver";

const FranchiseDriverDetails = () => {
  const { driverId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { franchiseId, franchiseName } = location.state || {};
  const [driverDetails, setDriverDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch driver details from API
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        setLoading(true);
        const response = await allDriverAPI.getDriverById(driverId);
        console.log(response)

        if (response.success && response.data) {
          const driverData = response.data;

          console.log(driverData);

          // Transform API response to match your component structure
          const transformedData = {
            _id: driverData._id,
            userId: driverData.userId,
            name: driverData.name,
            phone: driverData.phone,
            email: driverData.email,
            driver_photo: driverData.driver_photo,
            isActive: driverData.isActive,
            isApproved: driverData.isApproved,
            is_on_ride: driverData.is_on_ride,
            current_ride_id: driverData.current_ride_id,

            // Location details from API
            village: driverData.village,
            police_station: driverData.police_station,
            landmark: driverData.landmark,
            post_office: driverData.post_office,
            district: driverData.district,
            pin_code: driverData.pin_code,

            // Document details from API
            license_number: driverData.license_number,
            aadhar_front_photo: driverData.aadhar_front_photo,
            aadhar_back_photo: driverData.aadhar_back_photo,
            car_photo: driverData.car_photo || [],

            // Working hours
            login_time: driverData.login_time,
            logout_time: driverData.logout_time,

            // Current location
            current_location: driverData.current_location,

            // Stats from API
            total_earning: driverData.total_earning || 0,
            total_complete_rides: driverData.total_complete_rides || 0,
            total_completed_km: driverData.total_completed_km || 0,
            due_wallet: driverData.due_wallet || 0,
            cash_wallet: driverData.cash_wallet || 0,
            online_wallet: driverData.online_wallet || 0,

            // Placeholder values (could be from separate API calls)
            total_cancelled_rides: 0, // You might want to fetch this separately
            average_rating: 4.5, // You might want to fetch this separately
            createdAt: new Date().toISOString(), // You might want to get this from API
            last_active: new Date().toISOString(), // You might want to track this separately
          };

          setDriverDetails(transformedData);
        } else {
          setError(response.message || "Driver not found");
        }
      } catch (err) {
        console.error("Error fetching driver details:", err);
        setError("Failed to load driver details");
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchDriverDetails();
    }
  }, [driverId]);

  const handleBack = () => {
    navigate(`/franchise-drivers/${franchiseId}`, {
      state: { franchiseId, franchiseName },
    });
  };

  const getStatusBadge = (isActive, isApproved) => {
    if (!isApproved) {
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    }
    if (isActive) {
      return "bg-green-100 text-green-800 border border-green-300";
    }
    return "bg-red-100 text-red-800 border border-red-300";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCoordinates = (location) => {
    if (!location || !location.coordinates) return "N/A";
    const [lat, lng] = location.coordinates;
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading driver details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !driverDetails) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              <FiAlertCircle className="inline" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {error || "Driver Not Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error
                ? "Please try again later."
                : "The driver you're looking for doesn't exist."}
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Drivers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | Franchise Driver Details</title>
      </Helmet>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FiArrowLeft size={20} />
                <span>Back to Drivers</span>
              </button>
              {franchiseName && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Franchise: {franchiseName}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={
                    driverDetails.driver_photo ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                  }
                  alt={driverDetails.name}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face";
                  }}
                />
              </div>
              {/* Online status indicator */}
              {driverDetails.isActive && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {driverDetails.name}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  ID: {driverDetails._id}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                    driverDetails.isActive,
                    driverDetails.isApproved
                  )}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      driverDetails.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  {driverDetails.isActive ? "Active" : "Inactive"}
                </span>
                {driverDetails.isApproved ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
                    <FiShield size={14} className="mr-1" />
                    Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                    <FiAlertCircle size={14} className="mr-1" />
                    Pending Approval
                  </span>
                )}
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  User ID: {driverDetails.userId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ₹{driverDetails.total_earning?.toLocaleString() || "0"}
                </p>
              </div>
              <FaIndianRupeeSign className="text-2xl text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Rides
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {driverDetails.total_complete_rides || "0"}
                </p>
              </div>
              <FiNavigation className="text-2xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Distance Covered
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {driverDetails.total_completed_km?.toFixed(2) || "0"} km
                </p>
              </div>
              <FiTruck className="text-2xl text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Due Wallet
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ₹{driverDetails.due_wallet?.toLocaleString() || "0"}
                </p>
              </div>
              <FiCreditCard className="text-2xl text-orange-500" />
            </div>
          </div>
        </div>

        {/* Additional Wallet Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Cash Wallet
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ₹{driverDetails.cash_wallet?.toLocaleString() || "0"}
                </p>
              </div>
              <FaIndianRupeeSign className="text-2xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Online Wallet
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ₹{driverDetails.online_wallet?.toLocaleString() || "0"}
                </p>
              </div>
              <FiCreditCard className="text-2xl text-green-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <FiUser className="text-blue-600" />
                <span>Basic Information</span>
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {driverDetails.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                      <FiMail className="text-gray-400" size={16} />
                      <span>{driverDetails.email}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Contact Number
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                    <FiPhone className="text-gray-400" size={16} />
                    <span>{driverDetails.phone}</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Member Since
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formatDate(driverDetails.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Last Active
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {driverDetails.last_active
                        ? formatDateTime(driverDetails.last_active)
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Login Time
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                      <FiClock className="text-gray-400" size={14} />
                      <span>{driverDetails.login_time || "N/A"}</span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Logout Time
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                      <FiClock className="text-gray-400" size={14} />
                      <span>{driverDetails.logout_time || "N/A"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <FiMapPin className="text-purple-600" />
                <span>Location Information</span>
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Village
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {driverDetails.village || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Police Station
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {driverDetails.police_station || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Landmark
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {driverDetails.landmark || "N/A"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Post Office
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {driverDetails.post_office || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      District
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {driverDetails.district || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      PIN Code
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {driverDetails.pin_code || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Current Location
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium text-sm">
                      {formatCoordinates(driverDetails.current_location)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Documents Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <FiFileText className="text-red-600" />
                <span>Document Details</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Driving License
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {driverDetails.license_number || "N/A"}
                  </p>
                </div>

                {/* Document Photos */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Document Photos
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {driverDetails.aadhar_front_photo && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Aadhar Front
                        </p>
                        <img
                          src={driverDetails.aadhar_front_photo}
                          alt="Aadhar Front"
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=Aadhar+Front";
                          }}
                        />
                      </div>
                    )}
                    {driverDetails.aadhar_back_photo && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Aadhar Back
                        </p>
                        <img
                          src={driverDetails.aadhar_back_photo}
                          alt="Aadhar Back"
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=Aadhar+Back";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Car Photos */}
                {driverDetails.car_photo &&
                  driverDetails.car_photo.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Car Photos
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {driverDetails.car_photo.map((photo, index) => (
                          <div key={index}>
                            <p className="text-xs text-gray-500 mb-1">
                              Car Photo {index + 1}
                            </p>
                            <img
                              src={photo}
                              alt={`Car ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/300x200?text=Car+Photo";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Driver Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <FiShield className="text-green-600" />
                <span>Driver Status</span>
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Approval Status
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        driverDetails.isApproved
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      }`}
                    >
                      {driverDetails.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Activity Status
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        driverDetails.isActive
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      {driverDetails.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      On Ride
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        driverDetails.is_on_ride
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-gray-100 text-gray-800 border border-gray-300"
                      }`}
                    >
                      {driverDetails.is_on_ride ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Current Ride ID
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium text-sm truncate">
                      {driverDetails.current_ride_id || "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchiseDriverDetails;
