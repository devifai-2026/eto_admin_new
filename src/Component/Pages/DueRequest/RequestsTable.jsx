import React from "react";
import { FiCalendar, FiPhone, FiEye, FiBriefcase } from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";

const RequestsTable = ({ requests, formatDate, getStatusBadge, handleViewDetails, userRole, handleApproveRequest }) => {
  return (
    <table className="w-full min-w-[800px]">
      <thead>
        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
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
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {requests.length > 0 ? (
          requests.map((request) => {
            const isFranchise = request.requester?.type === "Franchise";
            const hasDriverPhoto = !isFranchise && request.requester?.driver_photo;
            
            return (
              <tr
                key={request._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <td className="px-4 lg:px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10 lg:h-12 lg:w-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 flex-shrink-0 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors">
                      {hasDriverPhoto ? (
                        <img
                          src={request.requester.driver_photo}
                          alt={request.requester?.name || "Driver"}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            // Show fallback icon when image fails to load
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = 'h-full w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600';
                            fallbackDiv.innerHTML = '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                            e.target.parentElement.appendChild(fallbackDiv);
                          }}
                        />
                      ) : (
                        <div className={`h-full w-full flex items-center justify-center ${
                          isFranchise 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}>
                          {isFranchise ? (
                            <FiBriefcase className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                          ) : (
                            <FaUser className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {request.requester?.name || "No Name"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <FiPhone size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{request.requester?.phone || "No Phone"}</span>
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {isFranchise ? "Franchise" : "Driver"}
                        {hasDriverPhoto && " • Has Photo"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 lg:px-6 py-4">
                  <div className="flex flex-col">
                    <span className="px-3 py-1 inline-flex items-center rounded-full text-sm font-semibold text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700">
                      <FaIndianRupeeSign size={14} className="mr-1.5" />
                      ₹{(request.dueAmount || 0).toLocaleString()}
                    </span>
                    {request.payableAmount && request.payableAmount !== request.dueAmount && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        Payable: <span className="font-medium">₹{request.payableAmount?.toLocaleString()}</span>
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-4 lg:px-6 py-4">
                  <span className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-lg ${
                    request.requestType === "franchise_weekly_bill"
                      ? "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-200 dark:border-purple-700"
                      : "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-700"
                  }`}>
                    {request.requestType === "franchise_weekly_bill" 
                      ? "Weekly Bill" 
                      : "Driver Due"}
                  </span>
                </td>

                <td className="px-4 lg:px-6 py-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <FiCalendar size={14} className="mr-2 flex-shrink-0 text-gray-400" />
                    <div className="text-sm">
                      <div className="font-medium">
                        {formatDate(request.createdAt)}
                      </div>
                      {request.resolvedAt && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Resolved: {formatDate(request.resolvedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 lg:px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <span className={`px-3 py-1 inline-flex items-center rounded-full text-xs font-medium ${getStatusBadge(request.status || 'pending')}`}>
                      <span className="w-2 h-2 rounded-full mr-2 bg-current opacity-75"></span>
                      {(request.status || 'pending')?.charAt(0).toUpperCase() + (request.status || 'pending')?.slice(1)}
                    </span>
                    {request.approvalInfo && (
                      <div className="text-xs flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        {request.approvalInfo.approvedByFranchise && (
                          <span className="flex items-center">
                            <svg className="w-3 h-3 text-green-500 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Franchise
                          </span>
                        )}
                        {request.approvalInfo.approvedByFranchise && request.approvalInfo.approvedByAdmin && (
                          <span>•</span>
                        )}
                        {request.approvalInfo.approvedByAdmin && (
                          <span className="flex items-center">
                            <svg className="w-3 h-3 text-blue-500 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Admin
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-4 lg:px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleViewDetails(request._id)}
                      className="inline-flex items-center justify-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 text-sm font-medium group/btn"
                      title="View Details"
                    >
                      <FiEye size={14} className="mr-1.5 group-hover/btn:animate-pulse" />
                      View
                    </button>
                    
                    {/* Show approve button for pending requests based on user role and approval level */}
                    {request.status === "pending" && (
                      <>
                        {/* Admin can approve any request */}
                        {userRole === "admin" && (
                          <button
                            onClick={() => handleApproveRequest(request._id, { note: "Approved by Admin" })}
                            className="inline-flex items-center justify-center px-3 py-1.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 text-xs font-medium group/approve"
                          >
                            <svg className="w-3.5 h-3.5 mr-1.5 group-hover/approve:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
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
                            className="inline-flex items-center justify-center px-3 py-1.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 text-xs font-medium group/approve"
                          >
                            <svg className="w-3.5 h-3.5 mr-1.5 group-hover/approve:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Approve
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={6} className="py-12 sm:py-16 text-center">
              <div className="text-gray-300 dark:text-gray-600 text-6xl sm:text-7xl mb-4 sm:mb-6">
                💰
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                No due requests found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                There are no pending due requests matching your search criteria at the moment.
              </p>
              <div className="mt-6">
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  All requests are processed
                </div>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RequestsTable;