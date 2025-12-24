import React from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import {
  FiUser,
  FiMoreVertical,
  FiEye,
  FiEdit,
  FiMapPin,
  FiTrash2,
} from "react-icons/fi";

const MobileFranchiseCard = ({
  franchise,
  activeMenu,
  openActionMenu,
  handleViewDetails,
  handleAddPincode,
  handleEdit,
  handleDelete,
  getStatusBadge,
  getStatusText,
}) => {
  // NEW: Handle Commission Settings
  const handleCommissionSettings = (franchise) => {
    window.location.href = `/commission-settings/${franchise._id}`;
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
            <FiUser size={16} />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {franchise.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ID: {franchise._id.substring(0, 8)}...
            </div>
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadge(
                franchise.isActive,
                franchise.isApproved
              )}`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-1 ${
                  franchise.isApproved
                    ? franchise.isActive
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-yellow-500"
                }`}
              ></span>
              {getStatusText(franchise.isActive, franchise.isApproved)}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => openActionMenu(franchise._id, e)}
          className="inline-flex items-center p-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          title="More Actions"
        >
          <FiMoreVertical size={14} />
        </button>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">Email</div>
          <div className="text-gray-900 dark:text-white truncate">
            {franchise.email}
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">Phone</div>
          <div className="text-gray-900 dark:text-white">{franchise.phone}</div>
        </div>
      </div>

      {/* Location Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">
            Location
          </div>
          <div className="text-gray-900 dark:text-white">
            {franchise.address?.city || "N/A"},{" "}
            {franchise.address?.state || "N/A"}
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">
            PIN Code
          </div>
          <div className="text-gray-900 dark:text-white">
            {franchise.address?.pincode || "N/A"}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <div className="font-medium text-gray-900 dark:text-white">
            {franchise.total_drivers || 0}
          </div>
          <div className="text-gray-500 dark:text-gray-400">Drivers</div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <div className="font-medium text-gray-900 dark:text-white">
            ₹{(franchise.franchise_earnings || 0).toLocaleString()}
          </div>
          <div className="text-gray-500 dark:text-gray-400">Earnings</div>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <div className="font-medium text-gray-900 dark:text-white">
            {franchise.total_completed_rides || 0}
          </div>
          <div className="text-gray-500 dark:text-gray-400">Rides</div>
        </div>
      </div>

      {/* Action Buttons - Only View and Add Pincode */}
      <div className="flex space-x-2">
        <button
          onClick={() => handleViewDetails(franchise)}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-xs font-medium"
        >
          <FiEye size={12} className="mr-1" />
          View
        </button>
        <button
          onClick={() => handleAddPincode(franchise)}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors text-xs font-medium"
        >
          <FiMapPin size={12} className="mr-1" />
          Add Pincode
        </button>
      </div>

      {/* Dropdown Menu - Only shows options NOT already in the visible buttons */}
      {activeMenu === franchise._id && (
        <div className="absolute right-4 top-16 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
          {/* Edit - Only in dropdown */}
          <button
            onClick={() => handleEdit(franchise)}
            className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
          >
            <FiEdit size={14} />
            <span>Edit</span>
          </button>
          
          {/* Commission Settings - Only in dropdown */}
          <button
            onClick={() => handleCommissionSettings(franchise)}
            className="w-full text-left px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
          >
            <FaIndianRupeeSign size={14} />
            <span>Commission Settings</span>
          </button>
          
          {/* Delete - Only in dropdown */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
            <button
              onClick={() => handleDelete(franchise)}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <FiTrash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFranchiseCard;