import React from "react";
import {
  FiX,
  FiUser,
  FiEye,
  FiEdit,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { FaHistory } from "react-icons/fa";

const ActionModal = ({
  franchise,
  commissionSettings,
  onClose,
  onView,
  onEdit,
  onViewHistory,
  onActivate,
  onDeactivate,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Commission Actions
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <FiUser className="text-2xl text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {franchise.name}
            </h4>
            <div className="flex items-center justify-center space-x-2">
              {commissionSettings && commissionSettings.isActive ? (
                <>
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Active
                  </span>
                </>
              ) : (
                <>
                  <FiXCircle className="text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400">
                    {commissionSettings ? "Inactive" : "Not Configured"}
                  </span>
                </>
              )}
            </div>
          </div>

          {commissionSettings && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                    {commissionSettings.admin_commission_rate}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Admin
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {commissionSettings.franchise_commission_rate}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Franchise
                  </div>
                </div>
              </div>
              <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                Last changed by:{" "}
                {commissionSettings.last_changed_by?.name || "System"}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={onView}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
            >
              <FiEye size={16} />
              <span>View</span>
            </button>

            <button
              onClick={onEdit}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors text-sm"
            >
              <FiEdit size={16} />
              <span>Edit</span>
            </button>

            {commissionSettings && (
              <>
                <button
                  onClick={onViewHistory}
                  className="flex items-center justify-center space-x-2 px-4 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-sm"
                >
                  <FaHistory size={16} />
                  <span>History</span>
                </button>

                {commissionSettings.isActive ? (
                  <button
                    onClick={onDeactivate}
                    className="flex items-center justify-center space-x-2 px-4 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm"
                  >
                    <FiXCircle size={16} />
                    <span>Deactivate</span>
                  </button>
                ) : (
                  <button
                    onClick={onActivate}
                    className="flex items-center justify-center space-x-2 px-4 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-sm"
                  >
                    <FiCheckCircle size={16} />
                    <span>Activate</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
