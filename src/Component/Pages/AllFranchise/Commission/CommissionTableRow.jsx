import React from "react";
import {
  FiUser,
  FiEye,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { FaHistory } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

const CommissionTableRow = ({
  franchise,
  commissionSettings,
  activeMenu,
  openActionMenu,
  handleViewDetails,
  handleEdit,
  handleViewHistory,
  getStatusBadge,
  getStatusText,
  getCommissionRates,
}) => {
  const rates = getCommissionRates({ commission_settings: commissionSettings });
  const lastUpdated = commissionSettings
    ? new Date(commissionSettings.updatedAt).toLocaleDateString()
    : "Never";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
      {/* Franchise Info */}
      <td className="px-4 lg:px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white">
            <FiUser size={20} />
          </div>
          <div className="ml-3 lg:ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {franchise.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {franchise.email}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {franchise.total_drivers || 0} drivers
            </div>
          </div>
        </div>
      </td>

      {/* Commission Rates */}
      <td className="px-4 lg:px-6 py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Admin:
            </span>
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              {rates.admin}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Franchise:
            </span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {rates.franchise}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Driver:
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {rates.admin !== "N/A"
                ? 100 - rates.admin - rates.franchise
                : "N/A"}
              %
            </span>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 lg:px-6 py-4">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
            commissionSettings
          )}`}
        >
          {commissionSettings && commissionSettings.isActive ? (
            <FiCheckCircle className="mr-1" size={12} />
          ) : (
            <FiXCircle className="mr-1" size={12} />
          )}
          {getStatusText(commissionSettings)}
        </div>
        {commissionSettings && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            By: {commissionSettings.last_changed_by?.name || "System"}
          </div>
        )}
      </td>

      {/* Last Updated */}
      <td className="px-4 lg:px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white">
          {lastUpdated}
        </div>
        {commissionSettings && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {commissionSettings.settings_history?.length || 0} changes
          </div>
        )}
      </td>

      {/* Actions - Simple buttons with labels below */}
      <td className="px-4 lg:px-6 py-4">
        <div className="grid grid-cols-3 gap-1.5">
          {/* View Details */}
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
          
          {/* Edit Commission */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleEdit(franchise)}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors mb-1"
              title="Edit Commission"
            >
              <FaIndianRupeeSign size={14} />
            </button>
            <span className="text-xs text-gray-600 dark:text-gray-400">Edit</span>
          </div>
          
          {/* View History */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleViewHistory(franchise)}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors mb-1"
              title="View History"
            >
              <FaHistory size={14} />
            </button>
            <span className="text-xs text-gray-600 dark:text-gray-400">History</span>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default CommissionTableRow;