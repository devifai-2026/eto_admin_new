import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { topDriverAPI } from '../../apis/TopDriver';
import Breadcrumbs from '../Breadcrumbs/BreadCrumbs';
import LocationName from '../../common/Loader/LocationName';
import {
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiFileText,
  FiPhone,
  FiMail,
  FiArrowUpRight,
  FiChevronLeft,
  FiCreditCard,
  FiCalendar,
  FiSearch,
  FiDownload,
  FiShield,
  FiNavigation,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { Helmet } from 'react-helmet';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaIndianRupeeSign } from 'react-icons/fa6';

const TopDriverDetails = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [etoCard, setEtoCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rideCount, setRideCount] = useState(0);
  const etoCardRef = useRef(null);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        setLoading(true);
        const response = await topDriverAPI.getDriverById(driverId);
        
        console.log('Fetched driver data:', response);
        
        if (response && response.driverDetails) {
          // Set driver data
          setDriver(response.driverDetails);
          
          // Set ETO card data if available
          if (response.etoCard) {
            setEtoCard(response.etoCard);
          }
          
          // Set ride count if available
          if (response.rideCount !== undefined) {
            setRideCount(response.rideCount);
          }
        } else {
          setError('Driver not found');
        }
      } catch (err) {
        console.error('Error fetching driver details:', err);
        setError('Failed to load driver details');
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchDriverDetails();
    }
  }, [driverId]);

  const downloadEtoCardPDF = async () => {
    if (!etoCardRef.current || !etoCard) return;

    try {
      const canvas = await html2canvas(etoCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [86, 54] // Standard ID card size
      });

      const imgWidth = 86;
      const imgHeight = 54;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`ETO-Card-${etoCard.eto_id_num || driver?.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download ETO Card. Please try again.');
    }
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

  if (error || !driver) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiChevronLeft className="mr-2" />
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | Top Drivers Details</title>
      </Helmet>
      
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiChevronLeft className="mr-2" size={20} />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Top Driver Details</h1>
        <div className="w-24" />
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={driver.driver_photo || '/default-avatar.png'}
              alt="Driver"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <span
              className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-gray-700 ${
                driver.isActive ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {driver.name || 'Unknown Driver'}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <p
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  driver.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {driver.isActive ? '● Active' : '● Inactive'}
              </p>
              {driver.isApproved ? (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <FiCheckCircle className="mr-2" size={14} />
                  Approved
                </span>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <FiAlertCircle className="mr-2" size={14} />
                  Pending Approval
                </span>
              )}
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <FiNavigation className="mr-2" size={14} />
                {rideCount} Rides
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {driver.phone && (
                <a
                  href={`tel:${driver.phone}`}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FiPhone className="w-4 h-4 mr-2" />
                  {driver.phone}
                </a>
              )}
              {driver.email && (
                <a
                  href={`mailto:${driver.email}`}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FiMail className="w-4 h-4 mr-2" />
                  {driver.email}
                </a>
              )}
              {driver.userId && (
                <span className="flex items-center text-gray-600 dark:text-gray-300">
                  <FiUser className="w-4 h-4 mr-2" />
                  ID: {driver.userId}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ETO Card Preview Section */}
      {etoCard && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FiCreditCard className="text-blue-600 dark:text-blue-400 text-xl" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                ETO Card
              </h3>
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <button
              onClick={downloadEtoCardPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          {/* ETO Card Preview */}
          <div className="flex justify-center">
            <div 
              ref={etoCardRef}
              className="relative w-[340px] h-[220px] bg-white border-4 border-black rounded-lg overflow-hidden"
            >
              {/* Front Side */}
              <div className="absolute inset-0">
                {/* Top Banner */}
                <div className="h-[30%] bg-gradient-to-r from-blue-600 to-blue-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">ETO DRIVER ID CARD</span>
                  </div>
                  
                  {/* Profile Image Container */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full bg-white p-1">
                    <img
                      src={driver.driver_photo}
                      alt="Driver"
                      className="w-full h-full rounded-full object-cover border-2 border-blue-600"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                </div>

                {/* Driver Name */}
                <div className="mt-16 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">{driver.name}</h3>
                  <div className="mt-2 px-4 py-1 bg-blue-100 inline-block rounded-full">
                    <span className="text-blue-800 font-semibold">
                      ID: {etoCard.eto_id_num}
                    </span>
                  </div>
                </div>

                {/* Address Details */}
                <div className="mt-4 px-6">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600 font-medium">Village:</div>
                    <div className="text-gray-900">{driver.village || 'N/A'}</div>
                    
                    <div className="text-gray-600 font-medium">Post Office:</div>
                    <div className="text-gray-900">{driver.post_office || 'N/A'}</div>
                    
                    <div className="text-gray-600 font-medium">Police Station:</div>
                    <div className="text-gray-900">{driver.police_station || 'N/A'}</div>
                    
                    <div className="text-gray-600 font-medium">District:</div>
                    <div className="text-gray-900">{driver.district || 'N/A'}</div>
                    
                    <div className="text-gray-600 font-medium">PIN Code:</div>
                    <div className="text-gray-900">{driver.pin_code || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">ETO ID:</span>
                <span className="text-gray-900 dark:text-white font-semibold">{etoCard.eto_id_num}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Helpline Number:</span>
                <a 
                  href={`tel:${etoCard.helpLine_num}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {etoCard.helpLine_num}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Created At:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(etoCard.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Driver License:</span>
                <span className="text-gray-900 dark:text-white">{driver.license_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Toto Photos:</span>
                <span className="text-gray-900 dark:text-white">{driver.car_photo?.length || 0} photos</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Last Updated:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(etoCard.updatedAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(driver.total_earning || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <FaIndianRupeeSign className="text-2xl text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Rides
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {rideCount || driver.total_complete_rides || 0}
              </p>
            </div>
            <FiNavigation className="text-2xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Distance Covered
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {(driver.total_completed_km || 0).toFixed(2)} km
              </p>
            </div>
            <FiTruck className="text-2xl text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Due Wallet
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(driver.due_wallet || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <FiCreditCard className="text-2xl text-orange-500" />
          </div>
        </div>
      </div>

      {/* Additional Wallet Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Cash Wallet
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(driver.cash_wallet || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <FaIndianRupeeSign className="text-2xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Online Wallet
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(driver.online_wallet || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <FiCreditCard className="text-2xl text-green-500" />
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
              <span className="font-medium text-gray-600 dark:text-gray-300">Email:</span>
              <span className="text-gray-900 dark:text-white">{driver.email || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Phone:</span>
              <span className="text-gray-900 dark:text-white">{driver.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">License Number:</span>
              <span className="text-gray-900 dark:text-white">{driver.license_number || '-'}</span>
            </div>
            {driver.aadhar_number && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Aadhar Number:</span>
                <span className="text-gray-900 dark:text-white">{driver.aadhar_number}</span>
              </div>
            )}
            {driver.userId && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">User ID:</span>
                <span className="text-gray-900 dark:text-white text-sm">{driver.userId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <FiMapPin className="text-blue-600 dark:text-blue-400 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Address
            </h3>
          </div>
          <div className="space-y-4">
            {driver.village && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Village:</span>
                <span className="text-gray-900 dark:text-white">{driver.village}</span>
              </div>
            )}
            {driver.police_station && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Police Station:</span>
                <span className="text-gray-900 dark:text-white">{driver.police_station}</span>
              </div>
            )}
            {driver.district && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">District:</span>
                <span className="text-gray-900 dark:text-white">{driver.district}</span>
              </div>
            )}
            {driver.pin_code && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">PIN Code:</span>
                <span className="text-gray-900 dark:text-white">{driver.pin_code}</span>
              </div>
            )}
            {driver.landmark && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Landmark:</span>
                <span className="text-gray-900 dark:text-white">{driver.landmark}</span>
              </div>
            )}
            {driver.post_office && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Post Office:</span>
                <span className="text-gray-900 dark:text-white">{driver.post_office}</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Location */}
        {driver.current_location && driver.current_location.coordinates && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <FiMapPin className="text-blue-600 dark:text-blue-400 text-xl" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Current Location
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="font-medium text-gray-600 dark:text-gray-300 mb-1">
                  GPS Coordinates:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {driver.current_location.coordinates[0].toFixed(6)}, {driver.current_location.coordinates[1].toFixed(6)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Address:
                </span>
                <span className="text-gray-900 dark:text-white text-sm">
                  <LocationName
                    coordinates={driver.current_location.coordinates}
                    fallbackText="Fetching location..."
                  />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Work Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <FiBriefcase className="text-blue-600 dark:text-blue-400 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Work Information
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">On Ride:</span>
              <span className={`font-semibold ${driver.is_on_ride ? 'text-blue-600' : 'text-gray-600'}`}>
                {driver.is_on_ride ? 'Yes' : 'No'}
              </span>
            </div>
            {driver.current_ride_id && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Current Ride ID:</span>
                <span className="text-gray-900 dark:text-white text-sm truncate">{driver.current_ride_id}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Total Rides:</span>
              <span className="text-gray-900 dark:text-white">{rideCount || driver.total_complete_rides || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Distance Covered:</span>
              <span className="text-gray-900 dark:text-white">{(driver.total_completed_km || 0).toFixed(2)} km</span>
            </div>
            {driver.login_time && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Login Time:</span>
                <span className="text-gray-900 dark:text-white">{driver.login_time}</span>
              </div>
            )}
            {driver.logout_time && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Logout Time:</span>
                <span className="text-gray-900 dark:text-white">{driver.logout_time}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiFileText className="text-blue-600 dark:text-blue-400 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Documents
            </h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {driver.car_photo?.length || 0} photos • {driver.aadhar_front_photo ? 2 : 0} Aadhar
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {driver.aadhar_front_photo && (
            <DocumentCard
              url={driver.aadhar_front_photo}
              title="Aadhar Front"
            />
          )}
          {driver.aadhar_back_photo && (
            <DocumentCard
              url={driver.aadhar_back_photo}
              title="Aadhar Back"
            />
          )}
          {driver.car_photo && Array.isArray(driver.car_photo) && driver.car_photo.map((photo, index) => (
            <DocumentCard
              key={index}
              url={photo}
              title={`Toto Photo ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <FiChevronLeft className="mr-2" />
          Back
        </button>
        {etoCard && (
          <button
            onClick={downloadEtoCardPDF}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiDownload className="mr-2" />
            Download ETO Card
          </button>
        )}
      </div>
    </div>
  );
};

// Document Card Component
const DocumentCard = ({ url, title }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 group bg-gray-50 dark:bg-gray-700"
    >
      <img
        src={url}
        alt={title}
        className="w-20 h-20 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
        onError={(e) => {
          e.target.src = '/default-document.png';
        }}
      />
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </span>
      <FiArrowUpRight className="mt-2 text-xs text-gray-400 group-hover:text-blue-500 transition-colors" />
    </a>
  );
};

export default TopDriverDetails;