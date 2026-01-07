import {
  FiEye,
  FiTrash2,
  FiCreditCard,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import loginAPI from "../../../apis/Login";

const DriverTable = ({
  drivers,
  filteredDrivers,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  viewDriverDetails,
  handleDeleteDriver,
  loading,
}) => {
  // Calculate pagination values
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDrivers = filteredDrivers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Get current user type
  const userType = loginAPI.getUserType();

  const navigate = useNavigate();

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Function to get status badge styling based on status
  const getStatusBadge = (status) => {
    const statusLower = (status || "").toLowerCase();

    switch (statusLower) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "blocked":
      case "suspended":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "on_ride":
      case "busy":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "available":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "offline":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Function to get status dot color
  const getStatusDotColor = (status) => {
    const statusLower = (status || "").toLowerCase();

    switch (statusLower) {
      case "active":
      case "available":
        return "bg-green-500";
      case "inactive":
        return "bg-red-500";
      case "pending":
      case "pending_approval":
        return "bg-yellow-500";
      case "blocked":
      case "suspended":
        return "bg-gray-500";
      case "on_ride":
      case "busy":
        return "bg-blue-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  // Function to format status text for display
  const formatStatusText = (status) => {
    if (!status) return "Unknown";

    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "pending":
      case "pending_approval":
        return "Pending";
      case "blocked":
      case "suspended":
        return "Blocked";
      case "on_ride":
      case "busy":
        return "On Ride";
      case "available":
        return "Available";
      case "offline":
        return "Offline";
      default:
        // Capitalize first letter of each word
        return status
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!currentDrivers || currentDrivers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
            No drivers found
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Driver List ({filteredDrivers.length} drivers)
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Showing {currentDrivers.length} drivers on this page
        </p>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden">
        {currentDrivers.map((driver, index) => (
          <div
            key={index}
            className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img
                    className="h-10 w-10 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                    src={driver.driver_photo}
                    alt={driver.name}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {driver.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Joined {driver.joinedDate || "N/A"}
                  </div>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                  driver.status
                )}`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-1 ${getStatusDotColor(
                    driver.status
                  )}`}
                ></span>
                {formatStatusText(driver.status)}
              </span>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
              <div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">
                  Phone
                </div>
                <div className="text-gray-900 dark:text-white">
                  {driver.contact?.phone || "-"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">
                  ETO ID
                </div>
                <div className="text-gray-900 dark:text-white">
                  {driver.etoIdNumber || "-"}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">
                  Earnings
                </div>
                <div className="font-semibold text-green-600 dark:text-green-400">
                  ₹{driver.totalEarnings?.toLocaleString() || "0"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">
                  Total Rides
                </div>
                <div className="text-gray-900 dark:text-white">
                  {driver.totalRides || "0"}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => viewDriverDetails(driver.userId || driver.id)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
              >
                <FiEye size={14} className="mr-1" />
                View
              </button>
              <button
                onClick={() => handleDeleteDriver(driver)} // Pass full driver object
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm"
              >
                <FiTrash2 size={14} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                ETO ID
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Earnings
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Rides
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {currentDrivers.map((driver, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {/* Driver Info */}
                <td className="px-4 lg:px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12">
                      <img
                        className="h-10 w-10 lg:h-12 lg:w-12 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover"
                        src={driver.driver_photo}
                        alt={driver.name}
                      />
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {driver.name}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        Joined {driver.joinedDate || "N/A"}
                      </div>
                      {driver.status && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Status:{" "}
                          <span className="font-medium">
                            {formatStatusText(driver.status)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-4 lg:px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {driver.contact?.phone || "-"}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    {driver.contact?.email || "-"}
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
                  <div className="flex flex-col items-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        driver.status
                      )}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(
                          driver.status
                        )}`}
                      ></span>
                      {formatStatusText(driver.status)}
                    </span>
                    {driver.availability && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {driver.availability}
                      </span>
                    )}
                  </div>
                </td>

                {/* Earnings */}
                <td className="px-4 lg:px-6 py-4 text-center">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ₹{driver.totalEarnings?.toLocaleString() || "0"}
                  </div>
                </td>

                {/* Rides */}
                <td className="px-4 lg:px-6 py-4 text-center">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {driver.totalRides || "0"}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 lg:px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() =>
                        viewDriverDetails(driver.userId || driver.id)
                      }
                      className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
                      title="View driver details"
                    >
                      <FiEye size={14} className="mr-1" />
                      View
                    </button>
                    {userType === "admin" && (
                      <>
                        <button
                          onClick={() =>
                            navigate(`/update-driver/${driver.userId}`)
                          }
                          className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
                          title="Edit driver"
                        >
                          <FiEdit size={14} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDriver(driver)}
                          className="inline-flex items-center px-3 py-1 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm"
                          title="Delete driver"
                        >
                          <FiTrash2 size={14} className="mr-1" />
                          Delete
                        </button>{" "}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredDrivers.length)}
              </span>{" "}
              of <span className="font-medium">{filteredDrivers.length}</span>{" "}
              results
            </p>

            <div className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
              >
                <FiChevronLeft size={14} className="mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1 mx-1 sm:mx-2">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <FiChevronRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverTable;
