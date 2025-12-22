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
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700">
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
  <div className="grid grid-cols-3 gap-1.5">
    {/* Column 1 */}
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleViewDetails(franchise)}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors mb-1"
        title="View Details"
      >
        <FiEye size={14} />
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400">View</span>
    </div>
    
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleEdit(franchise)}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors mb-1"
        title="Edit"
      >
        <FiEdit size={14} />
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400">Edit</span>
    </div>
    
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleCommissionSettings(franchise)}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors mb-1"
        title="Commission"
      >
        <FaIndianRupeeSign size={14} />
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400">Commission</span>
    </div>
    
    {/* Column 2 */}
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleAddPincode(franchise)}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors mb-1"
        title="Pincode"
      >
        <FiMapPin size={14} />
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400">Pincode</span>
    </div>
    
    <div className="flex flex-col items-center col-span-2">
      <button
        onClick={() => handleDelete(franchise)}
        className="w-full h-8 rounded-lg flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors mb-1"
        title="Delete"
      >
        <FiTrash2 size={14} />
        <span className="ml-1 text-xs font-medium">Delete</span>
      </button>
      <span className="text-xs text-gray-600 dark:text-gray-400">Remove franchise</span>
    </div>
  </div>
</td>
    </tr>
  );
};

export default FranchiseTableRow;