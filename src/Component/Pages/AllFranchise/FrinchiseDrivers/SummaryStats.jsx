import React from "react";
import { FiUsers, FiNavigation, FiClock } from "react-icons/fi";
import { FaIndianRupeeSign, FaRoad, FaWallet } from "react-icons/fa6";

const SummaryStats = ({ summary, commissionSettings }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Total Drivers */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">
              Total Drivers
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {summary?.total_drivers || 0}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  summary?.total_active_drivers
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                }`}
              >
                {summary?.total_active_drivers || 0} Active
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  summary?.total_drivers_on_ride
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                }`}
              >
                {summary?.total_drivers_on_ride || 0} On Ride
              </span>
              {/* Pending Approval Badge */}
              {summary?.total_pending_drivers > 0 && (
                <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded-full">
                  {summary.total_pending_drivers} Pending
                </span>
              )}
            </div>
          </div>
          <FiUsers className="text-2xl sm:text-3xl text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Earnings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">
              Total Earnings
            </p>
            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{(summary?.total_earnings || 0).toLocaleString()}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div className="text-gray-600 dark:text-gray-400">
                Admin:{" "}
                <span className="font-medium">
                  ₹{(summary?.total_admin_earnings || 0).toLocaleString()}
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Franchise:{" "}
                <span className="font-medium">
                  ₹{(summary?.total_franchise_earnings || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <FaIndianRupeeSign className="text-2xl sm:text-3xl text-green-600 dark:text-green-400" />
        </div>
      </div>

      {/* Rides & Distance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">
              Rides & Distance
            </p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
              {summary?.total_completed_rides || 0}
            </p>
            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
              <FaRoad size={12} />
              <span>{summary?.total_distance_covered || 0} km</span>
              <span className="mx-1">•</span>
              <FiNavigation size={12} />
              <span>{summary?.avg_rides_per_driver || 0} rides/driver</span>
            </div>
          </div>
          <FiNavigation className="text-2xl sm:text-3xl text-purple-600 dark:text-purple-400" />
        </div>
      </div>

      {/* Commission & Wallet */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">
              Commission & Wallet
            </p>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded">
                Admin: {commissionSettings?.admin_rate || 18}%
              </span>
              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded">
                Franchise: {commissionSettings?.franchise_rate || 10}%
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Wallet: ₹{(summary?.total_wallet_balance || 0).toLocaleString()}
              <span className="mx-1">•</span>
              Due: ₹{(summary?.total_driver_due || 0).toLocaleString()}
            </div>
          </div>
          <FaWallet className="text-2xl sm:text-3xl text-orange-600 dark:text-orange-400" />
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;
