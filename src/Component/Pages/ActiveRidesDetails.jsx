import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { activeRidesAPI } from "../../apis/ActiveRides";
import Breadcrumbs from "../Breadcrumbs/BreadCrumbs";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiClock,
  FiChevronLeft,
  FiMap,
  FiNavigation,
  FiFlag,
  FiDollarSign,
  FiCreditCard,
  FiExternalLink,
} from "react-icons/fi";
import { Helmet } from "react-helmet";
import toto from "../../assets/sidebar/toto.jpg";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

// Geocoding function to get address from coordinates
const reverseGeocode = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    if (!res.ok) throw new Error("Failed to fetch address");
    const data = await res.json();
    return data.display_name || "Address not found";
  } catch (err) {
    console.error("Geocoding error:", err);
    return "Unable to fetch address";
  }
};

const ActiveRidesDetails = () => {
  const { activeRideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("Loading address...");
  const [dropAddress, setDropAddress] = useState("Loading address...");
  const [addressLoading, setAddressLoading] = useState(true);

  // Fetch ride details
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // console.log("Fetching ride details for ID:", activeRideId);

        // Use the API method correctly
        const response = await activeRidesAPI.getRideById(activeRideId);

        console.log("Ride details response:", response);

        if (response.status === 200) {
          const rideData = response.data;
          setRide(rideData);

          // Extract driver location if available
          if (rideData.driver?.current_location?.coordinates) {
            const [lng, lat] = rideData.driver.current_location.coordinates;
            setDriverLocation({ lat, lng });
          }
        } else {
          setError(response.message || "Ride not found");
        }
      } catch (err) {
        console.error("Error fetching ride details:", err);
        setError(err.message || "Failed to load ride details");
      } finally {
        setLoading(false);
      }
    };

    if (activeRideId) {
      fetchRideDetails();
    }
  }, [activeRideId]);

  // Fetch addresses when ride data is available
  useEffect(() => {
    const fetchAddresses = async () => {
      if (
        ride?.pickup_location?.coordinates &&
        ride?.drop_location?.coordinates
      ) {
        setAddressLoading(true);
        try {
          // Note: Coordinates are usually [longitude, latitude] in GeoJSON
          const [pickupLng, pickupLat] = ride.pickup_location.coordinates;
          const [dropLng, dropLat] = ride.drop_location.coordinates;

          const [pickupAddr, dropAddr] = await Promise.all([
            reverseGeocode(pickupLat, pickupLng),
            reverseGeocode(dropLat, dropLng),
          ]);

          setPickupAddress(pickupAddr);
          setDropAddress(dropAddr);
        } catch (error) {
          console.error("Error fetching addresses:", error);
          setPickupAddress("Unable to load address");
          setDropAddress("Unable to load address");
        } finally {
          setAddressLoading(false);
        }
      }
    };

    if (ride) {
      fetchAddresses();
    }
  }, [ride]);

  // Open Google Maps with driver location
  const openDriverLocationInGoogleMaps = () => {
    if (driverLocation) {
      const { lat, lng } = driverLocation;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
      window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Open pickup location in Google Maps
  const openPickupLocationInGoogleMaps = () => {
    if (ride?.pickup_location?.coordinates) {
      const [lng, lat] = ride.pickup_location.coordinates;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
      window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Open drop location in Google Maps
  const openDropLocationInGoogleMaps = () => {
    if (ride?.drop_location?.coordinates) {
      const [lng, lat] = ride.drop_location.coordinates;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
      window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate ride duration if started
  const getRideDuration = () => {
    if (!ride?.started_time) return "0 min";

    const startTime = new Date(ride.started_time);
    const currentTime = new Date();
    const diffMs = currentTime - startTime;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">
            Loading ride details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400 mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate("/active-rides")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiChevronLeft className="mr-2" />
            Back to Rides
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | Active Rides Details</title>
      </Helmet>

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Header with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/active-rides")}
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiChevronLeft className="mr-2" size={20} />
          Back to Rides
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Ride Details
        </h1>
        <div className="w-24" />
      </div>

      {/* Ride Status Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 md:p-8 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-2xl md:text-3xl lg:text-4xl">
              Currently Active
            </p>
            {ride.createdAt && (
              <p className="text-green-200 mt-1">
                Started: {formatDate(ride.createdAt)}
              </p>
            )}
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <img className="h-12 w-12 rounded-full" src={toto} alt="Status" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Driver Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                {ride.driver?.driver_photo ? (
                  <img
                    src={ride.driver.driver_photo}
                    alt="Driver"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <FiUser
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Driver Information
              </h3>
            </div>
            {driverLocation && (
              <button
                onClick={openDriverLocationInGoogleMaps}
                className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                title="View Driver Location"
              >
                <FiMap size={14} className="mr-1" />
                Live Location
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Name:
              </span>
              <span className="text-gray-900 dark:text-white">
                {ride.driver?.name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Phone:
              </span>
              <a
                href={`tel:${ride.driver?.phone}`}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <FiPhone size={14} className="mr-1" />
                {ride.driver?.phone || "N/A"}
              </a>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Email:
              </span>
              <span className="text-gray-900 dark:text-white text-sm">
                {ride.driver?.email || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                License:
              </span>
              <span className="text-gray-900 dark:text-white text-sm">
                {ride.driver?.license_number || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              {ride.rider?.photo ? (
                <img
                  src={ride.rider.photo}
                  alt="Passenger"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <FiUser
                  className="text-green-600 dark:text-green-400"
                  size={24}
                />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Passenger Information
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Name:
              </span>
              <span className="text-gray-900 dark:text-white">
                {ride.rider?.name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Phone:
              </span>
              <a
                href={`tel:${ride.rider?.phone}`}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <FiPhone size={14} className="mr-1" />
                {ride.rider?.phone || "N/A"}
              </a>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Location:
              </span>
              {ride.rider?.current_location?.coordinates ? (
                <button
                  onClick={() => {
                    const [lng, lat] = ride.rider.current_location.coordinates;
                    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
                    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
                >
                  View on Map
                  <FiExternalLink size={12} className="ml-1" />
                </button>
              ) : (
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  N/A
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <FiNavigation
                  className="text-green-600 dark:text-green-400"
                  size={24}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Pickup Location
              </h3>
            </div>
            {ride.pickup_location?.coordinates && (
              <button
                onClick={openPickupLocationInGoogleMaps}
                className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                title="View on Google Maps"
              >
                <FiMap size={14} className="mr-1" />
                View Map
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Status:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ride.isPickUp_verify
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {ride.isPickUp_verify ? "Verified" : "Pending"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600 dark:text-gray-300 mb-2">
                Address:
              </span>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                  {addressLoading ? (
                    <span className="flex items-center text-gray-500">
                      <span className="animate-spin mr-2">⟳</span>
                      Loading address...
                    </span>
                  ) : (
                    pickupAddress
                  )}
                </p>
              </div>
            </div>
            {ride.pickup_location?.coordinates && (
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Coordinates:
                </span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {ride.pickup_location.coordinates[1].toFixed(6)},{" "}
                  {ride.pickup_location.coordinates[0].toFixed(6)}
                </span>
              </div>
            )}
            {ride.pickup_otp && (
              <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Pickup OTP:
                </span>
                <span className="text-gray-900 dark:text-white font-mono text-lg">
                  {ride.pickup_otp}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Drop Location */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <FiFlag className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Drop Location
              </h3>
            </div>
            {ride.drop_location?.coordinates && (
              <button
                onClick={openDropLocationInGoogleMaps}
                className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                title="View on Google Maps"
              >
                <FiMap size={14} className="mr-1" />
                View Map
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Status:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ride.isDrop_verify
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {ride.isDrop_verify ? "Verified" : "Pending"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600 dark:text-gray-300 mb-2">
                Address:
              </span>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                  {addressLoading ? (
                    <span className="flex items-center text-gray-500">
                      <span className="animate-spin mr-2">⟳</span>
                      Loading address...
                    </span>
                  ) : (
                    dropAddress
                  )}
                </p>
              </div>
            </div>
            {ride.drop_location?.coordinates && (
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Coordinates:
                </span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {ride.drop_location.coordinates[1].toFixed(6)},{" "}
                  {ride.drop_location.coordinates[0].toFixed(6)}
                </span>
              </div>
            )}
            {ride.drop_otp && (
              <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Drop OTP:
                </span>
                <span className="text-gray-900 dark:text-white font-mono text-lg">
                  {ride.drop_otp}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Ride Details */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <FiMapPin
                className="text-purple-600 dark:text-purple-400"
                size={24}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Trip Details
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Distance:
              </span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {ride.total_km || "0"} km
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Fare Amount:
              </span>
              <span className="text-gray-900 dark:text-white font-semibold flex items-center">
                ₹{ride.total_amount || "0"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Duration:
              </span>
              <span className="text-gray-900 dark:text-white">
                {getRideDuration()}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Status:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ride.isOn
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                {ride.isOn
                  ? "Active"
                  : ride.isRide_ended
                  ? "Completed"
                  : "Inactive"}
              </span>
            </div>
            {ride.started_time && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Started:
                </span>
                <span className="text-gray-900 dark:text-white text-sm">
                  {formatDate(ride.started_time)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payment & Earnings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <FiCreditCard
                className="text-orange-600 dark:text-orange-400"
                size={24}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Payment & Earnings
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Payment Method:
              </span>
              <span className="text-gray-900 dark:text-white capitalize flex items-center">
                <FiCreditCard size={14} className="mr-1" />
                {ride.payment_mode || "cash"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Payment Status:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ride.isPayment_done
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {ride.isPayment_done ? "Paid" : "Pending"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Driver Profit:
              </span>
              <span className="text-gray-900 dark:text-white font-semibold text-green-600 dark:text-green-400">
                ₹{ride.driver_profit || "0"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Admin Profit:
              </span>
              <span className="text-gray-900 dark:text-white font-semibold text-blue-600 dark:text-blue-400">
                ₹{ride.admin_profit || "0"} ({ride.admin_percentage || "0"}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Franchise Profit:
              </span>
              <span className="text-gray-900 dark:text-white font-semibold text-purple-600 dark:text-purple-400">
                ₹{ride.franchise_profit || "0"} (
                {ride.franchise_commission_rate || "0"}%)
              </span>
            </div>
          </div>
        </div>

        {/* Franchise Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <FiUser
                className="text-indigo-600 dark:text-indigo-400"
                size={24}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Franchise Information
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Name:
              </span>
              <span className="text-gray-900 dark:text-white">
                {ride.franchise?.name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Email:
              </span>
              <span className="text-gray-900 dark:text-white text-sm">
                {ride.franchise?.email || "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Phone:
              </span>
              <a
                href={`tel:${ride.franchise?.phone}`}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <FiPhone size={14} className="mr-1" />
                {ride.franchise?.phone || "N/A"}
              </a>
            </div>
            {ride.franchise?.address && (
              <div className="flex flex-col">
                <span className="font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Address:
                </span>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-gray-900 dark:text-white text-xs leading-relaxed">
                    {ride.franchise.address.street_address || ""}
                    <br />
                    {ride.franchise.address.city || ""}
                    <br />
                    {ride.franchise.address.district || ""}
                    <br />
                    {ride.franchise.address.state || ""} -{" "}
                    {ride.franchise.address.pincode || ""}
                    <br />
                    {ride.franchise.address.country || ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <FiUser className="text-gray-600 dark:text-gray-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Admin Information
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Name:
              </span>
              <span className="text-gray-900 dark:text-white">
                {ride.admin?.name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Email:
              </span>
              <span className="text-gray-900 dark:text-white text-sm">
                {ride.admin?.email || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => navigate("/active-rides")}
          className="flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          <FiChevronLeft className="mr-2" />
          Back to Rides
        </button>
        {driverLocation && (
          <button
            onClick={openDriverLocationInGoogleMaps}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium shadow-lg"
          >
            <FiMap className="mr-2" />
            View Driver on Google Maps
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveRidesDetails;
