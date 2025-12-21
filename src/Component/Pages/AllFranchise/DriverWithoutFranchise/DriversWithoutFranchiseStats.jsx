import React from "react";
import { FiUsers, FiMapPin, FiCheckCircle, FiClock } from "react-icons/fi";

const DriversWithoutFranchiseStats = ({ statistics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-xs sm:text-sm">
              Total Without Franchise
            </p>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {statistics.totalWithoutFranchise}
            </p>
          </div>
          <FiUsers className="text-xl sm:text-3xl text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-xs sm:text-sm">
              Ready for Assignment
            </p>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {statistics.readyForAssignment}
            </p>
          </div>
          <FiCheckCircle className="text-xl sm:text-3xl text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-xs sm:text-sm">
              Franchise Available
            </p>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {statistics.withFranchiseAvailable}
            </p>
          </div>
          <FiMapPin className="text-xl sm:text-3xl text-purple-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-xs sm:text-sm">
              Currently on Ride
            </p>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {statistics.onRide}
            </p>
          </div>
          <FiClock className="text-xl sm:text-3xl text-orange-200" />
        </div>
      </div>
    </div>
  );
};

export default DriversWithoutFranchiseStats;
