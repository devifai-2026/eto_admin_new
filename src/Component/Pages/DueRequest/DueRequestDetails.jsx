import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { dueRequestAPI } from "../../../apis/DueRequest";
import loginAPI from "../../../apis/Login";
import Breadcrumbs from "../../../Component/Breadcrumbs/BreadCrumbs";
import { Helmet } from "react-helmet";
import LoadingState from "../AllFranchise/Franchice/LoadingState";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiCalendar,
  FiPhone,
  FiUser,
  FiBriefcase,
  FiDollarSign,
  FiFileText,
  FiCheck,
  FiX,
  FiClock,
  FiCreditCard,
  FiImage,
  FiDownload
} from "react-icons/fi";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

const DueRequestDetails = () => {
  const { dueRequestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [dueRequest, setDueRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Get current user info
  const getCurrentUserInfo = () => {
    const user = loginAPI.getCurrentUser();
    const userType = loginAPI.getUserType();
    
    return {
      user,
      userType,
      userId: user?._id || user?.id,
    };
  };

  useEffect(() => {
    fetchDueRequestDetails();
  }, [dueRequestId]);

  const fetchDueRequestDetails = async () => {
    try {
      setLoading(true);
      
      // Check if data is passed via navigation state
      if (location.state?.dueRequest) {
        setDueRequest(location.state.dueRequest);
        const { userType } = getCurrentUserInfo();
        setUserRole(userType);
        setLoading(false);
        return;
      }

      // Fetch from API if not in state
      const response = await dueRequestAPI.getDueRequestById(dueRequestId);
      
      // Handle different response structures
      const requestData = response.data?.dueRequest || response.data || response;
      setDueRequest(requestData);
      
      const { userType } = getCurrentUserInfo();
      setUserRole(userType);
    } catch (error) {
      console.error("Error fetching due request details:", error);
      toast.error("Failed to load due request details");
      navigate("/due-request");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      const { userType, userId } = getCurrentUserInfo();
      
      const approvalData = {
        approverId: userId,
        userType,
        note: `Approved by ${userType}`,
      };
      
      await dueRequestAPI.approveDueRequest(dueRequestId, approvalData);
      toast.success("Request approved successfully!");
      fetchDueRequestDetails();
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error(error.response?.data?.message || "Failed to approve request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectNote.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setActionLoading(true);
      const { userType, userId } = getCurrentUserInfo();
      
      const rejectionData = {
        approverId: userId,
        userType,
        note: rejectNote,
        status: "rejected",
      };
      
      // Note: You may need to create a separate reject API or use approve with status: 'rejected'
      await dueRequestAPI.approveDueRequest(dueRequestId, rejectionData);
      
      toast.success("Request rejected successfully!");
      setShowRejectModal(false);
      setRejectNote("");
      fetchDueRequestDetails();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error(error.response?.data?.message || "Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium inline-flex items-center";
    
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaRegCheckCircle className="mr-2" />;
      case "rejected":
        return <FaRegTimesCircle className="mr-2" />;
      default:
        return <FiClock className="mr-2" />;
    }
  };

  const canTakeAction = () => {
    if (!dueRequest || dueRequest.status !== "pending") return false;
    
    const { userType } = getCurrentUserInfo();
    
    if (userType === "admin") return true;
    
    if (userType === "franchise") {
      return (
        dueRequest.requestType === "driver_due" &&
        dueRequest.approvalInfo?.approvalLevel === "franchise_first" &&
        !dueRequest.approvalInfo?.approvedByFranchise
      );
    }
    
    return false;
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!dueRequest) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Due Request Not Found
          </h2>
          <button
            onClick={() => navigate("/due-request")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to Due Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Due Request Details | {dueRequestId}</title>
      </Helmet>
      
      <div className="max-w-6xl mx-auto">
        {/* Header with Breadcrumbs and Back Button */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/due-request")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Due Requests
            </button>
            
            <div className="flex items-center gap-3">
              <span className={getStatusBadge(dueRequest.status)}>
                {getStatusIcon(dueRequest.status)}
                {dueRequest.status?.charAt(0).toUpperCase() + dueRequest.status?.slice(1)}
              </span>
              
              {canTakeAction() && (
                <div className="flex gap-2">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCheck className="mr-2" />
                    {actionLoading ? "Processing..." : "Approve"}
                  </button>
                  
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiX className="mr-2" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <Breadcrumbs />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Request Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <FiFileText className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Request Type
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dueRequest.requestType === "franchise_weekly_bill" 
                      ? "Weekly Bill Payment" 
                      : "Driver Due Payment"}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <FaIndianRupeeSign className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Amount
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(dueRequest.dueAmount)}
                  </p>
                  {dueRequest.payableAmount && dueRequest.payableAmount !== dueRequest.dueAmount && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Payable: {formatCurrency(dueRequest.payableAmount)}
                    </p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <FiCalendar className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Requested On
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(dueRequest.createdAt)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <FiCreditCard className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Payment Method
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {dueRequest.paymentMethod || "Not Specified"}
                  </p>
                </div>
              </div>
              
              {/* Notes Section */}
              {dueRequest.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-3">
                    <FiFileText className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Notes
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {dueRequest.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Requester Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Requester Information
              </h2>
              
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                  {dueRequest.requester?.type === "Franchise" ? (
                    <FiBriefcase size={24} />
                  ) : (
                    <FiUser size={24} />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {dueRequest.requester?.name || "No Name"}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      {dueRequest.requester?.type || "Unknown"}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {dueRequest.requester?.phone && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FiPhone className="mr-2" />
                        <span>{dueRequest.requester.phone}</span>
                      </div>
                    )}
                    
                    {dueRequest.requester?.email && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>{dueRequest.requester.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Bill Details (if applicable) */}
            {dueRequest.requestType === "franchise_weekly_bill" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  Weekly Bill Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <FiCalendar className="text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Week Period
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-white">
                      {dueRequest.weekStartDate ? formatDate(dueRequest.weekStartDate).split(',')[0] : "N/A"} - 
                      {dueRequest.weekEndDate ? formatDate(dueRequest.weekEndDate).split(',')[0] : "N/A"}
                    </p>
                  </div>
                  
                  {dueRequest.totalGeneratedAmount && (
                    <div>
                      <div className="flex items-center mb-2">
                        <FiDollarSign className="text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Generated Amount
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(dueRequest.totalGeneratedAmount)}
                      </p>
                    </div>
                  )}
                  
                  {dueRequest.adminCommissionAmount && (
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Admin Commission
                      </span>
                      <p className="text-gray-900 dark:text-white">
                        {formatCurrency(dueRequest.adminCommissionAmount)}
                      </p>
                    </div>
                  )}
                  
                  {dueRequest.franchiseCommissionAmount && (
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Franchise Commission
                      </span>
                      <p className="text-gray-900 dark:text-white">
                        {formatCurrency(dueRequest.franchiseCommissionAmount)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Status Timeline Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Status Timeline
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <FiClock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Request Created
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(dueRequest.createdAt)}
                    </p>
                  </div>
                </div>
                
                {dueRequest.approvalInfo?.franchiseApprovedAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <FiCheck className="h-4 w-4 text-green-600 dark:text-green-300" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Approved by Franchise
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(dueRequest.approvalInfo.franchiseApprovedAt)}
                      </p>
                    </div>
                  </div>
                )}
                
                {dueRequest.approvalInfo?.adminApprovedAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <FiCheck className="h-4 w-4 text-green-600 dark:text-green-300" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Approved by Admin
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(dueRequest.approvalInfo.adminApprovedAt)}
                      </p>
                    </div>
                  </div>
                )}
                
                {dueRequest.resolvedAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        dueRequest.status === "approved" 
                          ? "bg-green-100 dark:bg-green-900" 
                          : "bg-red-100 dark:bg-red-900"
                      }`}>
                        {dueRequest.status === "approved" ? (
                          <FiCheck className="h-4 w-4 text-green-600 dark:text-green-300" />
                        ) : (
                          <FiX className="h-4 w-4 text-red-600 dark:text-red-300" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {dueRequest.status === "approved" ? "Payment Completed" : "Request Rejected"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(dueRequest.resolvedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Proof Card */}
            {dueRequest.paymentPhoto && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  Payment Proof
                </h2>
                
                <div className="text-center">
                  <div className="mb-4">
                    <img
                      src={dueRequest.paymentPhoto}
                      alt="Payment Proof"
                      className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mx-auto max-h-64 object-cover"
                    />
                  </div>
                  
                  <a
                    href={dueRequest.paymentPhoto}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiDownload className="mr-2" />
                    View Full Image
                  </a>
                </div>
              </div>
            )}

            {/* Approval Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Approval Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Approval Level
                  </span>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {dueRequest.approvalInfo?.approvalLevel?.replace("_", " ") || "Single Level"}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Franchise
                    </span>
                    <div className="flex items-center mt-1">
                      {dueRequest.approvalInfo?.approvedByFranchise ? (
                        <>
                          <FiCheck className="text-green-500 mr-1" />
                          <span className="text-green-600">Approved</span>
                        </>
                      ) : (
                        <>
                          <FiClock className="text-yellow-500 mr-1" />
                          <span className="text-yellow-600">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Admin
                    </span>
                    <div className="flex items-center mt-1">
                      {dueRequest.approvalInfo?.approvedByAdmin ? (
                        <>
                          <FiCheck className="text-green-500 mr-1" />
                          <span className="text-green-600">Approved</span>
                        </>
                      ) : (
                        <>
                          <FiClock className="text-yellow-500 mr-1" />
                          <span className="text-yellow-600">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {dueRequest.approvedBy && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Approved By
                    </span>
                    <p className="text-gray-900 dark:text-white">
                      {dueRequest.approvedBy?.name || "Unknown"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Reject Due Request
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Reason for Rejection *
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="4"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Please provide a reason for rejecting this request..."
                required
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectNote("");
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={actionLoading || !rejectNote.trim()}
              >
                {actionLoading ? "Processing..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DueRequestDetails;