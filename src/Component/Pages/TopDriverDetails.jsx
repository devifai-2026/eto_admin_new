import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Breadcrumbs from '../Breadcrumbs/BreadCrumbs';
import { MdArrowBack, MdLocationOn, MdPhone, MdEmail, MdPerson, MdDirectionsCar } from 'react-icons/md';
import { GiWallet } from 'react-icons/gi';
import { FaAddressCard, FaCarSide } from 'react-icons/fa6';
import { IoIosDocument } from 'react-icons/io';
import { topDriverAPI } from '../../apis/TopDriver';
import { Helmet } from 'react-helmet';
import toto from "../../assets/sidebar/toto.jpg"

const TopDriverDetails = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (driverId) {
      fetchDriverDetails();
    }
  }, [driverId]);

  const fetchDriverDetails = async () => {
    try {
      const driver = await topDriverAPI.getDriverById(driverId);
      
      if (driver) {
        setDriverData(driver);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching driver details:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day} / ${month} / ${year}`;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading driver details...</div>
        </div>
      </div>
    );
  }

  if (!driverData) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-300">Driver not found</div>
        </div>
      </div>
    );
  }

  const { driverDetails, etoCard, rideCount } = driverData;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
              <title>Admin | Top Drivers Details</title>
            </Helmet>
    
      {/* Header with Back Button */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mr-4"
          >
            <MdArrowBack className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Driver Profile</h1>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <img
                  src={driverDetails.driver_photo}
                  alt="Driver"
                  className="w-32 h-32 rounded-full border-4 border-white border-opacity-20 object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">{driverDetails.name}</h2>
                {etoCard && (
                  <p className="text-blue-100 text-lg">ETO ID: {etoCard.eto_id_num}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                  <div className="flex items-center">
                    <MdPhone className="w-5 h-5 mr-2" />
                    <span>{driverDetails.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <MdEmail className="w-5 h-5 mr-2" />
                    <span>{driverDetails.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img className='w-10 h-10  rounded-full' src={toto} alt="" />
                    <span>{rideCount || '0'} Rides</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <MdPerson className="w-6 h-6 mr-2 text-blue-500" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Aadhar Number:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{driverDetails.aadhar_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">License Number:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{driverDetails.license_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Approval Status:</span>
                      <span className={`font-medium ${driverDetails.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                        {driverDetails.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Current Status:</span>
                      <span className={`font-medium ${driverDetails.is_on_ride ? 'text-orange-600' : 'text-green-600'}`}>
                        {driverDetails.is_on_ride ? 'On Ride' : 'Available'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wallet Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                    <GiWallet className="text-yellow-400" /> Wallet Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Due Wallet:</span>
                      <span className="font-medium text-gray-800 dark:text-white">₹{driverDetails.due_wallet || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Cash Wallet:</span>
                      <span className="font-medium text-gray-800 dark:text-white">₹{driverDetails.cash_wallet || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Online Wallet:</span>
                      <span className="font-medium text-gray-800 dark:text-white">₹{driverDetails.online_wallet || '0'}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3">
                      <span className="text-gray-800 dark:text-white font-semibold">Total Earnings:</span>
                      <span className="font-bold text-green-600">₹{driverDetails.total_earning || '0'}</span>
                    </div>
                  </div>
                </div>

                {/* Ride Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                   <FaCarSide className='text-red-500' /> Ride Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Rides:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{rideCount || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Completed KM:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{driverDetails.total_completed_km || '0'} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Registered At:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{formatDate(driverDetails.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Last Updated:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{formatDate(driverDetails.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Address Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <MdLocationOn className="w-6 h-6 mr-2 text-green-500" />
                    Address Information
                  </h3>
                  <div className="space-y-3">
                    <div><strong>Village:</strong> {driverDetails.village || 'N/A'}</div>
                    <div><strong>Police Station:</strong> {driverDetails.police_station || 'N/A'}</div>
                    <div><strong>Landmark:</strong> {driverDetails.landmark || 'N/A'}</div>
                    <div><strong>Post Office:</strong> {driverDetails.post_office || 'N/A'}</div>
                    <div><strong>District:</strong> {driverDetails.district || 'N/A'}</div>
                    <div><strong>Pin Code:</strong> {driverDetails.pin_code || 'N/A'}</div>
                  </div>
                </div>

                {/* ETO Card Information */}
                {etoCard && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                      <FaAddressCard className='text-blue-400' /> ETO Card Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">ETO ID:</span>
                        <span className="font-medium text-gray-800 dark:text-white">{etoCard.eto_id_num}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">HelpLine Number:</span>
                        <span className="font-medium text-gray-800 dark:text-white">{etoCard.helpLine_num}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Created At:</span>
                        <span className="font-medium text-gray-800 dark:text-white">{formatDate(etoCard.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Joined At</span>
                        <span className="font-medium text-gray-800 dark:text-white">{formatDate(etoCard.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Section */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                    <IoIosDocument /> Documents
                  </h3>
                  
                  {/* Aadhar Photos */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Aadhar Card</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <img
                          src={driverDetails.aadhar_front_photo}
                          alt="Aadhar Front"
                          className="w-full h-40 object-contain rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-2"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">Front</span>
                      </div>
                      <div className="text-center">
                        <img
                          src={driverDetails.aadhar_back_photo}
                          alt="Aadhar Back"
                          className="w-full h-40 object-contain rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-2"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">Back</span>
                      </div>
                    </div>
                  </div>

                  {/* Car Photos */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Vehicle Photos</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {driverDetails.car_photo && driverDetails.car_photo.map((photo, index) => (
                        <div key={index} className="text-center">
                          <img
                            src={photo}
                            alt={`Car ${index + 1}`}
                            className="w-full h-40 object-contain rounded-lg border border-gray-300 dark:border-gray-600 bg-white p-2"
                            loading="lazy"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">Photo {index + 1}</span>
                        </div>
                      ))}
                    </div>
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

export default TopDriverDetails;