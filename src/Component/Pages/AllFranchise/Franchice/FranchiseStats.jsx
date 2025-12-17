import React from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FiUser, FiTrendingUp, FiHome } from "react-icons/fi";

const FranchiseStats = ({ summary }) => {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm">
                Total Franchises
              </p>
              <p className="text-lg sm:text-2xl font-bold mt-1">
                {summary.total_franchises}
              </p>
            </div>
            <FiUser className="text-xl sm:text-3xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm">
                Active Franchises
              </p>
              <p className="text-lg sm:text-2xl font-bold mt-1">
                {summary.active_franchises}
              </p>
            </div>
            <FiTrendingUp className="text-xl sm:text-3xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm">
                Admin Earnings
              </p>
              <p className="text-lg sm:text-2xl font-bold mt-1">
                ₹{summary.total_admin_earnings.toLocaleString()}
              </p>
            </div>
            <FaIndianRupeeSign className="text-xl sm:text-3xl text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-xs sm:text-sm">Total Rides</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">
                {summary.total_completed_rides}
              </p>
            </div>
            <FiHome className="text-xl sm:text-3xl text-orange-200" />
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiUser className="text-gray-500 mr-3" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total Drivers
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {summary.total_drivers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiTrendingUp className="text-green-500 mr-3" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Approved Franchises
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {summary.approved_franchises}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaIndianRupeeSign className="text-purple-500 mr-3" />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Franchise Earnings
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ₹{summary.total_franchise_earnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FranchiseStats;
