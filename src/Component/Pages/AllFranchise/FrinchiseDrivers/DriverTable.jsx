import React from "react";
import {
  FiUser,
  FiEye,
  FiMapPin,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DriverTable = ({
  drivers,
  viewDriverDetails,
  getStatusBadge,
  getRideStatusBadge,
  formatDate,
}) => {
  const navigate = useNavigate();

  console.log(drivers);

  // Mobile View Component
  const MobileDriverCard = ({ driver }) => {
    const status = getStatusBadge(driver); // Pass full driver object
    const rideStatus = getRideStatusBadge(driver.is_on_ride);

    return (
      <div className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
              <FiUser size={20} />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {driver.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Joined {formatDate(driver.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1 ${status.dotColor}`}
              ></span>
              {status.text}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${rideStatus.color}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1 ${rideStatus.dotColor}`}
              ></span>
              {rideStatus.text}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              Phone
            </div>
            <div className="text-gray-900 dark:text-white">
              {driver.phone || "-"}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              Email
            </div>
            <div className="text-gray-900 dark:text-white truncate">
              {driver.email || "-"}
            </div>
          </div>
        </div>

        {/* Ride Info */}
        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              Total Rides
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {driver.total_complete_rides || "0"}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">
              Earnings
            </div>
            <div className="font-semibold text-green-600 dark:text-green-400">
              ₹{driver.total_earning?.toLocaleString() || "0"}
            </div>
          </div>
        </div>

        {/* Current Ride Info */}
        {driver.current_ride && (
          <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
            <div className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
              Current Ride
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-gray-600 dark:text-gray-400">Amount</div>
                <div className="font-medium">
                  ₹{driver.current_ride.total_amount || "0"}
                </div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400">Distance</div>
                <div className="font-medium">
                  {driver.current_ride.total_km || "0"} km
                </div>
              </div>
              {driver.current_ride.rider && (
                <div className="col-span-2">
                  <div className="text-gray-600 dark:text-gray-400">Rider</div>
                  <div className="font-medium truncate">
                    {driver.current_ride.rider.name} (
                    {driver.current_ride.rider.phone})
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => viewDriverDetails(driver)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
          >
            <FiEye size={14} className="mr-1" />
            View
          </button>
          {driver.formatted_location && (
            <a
              href={driver.formatted_location.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-sm"
            >
              <FiMapPin size={14} className="mr-1" />
              Location
            </a>
          )}
        </div>
      </div>
    );
  };

  // Desktop Table View
  const DesktopDriverTable = () => {
    return (
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Driver
            </th>
            <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Rides
            </th>
            <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Earnings
            </th>
            <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Current Ride
            </th>
            <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {drivers.map((driver) => {
            const status = getStatusBadge(driver); // Pass full driver object
            const rideStatus = getRideStatusBadge(driver.is_on_ride);

            return (
              <tr
                key={driver._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {/* Driver Info */}
                <td className="px-4 lg:px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                      <FiUser size={20} />
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {driver.name}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        Joined {formatDate(driver.createdAt)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-4 lg:px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {driver.phone || "-"}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                    {driver.email || "-"}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 lg:px-6 py-4">
                  <div className="flex flex-col space-y-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${status.color}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-1 ${status.dotColor}`}
                      ></span>
                      {status.text}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${rideStatus.color}`}
                    >
                      
                    </span>
                  </div>
                </td>

                {/* Rides */}
                <td className="px-4 lg:px-6 py-4 text-center">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {driver.total_complete_rides || "0"}
                  </div>
                </td>

                {/* Earnings */}
                <td className="px-4 lg:px-6 py-4 text-center">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ₹{driver.total_earning?.toLocaleString() || "0"}
                  </div>
                </td>

                {/* Current Ride */}
                <td className="px-4 lg:px-6 py-4">
                  {driver.current_ride ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-medium text-blue-800 dark:text-blue-300">
                          Active Ride
                        </div>
                        <div className="text-xs font-bold">
                          ₹{driver.current_ride.total_amount || "0"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="text-gray-600 dark:text-gray-400">
                          Distance:
                        </div>
                        <div className="text-right">
                          {driver.current_ride.total_km || "0"} km
                        </div>
                        {driver.current_ride.rider && (
                          <>
                            <div className="text-gray-600 dark:text-gray-400">
                              Rider:
                            </div>
                            <div className="text-right truncate">
                              {driver.current_ride.rider.name}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      No active ride
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 lg:px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => viewDriverDetails(driver)}
                      className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
                      title="View Details"
                    >
                      <FiEye size={14} />
                    </button>

                    {driver.formatted_location && (
                      <a
                        href={driver.formatted_location.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-sm"
                        title="View Location"
                      >
                        <FiMapPin size={14} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <>
      {/* Mobile Cards */}
      <div className="sm:hidden">
        {drivers.map((driver) => (
          <MobileDriverCard key={driver._id} driver={driver} />
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <DesktopDriverTable />
      </div>
    </>
  );
};

export default DriverTable;
