import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { dueRequestAPI } from "../../../apis/DueRequest";
import loginAPI from "../../../apis/Login";
import Breadcrumbs from "../../../Component/Breadcrumbs/BreadCrumbs";
import { Helmet } from "react-helmet";
import StatsCards from "./StatsCards";
import SearchFilter from "./SearchFilter";
import RequestsTable from "./RequestsTable";
import RequestsCards from "./RequestsCards";
import Pagination from "../../../utils/Pagination";
import LoadingState from "../AllFranchise/Franchice/LoadingState";
import { toast } from "react-toastify";

const DueRequest = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [franchiseId, setFranchiseId] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRequestData, setNewRequestData] = useState({
    dueAmount: "",
    notes: "",
    paymentMethod: "online",
    paymentPhoto: null,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const itemsPerPage = 10;

  // Get current user information
  const getCurrentUserInfo = useCallback(() => {
    const user = loginAPI.getCurrentUser();
    const userType = loginAPI.getUserType();

    console.log("Current user info:", { user, userType });

    return {
      user,
      userType,
      userId: user?._id || user?.id,
      franchiseId: user?.franchiseId || user?._id,
    };
  }, []);

  useEffect(() => {
    const { userType, userId, franchiseId } = getCurrentUserInfo();

    setUserRole(userType || "admin");
    setUserId(userId);
    setFranchiseId(franchiseId);

    fetchDueRequests();
    fetchStatistics();
  }, []);

  const fetchDueRequests = async () => {
    try {
      setLoading(true);

      const { userType, userId, franchiseId } = getCurrentUserInfo();

      if (!userType) {
        navigate("/login");
        return;
      }

      // Prepare filters based on user role
      const filters = {
        userType,
      };

      // Add ID based on user role
      if (userType === "admin" && userId) {
        filters.adminId = userId;
      } else if (userType === "franchise" && franchiseId) {
        filters.franchiseId = franchiseId;
      } else if (userType === "driver" && userId) {
        filters.driverId = userId;
      }

      console.log("Fetching due requests with filters:", filters);

      const response = await dueRequestAPI.getDueRequestsForApprover(filters);

      let requestsData = [];

      // Handle different response structures
      if (response.data && Array.isArray(response.data.requests)) {
        requestsData = response.data.requests;
      } else if (response.data && Array.isArray(response.data)) {
        requestsData = response.data;
      } else if (Array.isArray(response)) {
        requestsData = response;
      } else if (response.data?.data?.requests) {
        requestsData = response.data.data.requests;
      }

      console.log("Fetched requests data:", requestsData);

      setRequests(requestsData);
      setFilteredRequests(requestsData);
    } catch (error) {
      console.error("Error fetching due requests:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch due requests"
      );
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const { userType, userId, franchiseId } = getCurrentUserInfo();

      const filters = {
        userType,
      };

      if (userType === "admin" && userId) {
        filters.adminId = userId;
      } else if (userType === "franchise" && franchiseId) {
        filters.franchiseId = franchiseId;
      } else if (userType === "driver" && userId) {
        filters.driverId = userId;
      }

      const response = await dueRequestAPI.getStatistics(filters);

      // Handle different response structures
      if (response.data?.statistics) {
        setStatistics(response.data.statistics);
      } else if (response.data) {
        setStatistics(response.data);
      } else if (response.statistics) {
        setStatistics(response.statistics);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("Failed to fetch statistics");
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm, filterStatus, requests]);

  const applyFilters = useCallback(() => {
    let result = [...requests];

    if (filterStatus !== "all") {
      result = result.filter((request) => request.status === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (request) =>
          request.requester?.name?.toLowerCase().includes(term) ||
          request.requester?.phone?.includes(term) ||
          request.dueAmount?.toString().includes(term) ||
          request._id?.includes(term) ||
          request.id?.includes(term)
      );
    }

    setFilteredRequests(result);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, requests]);

  const handleViewDetails = async (requestId) => {
    try {
      const response = await dueRequestAPI.getDueRequestById(requestId);

      // Navigate to details page with the data
      navigate(`/due-request/${requestId}`, {
        state: response.data || response,
      });
    } catch (error) {
      console.error("Error fetching due request details:", error);
      navigate(`/due-request/${requestId}`);
    }
  };

  const handleApproveRequest = async (requestId, actionData = {}) => {
    try {
      const { userType, userId } = getCurrentUserInfo();

      // Prepare approval data
      const approvalData = {
        ...actionData,
        approverId: userId,
        userType,
      };

      await dueRequestAPI.approveDueRequest(requestId, approvalData);
      toast.success("Request approved successfully!");
      fetchDueRequests(); // Refresh the list
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error(error.response?.data?.message || "Failed to approve request");
    }
  };

  const handleCreateFranchiseRequest = async () => {
    try {
      const { franchiseId } = getCurrentUserInfo();

      if (!franchiseId) {
        toast.error("Franchise ID not found");
        return;
      }

      // If there's a payment photo, upload it first
      let paymentPhotoUrl = newRequestData.paymentPhoto;
      if (newRequestData.paymentPhoto instanceof File) {
        paymentPhotoUrl = await handleFileUpload(newRequestData.paymentPhoto);
      }

      const requestData = {
        ...newRequestData,
        paymentPhoto: paymentPhotoUrl,
        billId: newRequestData.billId || null,
      };

      const response = await dueRequestAPI.createFranchiseDueRequest(
        franchiseId,
        requestData
      );
      toast.success("Due request created successfully!");
      setShowCreateModal(false);
      setNewRequestData({
        dueAmount: "",
        notes: "",
        paymentMethod: "online",
        paymentPhoto: null,
        billId: null,
      });
      fetchDueRequests(); // Refresh the list
    } catch (error) {
      console.error("Error creating franchise due request:", error);
      toast.error(
        error.response?.data?.message || "Failed to create due request"
      );
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setUploadingImage(true);
      const imageUrl = await dueRequestAPI.uploadPaymentImage(file);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload payment image");
      throw error;
    } finally {
      setUploadingImage(false);
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

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      approved: "bg-green-100 text-green-800 border border-green-300",
      rejected: "bg-red-100 text-red-800 border border-red-300",
    };
    return styles[status] || styles.pending;
  };

  const getTotalAmount = () => {
    return requests.reduce((sum, req) => sum + (req.dueAmount || 0), 0);
  };

  const getStatusCount = (status) => {
    return requests.filter((req) => req.status === status).length;
  };

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = filteredRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | Due Requests</title>
      </Helmet>
      <Breadcrumbs />

      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Due Requests
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage and process all due payment requests
            </p>
          </div>

          <div className="flex gap-3">
            {userRole === "franchise" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                + Create Due Request
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards
          requests={requests}
          statistics={statistics}
          getStatusCount={getStatusCount}
          getTotalAmount={getTotalAmount}
          userRole={userRole}
        />

        {/* Search & Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          userRole={userRole}
        />

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Requests ({filteredRequests.length} found)
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Role: {userRole}
            </span>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden">
            <RequestsCards
              requests={currentRequests}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
              handleViewDetails={handleViewDetails}
              userRole={userRole}
              handleApproveRequest={handleApproveRequest}
            />
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <RequestsTable
              requests={currentRequests}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
              handleViewDetails={handleViewDetails}
              userRole={userRole}
              handleApproveRequest={handleApproveRequest}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredRequests.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredRequests.length}</span>{" "}
                  results
                </p>

                <div className="flex items-center space-x-1">
                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1 mx-1 sm:mx-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map((page, index, array) => {
                        // Add ellipsis logic
                        const showEllipsisBefore = index === 0 && page > 1;
                        const showEllipsisAfter =
                          index === array.length - 1 && page < totalPages;

                        return (
                          <React.Fragment key={page}>
                            {showEllipsisBefore && (
                              <span className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                ...
                              </span>
                            )}

                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-xs sm:text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                              }`}
                            >
                              {page}
                            </button>

                            {showEllipsisAfter && (
                              <span className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                ...
                              </span>
                            )}
                          </React.Fragment>
                        );
                      })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Franchise Due Request Modal */}
      {showCreateModal && userRole === "franchise" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Create Due Request</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={newRequestData.dueAmount}
                  onChange={(e) =>
                    setNewRequestData({
                      ...newRequestData,
                      dueAmount: e.target.value,
                    })
                  }
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Payment Method
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={newRequestData.paymentMethod}
                  onChange={(e) =>
                    setNewRequestData({
                      ...newRequestData,
                      paymentMethod: e.target.value,
                    })
                  }
                >
                  <option value="online">Online</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={newRequestData.notes}
                  onChange={(e) =>
                    setNewRequestData({
                      ...newRequestData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Add any notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Payment Proof (Image)
                </label>
                <input
                  type="file"
                  className="w-full p-2 border rounded"
                  accept="image/*"
                  onChange={(e) =>
                    setNewRequestData({
                      ...newRequestData,
                      paymentPhoto: e.target.files[0],
                    })
                  }
                />
                {uploadingImage && (
                  <p className="text-sm text-blue-600 mt-1">
                    Uploading image...
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded"
                disabled={uploadingImage}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFranchiseRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={uploadingImage || !newRequestData.dueAmount}
              >
                {uploadingImage ? "Uploading..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DueRequest;
