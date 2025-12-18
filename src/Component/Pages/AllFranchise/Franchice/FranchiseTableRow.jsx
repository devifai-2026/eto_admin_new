import React from "react";
import {
  FiUser,
  FiMoreVertical,
  FiEye,
  FiEdit,
  FiMapPin,
  FiTrash2,
  FiDollarSign,
} from "react-icons/fi";

const FranchiseTableRow = ({
  franchise,
  activeMenu,
  openActionMenu,
  handleViewDetails,
  handleEdit,
  handleAddPincode,
  handleDelete,
  getStatusBadge,
  getStatusText,
}) => {
  // NEW: Handle Commission Settings
  const handleCommissionSettings = (franchise) => {
    // Navigate to commission settings page
    window.location.href = `/commission-settings/${franchise._id}`;
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
      {/* Franchise Info */}
      <td className="px-4 lg:px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
            <FiUser size={20} />
          </div>
          <div className="ml-3 lg:ml-4">
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
      </td>

      {/* Contact */}
      <td className="px-4 lg:px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white">
          {franchise.email}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {franchise.phone}
        </div>
      </td>

      {/* Statistics */}
      <td className="px-4 lg:px-6 py-4">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Drivers:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {franchise.total_drivers || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Earnings:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              ₹{(franchise.franchise_earnings || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Rides:</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {franchise.total_completed_rides || 0}
            </span>
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 lg:px-6 py-4">
        <div className="flex flex-col items-center space-y-2">
          {/* Three dots menu */}
          <div className="relative">
            <button
              onClick={(e) => openActionMenu(franchise._id, e)}
              className="inline-flex items-center p-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              title="More Actions"
            >
              <FiMoreVertical size={16} />
            </button>

            {/* Dropdown Menu */}
            {activeMenu === franchise._id && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleViewDetails(franchise)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FiEye size={14} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleEdit(franchise)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FiEdit size={14} />
                  <span>Edit</span>
                </button>
                {/* NEW: Commission Settings Option */}
                <button
                  onClick={() => handleCommissionSettings(franchise)}
                  className="w-full text-left px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FiDollarSign size={14} />
                  <span>Commission Settings</span>
                </button>
                <button
                  onClick={() => handleAddPincode(franchise)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FiMapPin size={14} />
                  <span>Add Pincode</span>
                </button>
                <button
                  onClick={() => handleDelete(franchise)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FiTrash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default FranchiseTableRow;
