import { FiEye, FiTrash2, FiCreditCard } from "react-icons/fi";

const DriverRow = ({ driver, viewDriverDetails, handleDeleteDriver }) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
      {/* Driver Info */}
      <td className="px-4 lg:px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12">
            <img
              className="h-10 w-10 lg:h-12 lg:w-12 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
              src={driver.photo || "https://via.placeholder.com/150"}
              alt={driver.name}
            />
          </div>
          <div className="ml-3 lg:ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {driver.name}
            </div>
            <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
              Joined {driver.joinedDate}
            </div>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-4 lg:px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white">
          {driver.contact.phone || "-"}
        </div>
        <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
          {driver.contact.email || "-"}
        </div>
      </td>

      {/* ETO ID */}
      <td className="px-4 lg:px-6 py-4">
        <div className="flex items-center text-sm text-gray-900 dark:text-white">
          <FiCreditCard className="mr-2 text-gray-400" />
          {driver.etoIdNumber || "-"}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 lg:px-6 py-4 text-center">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            driver.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-1 ${
              driver.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          {driver.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Earnings */}
      <td className="px-4 lg:px-6 py-4 text-center">
        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
          ₹{driver.totalEarnings.toLocaleString()}
        </div>
      </td>

      {/* Rides */}
      <td className="px-4 lg:px-6 py-4 text-center">
        <div className="text-sm text-gray-900 dark:text-white">
          {driver.totalRides}
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 lg:px-6 py-4 text-center">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => viewDriverDetails(driver.id)}
            className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
          >
            <FiEye size={14} className="mr-1" />
            View
          </button>

          <button
            onClick={() => handleDeleteDriver(driver.id)}
            className="inline-flex items-center px-3 py-1 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm"
          >
            <FiTrash2 size={14} className="mr-1" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DriverRow;
