import React from "react";
import {
  FiUser,
  FiMoreVertical,
  FiEye,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { FaHistory } from "react-icons/fa";

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

      {/* Actions */}
      <td className="px-4 lg:px-6 py-4">
        <div className="flex flex-col items-center space-y-2">
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
                  className="w-full text-left px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FiDollarSign size={14} />
                  <span>Edit Commission</span>
                </button>
                <button
                  onClick={() => handleViewHistory(franchise)}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FaHistory size={14} />
                  <span>View History</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default CommissionTableRow;
