import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allPassengerAPI } from '../../apis/AllPassenger';
import Breadcrumbs from '../Breadcrumbs/BreadCrumbs';
import {
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiTrendingUp,
  FiChevronLeft,
} from 'react-icons/fi';
import { Helmet } from 'react-helmet';

const AllPassengerDetails = () => {
  const { passengerId } = useParams();
  const navigate = useNavigate();
  const [passenger, setPassenger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPassengerDetails = async () => {
      try {
        setLoading(true);
        const passengerData = await allPassengerAPI.getPassengerById(passengerId);
        
        if (passengerData) {
          setPassenger(passengerData);
        } else {
          setError('Passenger not found');
        }
      } catch (err) {
        console.error('Error fetching passenger details:', err);
        setError('Failed to load passenger details');
      } finally {
        setLoading(false);
      }
    };

    if (passengerId) {
      fetchPassengerDetails();
    }
  }, [passengerId]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading passenger details...</div>
        </div>
      </div>
    );
  }

  if (error || !passenger) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={() => navigate('/all-passengers')}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiChevronLeft className="mr-2" />
            Back to Passengers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
              <title>Admin | All Passengers Details</title>
            </Helmet>
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/all-passengers')}
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiChevronLeft className="mr-2" size={20} />
          Back to Passengers
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Passenger Details</h1>
        <div className="w-24" />
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={passenger.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(passenger.name)}`}
              alt="Passenger"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
            />
            <span
              className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-gray-700 ${
                passenger.is_on_ride ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {passenger.name}
            </h2>
            <p
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-3 ${
                passenger.is_on_ride
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}
            >
              {passenger.is_on_ride ? '● On Ride' : '● Not On Ride'}
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              {passenger.phone && (
                <a
                  href={`tel:${passenger.phone}`}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FiPhone className="w-4 h-4 mr-2" />
                  {passenger.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <FiUser className="text-blue-600 dark:text-blue-400 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Passenger ID:</span>
              <span className="text-gray-900 dark:text-white">{passenger.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Phone:</span>
              <span className="text-gray-900 dark:text-white">{passenger.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Ride Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                passenger.is_on_ride
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {passenger.is_on_ride ? 'On Ride' : 'Not On Ride'}
              </span>
            </div>
          </div>
        </div>

        {/* Ride Statistics */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <FiTrendingUp className="text-green-600 dark:text-green-400 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Ride Statistics
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Total Rides:</span>
              <span className="text-gray-900 dark:text-white font-semibold text-lg">{passenger.total_rides || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>
              <span className="text-gray-900 dark:text-white">
                {passenger.is_on_ride ? 'Currently On Ride' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <FiCalendar className="text-purple-600 dark:text-purple-400 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Account Information
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Member Since:</span>
              <span className="text-gray-900 dark:text-white">
                {passenger.createdAt ? new Date(passenger.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Account Status:</span>
              <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <FiMail className="text-orange-600 dark:text-orange-400 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quick Stats
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Last Updated:</span>
              <span className="text-gray-900 dark:text-white">
                {passenger.createdAt ? new Date(passenger.createdAt).toLocaleDateString() : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Activity:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                passenger.is_on_ride
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {passenger.is_on_ride ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/all-passengers')}
          className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <FiChevronLeft className="mr-2" />
          Back to Passengers
        </button>
      </div>
    </div>
  );
};

export default AllPassengerDetails;