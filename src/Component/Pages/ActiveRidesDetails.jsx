import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  FiUser,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiClock,
  FiChevronLeft,
  FiMap,
  FiNavigation,
  FiFlag
} from 'react-icons/fi';
import { Helmet } from 'react-helmet';

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

// Geocoding function to get address from coordinates
const reverseGeocode = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    if (!res.ok) throw new Error('Failed to fetch address');
    const data = await res.json();
    return data.display_name || 'Address not found';
  } catch (err) {
    return 'Unable to fetch address';
  }
};

const ActiveRidesDetails = () => {
  const { activeRideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('Loading address...');
  const [dropAddress, setDropAddress] = useState('Loading address...');
  const [addressLoading, setAddressLoading] = useState(true);

  // Initialize Socket.io
  useEffect(() => {
    connectSocket();
    setupListeners();
    registerAdmin("admin_id_here"); 

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Fetch addresses when ride data is available
  useEffect(() => {
    const fetchAddresses = async () => {
      if (ride?.pickup_location?.coordinates && ride?.drop_location?.coordinates) {
        setAddressLoading(true);
        try {
          const [pickupLat, pickupLon] = ride.pickup_location.coordinates;
          const [dropLat, dropLon] = ride.drop_location.coordinates;
          
          const [pickupAddr, dropAddr] = await Promise.all([
            reverseGeocode(pickupLat, pickupLon),
            reverseGeocode(dropLat, dropLon)
          ]);
          
          setPickupAddress(pickupAddr);
          setDropAddress(dropAddr);
        } catch (error) {
          console.error('Error fetching addresses:', error);
          setPickupAddress('Unable to load address');
          setDropAddress('Unable to load address');
        } finally {
          setAddressLoading(false);
        }
      }
    };

    fetchAddresses();
  }, [ride]);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        const foundRide = await activeRidesAPI.getRideById(activeRideId);

        if (foundRide) {
          setRide(foundRide);
        } else {
          setError('Ride not found');
        }
      } catch (err) {
        console.error('Error fetching ride details:', err);
        setError('Failed to load ride details');
      } finally {
        setLoading(false);
      }
    };

    if (activeRideId) {
      fetchRideDetails();
    }
  }, [activeRideId]);

  const handleViewOnMap = () => {
    setShowLocationModal(true);
    
    // Request driver location via socket
    requestDriverLocation(activeRideId, "admin_id_here");
    
    // Listen for location updates
    onDriverLocationUpdate((data) => {
      console.log("Location data received:", data);
      if (data.success && data.location) {
        const [lng, lat] = data.location.coordinates;
        setDriverLocation({ lat, lng, rideId: data.rideId });
      }
    });
  };

  const closeLocationModal = () => {
    setShowLocationModal(false);
    setDriverLocation(null);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading ride details...</div>
        </div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={() => navigate('/active-rides')}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/active-rides')}
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiChevronLeft className="mr-2" size={20} />
          Back to Rides
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ride Details</h1>
        <div className="w-24" />
      </div>

      {/* Ride Status Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 md:p-8 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
        
            <p className="text-green-100 text-2xl md:text-3xl lg:text-4xl">Currently Active</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <FiTruck size={40} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Driver Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <FiTruck className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Driver Information
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">Name:</span>
              <span className="text-gray-900 dark:text-white">{ride.driver?.name || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">Phone:</span>
              <a
                href={`tel:${ride.driver?.phone}`}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <FiPhone size={14} className="mr-1" />
                {ride.driver?.phone || '-'}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Driver ID:</span>
              <span className="text-gray-900 dark:text-white text-sm">{ride.driver?.id || '-'}</span>
            </div>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <FiUser className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Passenger Information
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">Name:</span>
              <span className="text-gray-900 dark:text-white">{ride.rider?.name || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">Phone:</span>
              <a
                href={`tel:${ride.rider?.phone}`}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <FiPhone size={14} className="mr-1" />
                {ride.rider?.phone || '-'}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Passenger ID:</span>
              <span className="text-gray-900 dark:text-white text-sm">{ride.rider?.id || '-'}</span>
            </div>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <FiNavigation className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pickup Location
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                ride.isPickUp_verify 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {ride.isPickUp_verify ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600 dark:text-gray-300 mb-2">Address:</span>
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
                <span className="font-medium text-gray-600 dark:text-gray-300">Coordinates:</span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {ride.pickup_location.coordinates[0].toFixed(6)}, {ride.pickup_location.coordinates[1].toFixed(6)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Drop Location */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <FiFlag className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Drop Location
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                ride.isDrop_verify 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {ride.isDrop_verify ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-600 dark:text-gray-300 mb-2">Address:</span>
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
                <span className="font-medium text-gray-600 dark:text-gray-300">Coordinates:</span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {ride.drop_location.coordinates[0].toFixed(6)}, {ride.drop_location.coordinates[1].toFixed(6)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Ride Details */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <FiMapPin className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Trip Details
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">Distance:</span>
              <span className="text-gray-900 dark:text-white font-semibold">{ride.total_km || '0'} km</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">Duration:</span>
              <span className="text-gray-900 dark:text-white">{ride.ride_duration_min || '0'} min</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Ride ID:</span>
              <span className="text-gray-900 dark:text-white text-sm font-mono">{ride.rideId || '-'}</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <FiClock className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Additional Information
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">Payment Method:</span>
              <span className="text-gray-900 dark:text-white capitalize">{ride.payment_method || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span className="font-medium text-gray-600 dark:text-gray-300">Ride Started:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                ride.isRide_started 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {ride.isRide_started ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Real-time Tracking:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
                Enabled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate('/active-rides')}
          className="flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          <FiChevronLeft className="mr-2" />
          Back to Rides
        </button>
        <button
          onClick={handleViewOnMap}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors font-medium shadow-lg"
        >
          <FiMap className="mr-2" />
          View on Map
        </button>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="relative bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 p-8">
            <button
              onClick={closeLocationModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>

            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="text-blue-600 dark:text-blue-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Driver Location
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ride ID: <span className="font-mono font-semibold">{activeRideId}</span>
              </p>
              
              {driverLocation ? (
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                  <p className="text-green-800 dark:text-green-200 font-semibold mb-3">Driver Location Found!</p>
                  <div className="space-y-2 text-left max-w-md mx-auto">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Latitude:</span>
                      <span className="font-mono ml-2 text-green-700 dark:text-green-300">{driverLocation.lat.toFixed(6)}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Longitude:</span>
                      <span className="font-mono ml-2 text-green-700 dark:text-green-300">{driverLocation.lng.toFixed(6)}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                  <p className="text-blue-800 dark:text-blue-200">
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Fetching driver location via Socket.io...
                  </p>
                </div>
              )}
              
              <button
                onClick={closeLocationModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRidesDetails;