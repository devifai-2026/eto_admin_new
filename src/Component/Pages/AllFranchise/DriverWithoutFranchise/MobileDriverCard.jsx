import React, { useState } from "react";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiPackage,
  FiDollarSign,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { MdOutlineAssignment, MdBusiness } from "react-icons/md";

const MobileDriverCard = ({ driver, selectedDrivers, onSelect, onAssign }) => {
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [showFranchiseDetails, setShowFranchiseDetails] = useState(false);

  // Availability badge styling
  const getAvailabilityBadge = (availability) => {
    if (!availability.canBeAssigned) {
      return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700";
    } else if (availability.hasFranchiseInPincode) {
      return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700";
    } else {
      return "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700";
    }
  };

  // Availability text
  const getAvailabilityText = (availability) => {
    if (!availability.canBeAssigned) {
      return "Cannot Assign";
    } else if (availability.hasFranchiseInPincode) {
      return "Ready to Assign";
    } else {
      return "No Franchise in Area";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center flex-1">
          {/* Selection Checkbox */}
          <div className="relative mr-3">
            <input
              type="checkbox"
              checked={selectedDrivers.includes(driver._id)}
              onChange={() => onSelect(driver._id)}
              disabled={!driver.franchiseAvailability.canBeAssigned}
              className={`h-5 w-5 rounded border-gray-300 dark:border-gray-600 
                text-blue-500 focus:ring-blue-400/30 dark:focus:ring-blue-500/30
                bg-white dark:bg-gray-700
                ${
                  !driver.franchiseAvailability.canBeAssigned
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
            />
          </div>

          {/* Driver Avatar & Info */}
          <div className="flex items-center">
            <div className="relative">
              <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                <FiUser size={20} />
              </div>
              {driver.is_on_ride && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            <div className="ml-3">
              <div className="flex items-center space-x-2">
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  {driver.name}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    driver.is_on_ride
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {driver.is_on_ride ? "On Ride" : "Available"}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                ID: {driver._id.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        <div
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getAvailabilityBadge(
            driver.franchiseAvailability
          )}`}
        >
          {getAvailabilityText(driver.franchiseAvailability)}
        </div>
      </div>

      {/* Contact & Location Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <FiPhone size={12} className="mr-1.5" />
            Phone
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {driver.phone}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Pincode
          </div>
          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
            <FiMapPin size={12} className="mr-1.5 text-gray-400" />
            {driver.pin_code}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {driver.total_complete_rides || 0}
          </div>
          <div className="text-xs text-blue-500 dark:text-blue-300 mt-1">
            Rides
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            ₹{(driver.total_earning || 0).toLocaleString()}
          </div>
          <div className="text-xs text-emerald-500 dark:text-emerald-300 mt-1">
            Earnings
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {driver.district?.substring(0, 10)}...
          </div>
          <div className="text-xs text-purple-500 dark:text-purple-300 mt-1">
            District
          </div>
        </div>
      </div>

      {/* Franchise Assignment Section */}
      {driver.franchiseAvailability.hasFranchiseInPincode ? (
        <div className="mb-4">
          {/* Franchise Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-700 rounded-xl p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                  <MdBusiness
                    size={14}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    {driver.franchiseAvailability.franchiseInfo?.name}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Will be assigned to this franchise
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowFranchiseDetails(!showFranchiseDetails)}
                className="text-emerald-600 dark:text-emerald-400"
              >
                {showFranchiseDetails ? (
                  <FiChevronUp size={16} />
                ) : (
                  <FiChevronDown size={16} />
                )}
              </button>
            </div>

            {/* Expandable Details */}
            {showFranchiseDetails && (
              <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-700 space-y-2">
                <div className="text-xs text-emerald-700 dark:text-emerald-400">
                  <span className="font-medium">Franchise ID:</span>{" "}
                  {driver.franchiseAvailability.franchiseInfo?.id?.substring(
                    0,
                    8
                  )}
                  ...
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400">
                  <span className="font-medium">Location:</span> Same pincode (
                  {driver.pin_code})
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400">
                  <span className="font-medium">Status:</span> Auto-match
                  available
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl">
          <div className="flex items-center">
            <FiXCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 mr-2" />
            <div className="text-sm font-medium text-amber-800 dark:text-amber-300">
              No franchise in pincode {driver.pin_code}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setShowAssignDropdown(!showAssignDropdown)}
          disabled={!driver.franchiseAvailability.canBeAssigned}
          className={`
            flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium
            transition-all duration-200
            ${
              driver.franchiseAvailability.canBeAssigned
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }
          `}
        >
          <MdOutlineAssignment size={16} className="mr-2" />
          Assign Driver
        </button>
      </div>

      {/* Assign Dropdown */}
      {showAssignDropdown && driver.franchiseAvailability.canBeAssigned && (
        <div className="mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <FiPackage
                  className="text-blue-600 dark:text-blue-400"
                  size={14}
                />
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                Assignment Options
              </div>
            </div>
          </div>

          {/* Quick Assign */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Quick Assign
              </span>
              <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
                Auto-match
              </span>
            </div>
            <button
              onClick={() => {
                if (driver.franchiseAvailability.franchiseInfo) {
                  onAssign(
                    driver._id,
                    driver.franchiseAvailability.franchiseInfo.id
                  );
                }
                setShowAssignDropdown(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 
                border border-emerald-200 dark:border-emerald-700 rounded-lg
                hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-800 rounded">
                  <MdBusiness
                    size={12}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    {driver.franchiseAvailability.franchiseInfo?.name}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    Same pincode • Recommended
                  </div>
                </div>
              </div>
              <FiChevronDown
                size={14}
                className="text-emerald-500 dark:text-emerald-400"
              />
            </button>
          </div>

          {/* Other Options */}
          <div className="p-3">
            <button
              onClick={() => {
                window.location.href = `/franchise-select/${driver._id}`;
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 dark:border-gray-600 
                rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded">
                  <FiDollarSign
                    size={12}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Browse All Franchises
                </span>
              </div>
              <FiChevronDown
                size={14}
                className="text-gray-400 dark:text-gray-500"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDriverCard;
