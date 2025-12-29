import React from "react";
import { FiCalendar, FiPhone, FiUser, FiEye, FiBriefcase } from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";

const RequestsTable = ({ requests, formatDate, getStatusBadge, handleViewDetails, userRole, handleApproveRequest }) => {
  return (
    <table className="w-full min-w-[800px]">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Requester
          </th>
          <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Amount
          </th>
          <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Type
          </th>
          <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Requested At
          </th>
          <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Status
          </th>
          <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
        {requests.length > 0 ? (
          requests.map((request) => (
            <tr
              key={request._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-4 lg:px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                    {request.requester?.type === "Franchise" ? (
                      <FiBriefcase size={20} />
                    ) : (
                      <FiUser size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {request.requester?.name || "No Name"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <FiPhone size={14} className="mr-1" />
                      {request.requester?.phone || "No Phone"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {request.requester?.type === "Franchise" ? "Franchise" : "Driver"}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 lg:px-6 py-4">
                <span className="px-3 py-1 inline-flex items-center rounded-full text-sm font-semibold text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200">
                  <FaIndianRupeeSign size={14} className="mr-1" />
                  ₹{(request.dueAmount || 0).toLocaleString()}
                </span>
                {request.payableAmount && request.payableAmount !== request.dueAmount && (
                  <p className="text-xs text-gray-500 mt-1">
                    Payable: ₹{request.payableAmount?.toLocaleString()}
                  </p>
                )}
              </td>

              <td className="px-4 lg:px-6 py-4">
                <span className="px-2 py-1 inline-flex text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                  {request.requestType === "franchise_weekly_bill" 
                    ? "Weekly Bill" 
                    : "Driver Due"}
                </span>
              </td>

              <td className="px-4 lg:px-6 py-4">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FiCalendar size={14} className="mr-2" />
                  <div className="text-sm">
                    <div className="font-medium">
                      {formatDate(request.createdAt)}
                    </div>
                    {request.resolvedAt && (
                      <div className="text-xs text-gray-500">
                        Resolved: {formatDate(request.resolvedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-4 lg:px-6 py-4">
                <div className="flex flex-col gap-1">
                  <span className={`px-3 py-1 inline-flex items-center rounded-full text-xs font-medium ${getStatusBadge(request.status || 'pending')}`}>
                    <span className="w-2 h-2 rounded-full mr-2 bg-current opacity-50"></span>
                    {(request.status || 'pending')?.charAt(0).toUpperCase() + (request.status || 'pending')?.slice(1)}
                  </span>
                  {request.approvalInfo && (
                    <div className="text-xs text-gray-500">
                      {request.approvalInfo.approvedByFranchise && "✓ Franchise"}
                      {request.approvalInfo.approvedByFranchise && request.approvalInfo.approvedByAdmin && " • "}
                      {request.approvalInfo.approvedByAdmin && "✓ Admin"}
                    </div>
                  )}
                </div>
              </td>

              <td className="px-4 lg:px-6 py-4">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleViewDetails(request._id)}
                    className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
                    title="View Details"
                  >
                    <FiEye size={14} className="mr-1" />
                    View
                  </button>
                  
                  {/* Show approve button for pending requests based on user role and approval level */}
                  {request.status === "pending" && (
                    <>
                      {/* Admin can approve any request */}
                      {userRole === "admin" && (
                        <button
                          onClick={() => handleApproveRequest(request._id, { note: "Approved by Admin" })}
                          className="inline-flex items-center px-3 py-1 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-xs font-medium"
                        >
                          Approve
                        </button>
                      )}
                      
                      {/* Franchise can approve driver requests that need franchise approval first */}
                      {userRole === "franchise" && 
                       request.requestType === "driver_due" &&
                       request.approvalInfo?.approvalLevel === "franchise_first" &&
                       !request.approvalInfo?.approvedByFranchise && (
                        <button
                          onClick={() => handleApproveRequest(request._id, { note: "Approved by Franchise" })}
                          className="inline-flex items-center px-3 py-1 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-xs font-medium"
                        >
                          Approve
                        </button>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="py-8 sm:py-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4">
                💰
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                No due requests found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                There are no due requests matching your search criteria
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RequestsTable;