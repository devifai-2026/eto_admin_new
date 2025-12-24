import React from "react";
import {
  FiUser,
  FiMoreVertical,
  FiEye,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { FaHistory } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

const MobileCommissionCard = ({
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
    <div className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white">
            <FiUser size={16} />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {franchise.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {franchise.email}
            </div>
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadge(
                commissionSettings
              )}`}
            >
              {commissionSettings && commissionSettings.isActive ? (
                <FiCheckCircle className="mr-1" size={10} />
              ) : (
                <FiXCircle className="mr-1" size={10} />
              )}
              {getStatusText(commissionSettings)}
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

      {/* Commission Rates */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
          <div className="font-medium text-red-600 dark:text-red-400">
            {rates.admin}%
          </div>
          <div className="text-gray-500 dark:text-gray-400">Admin</div>
        </div>
        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
          <div className="font-medium text-green-600 dark:text-green-400">
            {rates.franchise}%
          </div>
          <div className="text-gray-500 dark:text-gray-400">Franchise</div>
        </div>
        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <div className="font-medium text-blue-600 dark:text-blue-400">
            {rates.admin !== "N/A"
              ? 100 - rates.admin - rates.franchise
              : "N/A"}
            %
          </div>
          <div className="text-gray-500 dark:text-gray-400">Driver</div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Last updated: {lastUpdated}
        {commissionSettings && (
          <span className="ml-2">
            • {commissionSettings.settings_history?.length || 0} changes
          </span>
        )}
      </div>

      {/* Action Buttons - All visible (No duplicate in dropdown) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleViewDetails(franchise)}
          className="inline-flex flex-col items-center justify-center p-2 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        >
          <FiEye size={14} />
          <span className="text-xs mt-1">View</span>
        </button>
        
        <button
          onClick={() => handleEdit(franchise)}
          className="inline-flex flex-col items-center justify-center p-2 border border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
        >
          <FaIndianRupeeSign size={14} />
          <span className="text-xs mt-1">Edit</span>
        </button>
        
        <button
          onClick={() => handleViewHistory(franchise)}
          className="inline-flex flex-col items-center justify-center p-2 border border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
        >
          <FaHistory size={14} />
          <span className="text-xs mt-1">History</span>
        </button>
      </div>

      {/* Dropdown Menu - Only shows Activate/Deactivate actions */}
      {activeMenu === franchise._id && (
        <div className="absolute right-4 top-16 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
          {commissionSettings ? (
            commissionSettings.isActive ? (
              // Deactivate option
              <button
                onClick={() => {
                  // You'll need to pass handleDeactivate prop from parent
                  // handleDeactivate(franchise);
                  openActionMenu(null, e); // Close dropdown
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <FiXCircle size={14} />
                <span>Deactivate</span>
              </button>
            ) : (
              // Activate option
              <button
                onClick={() => {
                  // You'll need to pass handleActivate prop from parent
                  // handleActivate(franchise);
                  openActionMenu(null, e); // Close dropdown
                }}
                className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <FiCheckCircle size={14} />
                <span>Activate</span>
              </button>
            )
          ) : (
            // If no commission settings, show "Configure" option
            <button
              onClick={() => {
                handleEdit(franchise);
                openActionMenu(null, e); // Close dropdown
              }}
              className="w-full text-left px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <FaIndianRupeeSign size={14} />
              <span>Configure Now</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileCommissionCard;