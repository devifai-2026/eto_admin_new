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

const DriversWithoutFranchiseTableRow = ({
  driver,
  selectedDrivers,
  onSelect,
  onAssign,
}) => {
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

  // Availability icon
  const getAvailabilityIcon = (availability) => {
    if (!availability.canBeAssigned) {
      return <FiXCircle className="w-3 h-3 mr-1.5" />;
    } else if (availability.hasFranchiseInPincode) {
      return <FiCheckCircle className="w-3 h-3 mr-1.5" />;
    } else {
      return <FiInfo className="w-3 h-3 mr-1.5" />;
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

  // Status badge
  const getStatusBadge = (isOnRide) => {
    return isOnRide
      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700"
      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
  };

  return (
    <tr className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 border-b border-gray-100 dark:border-gray-700">
      {/* Selection Checkbox */}
      <td className="px-6 py-4">
        <div className="relative">
          <input
            type="checkbox"
            checked={selectedDrivers.includes(driver._id)}
            onChange={() => onSelect(driver._id)}
            disabled={!driver.franchiseAvailability.canBeAssigned}
            className={`h-4 w-4 rounded border-gray-300 dark:border-gray-600 
              text-blue-500 focus:ring-blue-400/30 dark:focus:ring-blue-500/30
              bg-white dark:bg-gray-700 cursor-pointer transition-all
              ${
                !driver.franchiseAvailability.canBeAssigned
                  ? "opacity-40 cursor-not-allowed"
                  : "group-hover:border-blue-400 dark:group-hover:border-blue-500"
              }`}
          />
          {driver.franchiseAvailability.canBeAssigned && (
            <div className="absolute -inset-1 rounded-lg bg-blue-50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
          )}
        </div>
      </td>

      {/* Driver Info */}
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="relative">
            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <FiUser size={18} />
            </div>
            {driver.is_on_ride && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>
          <div className="ml-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {driver.name}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                  driver.is_on_ride
                )}`}
              >
                {driver.is_on_ride ? "On Ride" : "Available"}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              ID: {driver._id.substring(0, 8)}...
            </div>
            <div
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium mt-2 ${getAvailabilityBadge(
                driver.franchiseAvailability
              )}`}
            >
              {getAvailabilityIcon(driver.franchiseAvailability)}
              {getAvailabilityText(driver.franchiseAvailability)}
            </div>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-6 py-4">
        <div className="space-y-1.5">
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg mr-2">
              <FiPhone size={12} className="text-gray-600 dark:text-gray-300" />
            </div>
            <span className="font-medium">{driver.phone}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
            {driver.email}
          </div>
        </div>
      </td>

      {/* Location */}
      <td className="px-6 py-4">
        <div className="space-y-1.5">
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg mr-2">
              <FiMapPin
                size={12}
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
            <span className="font-medium">{driver.pin_code}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {driver.district}
            {driver.village && ` • ${driver.village}`}
          </div>
        </div>
      </td>

      {/* Franchise Assignment */}
      <td className="px-6 py-4">
        {driver.franchiseAvailability.hasFranchiseInPincode ? (
          <div className="space-y-3">
            {/* Franchise Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-700 rounded-xl p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
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
                      Franchise ID:{" "}
                      {driver.franchiseAvailability.franchiseInfo?.id?.substring(
                        0,
                        8
                      )}
                      ...
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowFranchiseDetails(!showFranchiseDetails)}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
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
                    <span className="font-medium">Location Match:</span> Same
                    pincode ({driver.pin_code})
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium">Status:</span> Ready for
                    immediate assignment
                  </div>
                </div>
              )}

              {/* Assignment Indicator */}
              <div className="mt-2 flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                <div className="flex-1 h-px bg-emerald-200 dark:bg-emerald-700"></div>
                <span className="px-2">Auto-assign available</span>
                <div className="flex-1 h-px bg-emerald-200 dark:bg-emerald-700"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl">
            <FiXCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-amber-800 dark:text-amber-300">
              No Franchise in Area
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Pincode: {driver.pin_code}
            </div>
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex justify-center">
          <div className="relative">
            <button
              onClick={() => setShowAssignDropdown(!showAssignDropdown)}
              disabled={!driver.franchiseAvailability.canBeAssigned}
              className={`
                inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 transform hover:scale-[1.02]
                ${
                  driver.franchiseAvailability.canBeAssigned
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }
              `}
            >
              <MdOutlineAssignment size={16} className="mr-2" />
              Assign
            </button>

            {/* Assign Dropdown */}
            {showAssignDropdown &&
              driver.franchiseAvailability.canBeAssigned && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowAssignDropdown(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-b border-blue-200 dark:border-blue-700">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                          <FiPackage
                            className="text-blue-600 dark:text-blue-400"
                            size={16}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Assign Driver
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                            {driver.name} • PIN: {driver.pin_code}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Assign Option */}
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Quick Assign
                        </span>
                        <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
                          Recommended
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        Assign to franchise in same pincode
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
                        hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors group"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-800 rounded">
                            <FiPackage
                              size={12}
                              className="text-emerald-600 dark:text-emerald-400"
                            />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                              {driver.franchiseAvailability.franchiseInfo?.name}
                            </div>
                            <div className="text-xs text-emerald-600 dark:text-emerald-400">
                              Same pincode • Auto-match
                            </div>
                          </div>
                        </div>
                        <FiChevronDown
                          size={14}
                          className="text-emerald-500 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform"
                        />
                      </button>
                    </div>

                    {/* Alternative Options */}
                    <div className="p-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Other Options
                      </div>
                      <button
                        onClick={() => {
                          window.location.href = `/franchise-select/${driver._id}`;
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 dark:border-gray-600 
                        rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors mb-2 group"
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
                          className="text-gray-400 dark:text-gray-500 group-hover:translate-x-0.5 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default DriversWithoutFranchiseTableRow;
