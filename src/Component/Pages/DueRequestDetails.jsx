import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dueRequestAPI } from "../../apis/DueRequest";
import { 
  MdArrowBack, 
  MdClose,
} from "react-icons/md";
import { 
  FiUser, 
  FiPhone, 
  FiCheckCircle,
  FiX
} from "react-icons/fi";
import Breadcrumbs from '../Breadcrumbs/BreadCrumbs';

const DueRequestDetails = () => {
  const { dueRequestId } = useParams();
  const navigate = useNavigate();
  const [dueRequest, setDueRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [paymentImage, setPaymentImage] = useState(null);

  useEffect(() => {
    if (dueRequestId) {
      fetchDueRequestDetails();
    }
  }, [dueRequestId]);

  const fetchDueRequestDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching due request details for ID:", dueRequestId);
      
      const foundRequest = await dueRequestAPI.getDueRequestById(dueRequestId);
      
      if (foundRequest) {
        console.log("Found due request:", foundRequest);
        setDueRequest(foundRequest);
      } else {
        setError(`Due request with ID ${dueRequestId} not found`);
      }
      
    } catch (error) {
      console.error("Error fetching due request details:", error);
      setError(`Error loading due request details: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
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

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setPaymentImage(event.target.files[0]);
    }
  };

  const handleApproveSubmit = async () => {
    try {
      const approveData = {
        status: "approved",
        note: notes,
        paymentMethod: paymentMethod,
      };

      if (paymentImage) {
        const paymentImageUrl = await dueRequestAPI.uploadPaymentImage(paymentImage);
        approveData.paymentPhoto = paymentImageUrl;
      } else {
        approveData.paymentPhoto = null;
        alert("Please upload payment image");
        return;
      }

      const updateResponse = await dueRequestAPI.updateDueRequestStatus(dueRequestId, approveData);

      if (updateResponse.success || updateResponse.message === "Due request status updated successfully.") {
        console.log("Due Request Status Updated:", updateResponse);
        setApproveModalOpen(false);
        fetchDueRequestDetails(); 
      } else {
        console.error("Failed to update due request status:", updateResponse.message);
        setApproveModalOpen(false);
      }
    } catch (error) {
      console.error("Error submitting approval:", error);
      setApproveModalOpen(false);
      alert(error.message);
    }
  };

  const handleRejectSubmit = async () => {
    try {
      const rejectData = {
        status: "rejected",
        note: notes || "Rejected by admin",
      };

      const updateResponse = await dueRequestAPI.updateDueRequestStatus(dueRequestId, rejectData);

      if (updateResponse.message === "Due request status updated successfully." || updateResponse.success) {
        console.log("Due Request Rejected:", updateResponse);
        fetchDueRequestDetails(); 
      } else {
        console.error("Failed to reject due request:", updateResponse.message);
      }
    } catch (error) {
      console.error("Error rejecting due request:", error);
      alert("Error rejecting the due request");
    }
  };

  const renderRides = () => {
    if (!dueRequest.rides || dueRequest.rides.length === 0)
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">No rides available for this due request.</p>
        </div>
      );

    return (
      <div className="space-y-4">
        <Helmet>
              <title>Admin | Due Request Details</title>
            </Helmet>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ride Details</h3>
        {dueRequest.rides.map((ride, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Price</p>
                <p className="font-semibold text-green-600 dark:text-green-400">₹{ride.total_price || "0"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Driver Profit</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">₹{ride.driver_profit || "0"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admin Profit</p>
                <p className="font-semibold text-purple-600 dark:text-purple-400">₹{ride.admin_profit || "0"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Mode</p>
                <p className="font-semibold text-gray-900 dark:text-white capitalize">{ride.payment_mode || "N/A"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
      approved: "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700",
      rejected: "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
    };
    return `px-3 py-1 rounded-full text-sm font-semibold ${styles[status] || styles.pending}`;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="ml-4 text-lg text-gray-600 dark:text-gray-300">
            Loading due request details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Details
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchDueRequestDetails}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/due-request')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Due Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dueRequest) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Due Request Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The requested due request could not be found.
          </p>
          <button
            onClick={() => navigate('/due-request')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Due Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/due-request')}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <MdArrowBack size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Due Request Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                Request ID: {dueRequest._id}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className={getStatusBadge(dueRequest.status)}>
              {dueRequest.status?.charAt(0).toUpperCase() + dueRequest.status?.slice(1)}
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
              {formatDate(dueRequest.requestedAt)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="xl:col-span-2 space-y-6">
            {/* Driver Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Driver Information</h2>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                  {dueRequest.driver?.photo ? (
                    <img
                      src={dueRequest.driver.photo}
                      alt={dueRequest.driver.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <FiUser size={24} />
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {dueRequest.driver?.name || "No Name"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {dueRequest.driver?.eto_id_num || "No ETO ID"}
                    </p>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiPhone className="mr-2 text-gray-400" size={16} />
                    <span className="text-gray-600 dark:text-gray-400">Phone: </span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">
                      {dueRequest.driver?.phone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Request Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Requested At</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(dueRequest.requestedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                      {dueRequest.paymentMethod || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Due Amount</p>
                    <p className="font-semibold text-green-600 dark:text-green-400 text-2xl">
                      ₹{dueRequest.dueAmount?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {dueRequest.notes || "No notes provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rides Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {renderRides()}
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Actions Card */}
            {dueRequest.status === "pending" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setApproveModalOpen(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                  >
                    <FiCheckCircle size={18} className="mr-2" />
                    Approve Request
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                  >
                    <FiX size={18} className="mr-2" />
                    Reject Request
                  </button>
                </div>
              </div>
            )}

            {/* Payment Photo Card */}
            {dueRequest.paymentPhoto && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Proof</h2>
                <img
                  src={dueRequest.paymentPhoto}
                  alt="Payment Proof"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}

            {/* Status Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Status Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Status</p>
                  <span className={getStatusBadge(dueRequest.status)}>
                    {dueRequest.status?.charAt(0).toUpperCase() + dueRequest.status?.slice(1)}
                  </span>
                </div>
                {dueRequest.updatedAt && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(dueRequest.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Approve Request
              </h3>
              <button
                onClick={() => setApproveModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <MdClose size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter approval notes..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Online</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="offline"
                      checked={paymentMethod === "offline"}
                      onChange={() => setPaymentMethod("offline")}
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Offline</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Proof Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setApproveModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DueRequestDetails;