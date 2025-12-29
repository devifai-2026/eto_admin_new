import React from "react";
import { FiCalendar, FiEye, FiUsers, FiDollarSign } from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";

const StatsCards = ({ requests, statistics, getStatusCount, getTotalAmount, userRole }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-xs sm:text-sm">Total Requests</p>
            <p className="text-lg sm:text-2xl font-bold mt-1">{requests.length}</p>
          </div>
          <FiUsers className="text-xl sm:text-3xl text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-100 text-xs sm:text-sm">Pending</p>
            <p className="text-lg sm:text-2xl font-bold mt-1">{getStatusCount("pending")}</p>
          </div>
          <FiCalendar className="text-xl sm:text-3xl text-yellow-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-xs sm:text-sm">Approved</p>
            <p className="text-lg sm:text-2xl font-bold mt-1">{getStatusCount("approved")}</p>
          </div>
          <FiEye className="text-xl sm:text-3xl text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-xs sm:text-sm">Total Amount</p>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              ₹{getTotalAmount().toLocaleString()}
            </p>
          </div>
          <FiDollarSign className="text-xl sm:text-3xl text-purple-200" />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;