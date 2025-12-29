import React from "react";
import { FiCalendar, FiPhone, FiUser, FiEye, FiBriefcase, FiCheck } from "react-icons/fi";

const RequestsCards = ({ 
  requests, 
  formatDate, 
  getStatusBadge, 
  handleViewDetails, 
  userRole,
  handleApproveRequest 
}) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">💰</div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
          No due requests found
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          There are no due requests matching your search criteria
        </p>
      </div>
    );
  }

  return (
    <>
      {requests.map((request) => (
        <div 
          key={request._id}
          className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {/* Requester Info */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                {request.requester?.type === "Franchise" ? (
                  <FiBriefcase size={16} />
                ) : (
                  <FiUser size={16} />
                )}
              </div>
              <div className="ml-3">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {request.requester?.name || "No Name"}
                  </p>
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    {request.requester?.type === "Franchise" ? "Franchise" : "Driver"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <FiPhone size={12} className="mr-1" />
                  {request.requester?.phone || "No Phone"}
                </p>
              </div>
            </div>
            <span className={`px-2 py-1 inline-flex items-center rounded-full text-xs font-medium ${getStatusBadge(request.status || 'pending')}`}>
              <span className="w-2 h-2 rounded-full mr-1 bg-current opacity-50"></span>
              {(request.status || 'pending')?.charAt(0).toUpperCase() + (request.status || 'pending')?.slice(1)}
            </span>
          </div>

          {/* Amount, Type, and Date */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Amount</div>
              <div className="text-green-600 dark:text-green-400 font-semibold text-sm">
                ₹{(request.dueAmount || 0).toLocaleString()}
              </div>
              {request.payableAmount && request.payableAmount !== request.dueAmount && (
                <div className="text-xs text-gray-500">
                  Payable: ₹{request.payableAmount?.toLocaleString()}
                </div>
              )}
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Type</div>
              <div className="text-gray-900 dark:text-white text-sm">
                {request.requestType === "franchise_weekly_bill" 
                  ? "Weekly Bill" 
                  : "Driver Due"}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-gray-500 dark:text-gray-400 text-xs">Requested</div>
            <div className="text-gray-900 dark:text-white text-sm flex items-center">
              <FiCalendar size={12} className="mr-1" />
              {formatDate(request.createdAt)}
            </div>
            {request.resolvedAt && (
              <div className="text-xs text-gray-500 mt-1">
                Resolved: {formatDate(request.resolvedAt)}
              </div>
            )}
          </div>

          {/* Approval Info */}
          {request.approvalInfo && (
            <div className="mb-3">
              <div className="text-gray-500 dark:text-gray-400 text-xs">Approval Status</div>
              <div className="text-xs flex items-center gap-2 mt-1">
                {request.approvalInfo.approvedByFranchise && (
                  <span className="inline-flex items-center text-green-600 bg-green-100 px-2 py-0.5 rounded">
                    <FiCheck size={10} className="mr-1" /> Franchise
                  </span>
                )}
                {request.approvalInfo.approvedByAdmin && (
                  <span className="inline-flex items-center text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                    <FiCheck size={10} className="mr-1" /> Admin
                  </span>
                )}
                {!request.approvalInfo.approvedByFranchise && !request.approvalInfo.approvedByAdmin && (
                  <span className="text-yellow-600">Pending Approval</span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => handleViewDetails(request._id)}
              className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-xs font-medium"
              title="View Details"
            >
              <FiEye size={12} className="mr-1" />
              View
            </button>
            
            {/* Show approve button for pending requests */}
            {request.status === "pending" && (
              <>
                {/* Admin can approve any request */}
                {userRole === "admin" && (
                  <button
                    onClick={() => handleApproveRequest(request._id, { note: "Approved by Admin" })}
                    className="inline-flex items-center px-3 py-1 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-xs font-medium"
                  >
                    <FiCheck size={12} className="mr-1" />
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
                    <FiCheck size={12} className="mr-1" />
                    Approve
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default RequestsCards;