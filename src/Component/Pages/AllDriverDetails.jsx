import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allDriverAPI } from '../../apis/AllDriver';
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
  FiSearch
} from 'react-icons/fi';
import { Helmet } from 'react-helmet';

const AllDriverDetails = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [rangeData, setRangeData] = useState(null);
  const [loadingRange, setLoadingRange] = useState(false);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        setLoading(true);
        const driverData = await allDriverAPI.getDriverById(driverId);
        
        if (driverData) {
          setDriver(driverData);
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

    fetchDriverDetails();
  }, [driverId]);

  const handleDateRangeSearch = async () => {
    if (!dateRange.from || !dateRange.to) {
      return;
    }

    try {
      setLoadingRange(true);
      // Mock API call - replace with actual API endpoint
      const rangeDataResponse = await allDriverAPI.getDriverRangeData(driverId, dateRange);
      setRangeData(rangeDataResponse);
    } catch (err) {
      console.error('Error fetching range data:', err);
    } finally {
      setLoadingRange(false);
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearDateRange = () => {
    setDateRange({ from: '', to: '' });
    setRangeData(null);
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
            onClick={() => navigate('/all-drivers')}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiChevronLeft className="mr-2" />
            Back to Drivers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | All Drivers Details</title>
      </Helmet>
      
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/all-drivers')}
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiChevronLeft className="mr-2" size={20} />
          Back to Drivers
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Details</h1>
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
            <p
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-3 ${
                driver.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {driver.isActive ? '● Active' : '● Inactive'}
            </p>
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
              <span className="font-medium text-gray-600 dark:text-gray-300">Email:</span>
              <span className="text-gray-900 dark:text-white">{driver.email || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Phone:</span>
              <span className="text-gray-900 dark:text-white">{driver.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Aadhar:</span>
              <span className="text-gray-900 dark:text-white">{driver.aadhar_number || '-'}</span>
            </div>
            {driver.license_number && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">License:</span>
                <span className="text-gray-900 dark:text-white">{driver.license_number}</span>
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
                  {driver.current_location.coordinates[0]}, {driver.current_location.coordinates[1]}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Address:
                </span>
                <span className="text-gray-900 dark:text-white text-sm">
                  <LocationName
                    coordinates={driver.current_location.coordinates}
                    fallbackText="Location not available"
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
            {driver.login_time && driver.logout_time && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Working Hours:</span>
                <span className="text-gray-900 dark:text-white">
                  {driver.login_time} - {driver.logout_time}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Total Rides:</span>
              <span className="text-gray-900 dark:text-white">{driver.total_complete_rides || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-300">Total Earnings:</span>
              <span className="text-gray-900 dark:text-white font-semibold">₹{(driver.total_earning || 0).toLocaleString()}</span>
            </div>
            {driver.cash_wallet !== undefined && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Cash Wallet:</span>
                <span className="text-gray-900 dark:text-white">₹{(driver.cash_wallet || 0).toLocaleString()}</span>
              </div>
            )}
            {driver.online_wallet !== undefined && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Online Wallet:</span>
                <span className="text-gray-900 dark:text-white">₹{(driver.online_wallet || 0).toLocaleString()}</span>
              </div>
            )}
            {driver.due_wallet !== undefined && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Due Wallet:</span>
                <span className="text-gray-900 dark:text-white">₹{(driver.due_wallet || 0).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Date Range Work Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <FiCalendar className="text-blue-600 dark:text-blue-400 text-xl" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Work Information (Date Range)
            </h3>
          </div>
          
          {/* Date Range Picker */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => handleDateChange('to', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDateRangeSearch}
                disabled={!dateRange.from || !dateRange.to || loadingRange}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiSearch size={16} />
                {loadingRange ? 'Searching...' : 'Search'}
              </button>
              
              <button
                onClick={clearDateRange}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Range Data Display */}
          <div className="space-y-4">
            {loadingRange ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Loading range data...</p>
              </div>
            ) : rangeData ? (
              <>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-300">Rides in Range:</span>
                  <span className="text-gray-900 dark:text-white">{rangeData.rides || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-300">Earnings in Range:</span>
                  <span className="text-gray-900 dark:text-white font-semibold">₹{(rangeData.earnings || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-300">Cash Wallet:</span>
                  <span className="text-gray-900 dark:text-white">₹{(rangeData.cash_wallet || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-300">Online Wallet:</span>
                  <span className="text-gray-900 dark:text-white">₹{(rangeData.online_wallet || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-300">Due Wallet:</span>
                  <span className="text-gray-900 dark:text-white">₹{(rangeData.due_wallet || 0).toLocaleString()}</span>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <FiCalendar className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-gray-500 dark:text-gray-400">
                  Select a date range to view work information
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ETO Card Information */}
        {driver.etoCard && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <FiCreditCard className="text-blue-600 dark:text-blue-400 text-xl" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                ETO Card Information
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">ETO ID:</span>
                <span className="text-gray-900 dark:text-white">{driver.etoCard.eto_id_num || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Helpline:</span>
                <span className="text-gray-900 dark:text-white">{driver.etoCard.helpLine_num || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Driver Toto Licence:</span>
                <span className="text-gray-900 dark:text-white">{driver.etoCard.driver_toto_licence || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Toto Licence:</span>
                <span className="text-gray-900 dark:text-white">{driver.etoCard.toto_licence || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600 dark:text-gray-300">Joined At:</span>
                <span className="text-gray-900 dark:text-white">
                  {driver.etoCard.createdAt ? new Date(driver.etoCard.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Documents Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <FiFileText className="text-blue-600 dark:text-blue-400 text-xl" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Documents
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {driver.aadhar_front_photo && (
            <DocumentCard
              url={driver.aadhar_front_photo}
              title="Document Front"
            />
          )}
          {driver.aadhar_back_photo && (
            <DocumentCard
              url={driver.aadhar_back_photo}
              title="Document Back"
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
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/all-drivers')}
          className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <FiChevronLeft className="mr-2" />
          Back to Drivers
        </button>
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

export default AllDriverDetails;