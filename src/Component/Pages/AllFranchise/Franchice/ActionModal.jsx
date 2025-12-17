import React from "react";
import { FiX, FiUser, FiEye, FiEdit, FiMapPin, FiTrash2 } from "react-icons/fi";

const ActionModal = ({
  franchise,
  onClose,
  onView,
  onEdit,
  onAddPincode,
  onDelete,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Franchise Actions
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
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FiUser className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {franchise.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ID: {franchise._id.substring(0, 8)}...
            </p>
          </div>

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
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-sm"
            >
              <FiEdit size={16} />
              <span>Edit</span>
            </button>

            <button
              onClick={onAddPincode}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors text-sm"
            >
              <FiMapPin size={16} />
              <span>Add Pincode</span>
            </button>

            <button
              onClick={onDelete}
              className="flex items-center justify-center space-x-2 px-4 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm"
            >
              <FiTrash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
