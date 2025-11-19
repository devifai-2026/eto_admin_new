import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { rideHistoryAPI } from "../../apis/RideHistory";
import {
  MdArrowBack,
  MdLocationOn,
  MdPerson,
  MdPayment,
  MdCalendarToday,
  MdDirectionsCar,
  MdAttachMoney,
} from "react-icons/md";
import {
  FiUser,
  FiPhone,
  FiMapPin,

  FiCalendar,
  FiClock,
  FiNavigation,
} from "react-icons/fi";
import Breadcrumbs from "../Breadcrumbs/BreadCrumbs";
import { Helmet } from "react-helmet";
import { FaIndianRupeeSign } from "react-icons/fa6";

const RideHistoryDetails = () => {
  const { rideHistoryId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");

  useEffect(() => {
    if (rideHistoryId) {
      fetchRideDetails();
    }
  }, [rideHistoryId]);

  const fetchRideDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching ride details for ID:", rideHistoryId);

      const foundRide = await rideHistoryAPI.getRideById(rideHistoryId);

      if (foundRide) {
        console.log("Found ride:", foundRide);
        setRide(foundRide);

        // Fetch addresses if coordinates exist
        if (foundRide.pickup_location?.coordinates) {
          const address = await rideHistoryAPI.getAddressFromCoordinates(
            foundRide.pickup_location.coordinates
          );
          setPickupAddress(address);
        } else {
          setPickupAddress("Location not available");
        }

        if (foundRide.drop_location?.coordinates) {
          const address = await rideHistoryAPI.getAddressFromCoordinates(
            foundRide.drop_location.coordinates
          );
          setDropAddress(address);
        } else {
          setDropAddress("Location not available");
        }
      } else {
        setError(`Ride with ID ${rideHistoryId} not found in the ride history`);
      }
    } catch (error) {
      console.error("Error fetching ride details:", error);
      setError(
        `Error loading ride details: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not Available";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Not Available";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      return "Invalid Time";
    }
  };

  const calculateRideDuration = () => {
    if (!ride.started_time || !ride.ride_end_time) return "Not available";

    try {
      const start = new Date(ride.started_time);
      const end = new Date(ride.ride_end_time);
      const diff = Math.abs(end - start) / 60000; // minutes

      if (diff < 60) {
        return `${Math.floor(diff)} minutes`;
      } else {
        const hours = Math.floor(diff / 60);
        const minutes = Math.floor(diff % 60);
        return `${hours}h ${minutes}m`;
      }
    } catch (error) {
      return "Invalid duration";
    }
  };

  const getPaymentStatusBadge = (isPaid) => {
    return isPaid
      ? "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
      : "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700";
  };

  const getPaymentModeBadge = (paymentMode) => {
    const styles = {
      online:
        "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700",
      cash: "bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
    };
    return (
      styles[paymentMode?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="ml-4 text-lg text-gray-600 dark:text-gray-300">
            Loading ride details...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Details
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
            {error}
          </p>
          <div className="space-x-4">
            <button
              onClick={fetchRideDetails}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/ride-history")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Ride History
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No ride found state
  if (!ride) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ride Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The requested ride could not be found in the ride history.
          </p>
          <button
            onClick={() => navigate("/ride-history")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Ride History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | Ride History Details</title>
      </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/ride-history")}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Back to Ride History"
            >
              <MdArrowBack
                size={24}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Ride Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                Ride ID: {ride._id || rideHistoryId}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 inline-flex items-center rounded-full text-sm font-medium ${getPaymentStatusBadge(
                ride.isPayment_done
              )}`}
            >
              {ride.isPayment_done ? "Paid" : "Unpaid"}
            </span>
            <span
              className={`px-3 py-1 inline-flex items-center rounded-full text-sm font-medium ${getPaymentModeBadge(
                ride.payment_mode
              )}`}
            >
              {ride.payment_mode ? ride.payment_mode.toUpperCase() : "N/A"}
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
              {formatDateTime(ride.createdAt)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="xl:col-span-2 space-y-6">
            {/* Driver & Passenger Info Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Driver Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MdPerson className="mr-2" />
                  Driver Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                      {ride.driverId?.driver_photo ? (
                        <img
                          src={ride.driverId.driver_photo}
                          alt={ride.driverId.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <FiUser size={24} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        {ride.driverId?.name || "No Name"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {ride.driverId?.eto_id_num || "No ETO ID"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <FiPhone className="mr-2 text-gray-400" size={16} />
                      <span className="text-gray-600 dark:text-gray-400">
                        Phone:{" "}
                      </span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {ride.driverId?.phone || "N/A"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        License:{" "}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {ride.driverId?.license_number || "N/A"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Vehicle:{" "}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {ride.driverId?.vehicle_number || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiUser className="mr-2" />
                  Passenger Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                      {ride.riderId?.photo ? (
                        <img
                          src={ride.riderId.photo}
                          alt={ride.riderId.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <FiUser size={24} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        {ride.riderId?.name || "No Name"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Passenger
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <FiPhone className="mr-2 text-gray-400" size={16} />
                      <span className="text-gray-600 dark:text-gray-400">
                        Phone:{" "}
                      </span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-white">
                        {ride.riderId?.phone || "N/A"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Email:{" "}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {ride.riderId?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ride Route Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiNavigation className="mr-2" />
                Ride Route
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 dark:text-green-300 text-sm font-bold">
                      A
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      Pickup Location
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {pickupAddress}
                    </p>
                    {ride.pickup_location?.coordinates && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Coordinates:{" "}
                        {ride.pickup_location.coordinates[1]?.toFixed(6)},{" "}
                        {ride.pickup_location.coordinates[0]?.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-300 text-sm font-bold">
                      B
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      Drop Location
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {dropAddress}
                    </p>
                    {ride.drop_location?.coordinates && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Coordinates:{" "}
                        {ride.drop_location.coordinates[1]?.toFixed(6)},{" "}
                        {ride.drop_location.coordinates[0]?.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ride Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <MdDirectionsCar className="mr-2" />
                Ride Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <FiMapPin
                      size={20}
                      className="text-blue-500 mx-auto mb-2"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Distance
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {ride.total_km || 0} km
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <FaIndianRupeeSign
                      size={20}
                      className="text-green-500 mx-auto mb-2"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Amount
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{ride.total_amount?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <FaIndianRupeeSign
                      size={20}
                      className="text-purple-500 mx-auto mb-2"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Admin Profit
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{ride.admin_profit?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <FaIndianRupeeSign
                      size={20}
                      className="text-orange-500 mx-auto mb-2"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Driver Profit
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{ride.driver_profit?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Payment Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <MdPayment className="mr-2" />
                Payment Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(
                      ride.isPayment_done
                    )}`}
                  >
                    {ride.isPayment_done ? "Paid" : "Unpaid"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Payment Mode
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentModeBadge(
                      ride.payment_mode
                    )}`}
                  >
                    {ride.payment_mode
                      ? ride.payment_mode.charAt(0).toUpperCase() +
                        ride.payment_mode.slice(1)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Total Amount
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ₹{ride.total_amount?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Ride Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiClock className="mr-2" />
                Ride Timeline
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ride Created
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {formatDateTime(ride.createdAt)}
                  </p>
                </div>

                {ride.started_time && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ride Started
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatTime(ride.started_time)}
                    </p>
                  </div>
                )}

                {ride.ride_end_time && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ride Completed
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatTime(ride.ride_end_time)}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Duration
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {calculateRideDuration()}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiCalendar className="mr-2" />
                Additional Info
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Ride Status:
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    Completed
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Ride Type:
                  </span>
                  <span className="font-semibold">
                    {ride.ride_type || "Standard"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Vehicle Type:
                  </span>
                  <span className="font-semibold">
                    {ride.vehicle_type || "N/A"}
                  </span>
                </div>
                {ride.rating && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Rating:
                    </span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                      {ride.rating} ⭐
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideHistoryDetails;
