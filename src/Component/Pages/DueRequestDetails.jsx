import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dueRequestAPI } from "../../apis/DueRequest";
import {
  MdArrowBack,
  MdClose,
  MdOutlineAccountBalanceWallet,
  MdOutlineTrendingUp,
  MdOutlineBusiness,
} from "react-icons/md";
import {
  FiUser,
  FiPhone,
  FiCheckCircle,
  FiX,
  FiDollarSign,
  FiPercent,
  FiPackage,
} from "react-icons/fi";
import { FaUserShield, FaMotorcycle, FaBuilding } from "react-icons/fa";
import Breadcrumbs from "../Breadcrumbs/BreadCrumbs";
import { Helmet } from "react-helmet";

const DueRequestDetails = () => {
  const { dueRequestId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
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

      const response = await dueRequestAPI.getDueRequestById(dueRequestId);

      if (response) {
        console.log("Found due request details:", response);
        setData(response);
      } else {
        setError(`Due request with ID ${dueRequestId} not found`);
      }
    } catch (error) {
      console.error("Error fetching due request details:", error);
      setError(
        `Error loading due request details: ${
          error.response?.data?.message || error.message
        }`
      );
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
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
        const paymentImageUrl = await dueRequestAPI.uploadPaymentImage(
          paymentImage
        );
        approveData.paymentPhoto = paymentImageUrl;
      } else {
        approveData.paymentPhoto = null;
        alert("Please upload payment image");
        return;
      }

      const updateResponse = await dueRequestAPI.updateDueRequestStatus(
        dueRequestId,
        approveData
      );

      if (
        updateResponse.success ||
        updateResponse.message === "Due request status updated successfully."
      ) {
        console.log("Due Request Status Updated:", updateResponse);
        setApproveModalOpen(false);
        fetchDueRequestDetails();
      } else {
        console.error(
          "Failed to update due request status:",
          updateResponse.message
        );
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

      const updateResponse = await dueRequestAPI.updateDueRequestStatus(
        dueRequestId,
        rejectData
      );

      if (
        updateResponse.message === "Due request status updated successfully." ||
        updateResponse.success
      ) {
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

  const renderProfitSummary = () => {
    if (!data?.profitSummary) return null;

    const { profitSummary } = data;

    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm border border-blue-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <MdOutlineTrendingUp className="mr-2" />
          Profit Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Amount */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <FiDollarSign className="text-green-500 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Amount
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(profitSummary.totalAmount)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {profitSummary.rideCount} rides
            </p>
          </div>

          {/* Driver Profit */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <FaMotorcycle className="text-blue-500 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Driver Profit
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(profitSummary.driverProfit)}
            </p>
            <div className="flex items-center mt-1">
              <FiPercent size={12} className="text-gray-400 mr-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {profitSummary.breakdown?.driverPercentage}%
              </span>
            </div>
          </div>

          {/* Admin Profit */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <FaUserShield className="text-purple-500 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Admin Profit
              </p>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(profitSummary.adminProfit)}
            </p>
            <div className="flex items-center mt-1">
              <FiPercent size={12} className="text-gray-400 mr-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {profitSummary.breakdown?.adminPercentage}%
              </span>
            </div>
          </div>

          {/* Franchise Profit */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-2">
              <FaBuilding className="text-amber-500 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Franchise Profit
              </p>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(profitSummary.franchiseProfit)}
            </p>
            <div className="flex items-center mt-1">
              <FiPercent size={12} className="text-gray-400 mr-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {profitSummary.breakdown?.franchisePercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Percentage Breakdown Visual */}
        {profitSummary.totalAmount > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Profit Distribution</span>
              <span>100%</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full flex">
                {profitSummary.breakdown?.driverPercentage > 0 && (
                  <div
                    className="bg-blue-500"
                    style={{
                      width: `${profitSummary.breakdown.driverPercentage}%`,
                    }}
                    title={`Driver: ${profitSummary.breakdown.driverPercentage}%`}
                  />
                )}
                {profitSummary.breakdown?.adminPercentage > 0 && (
                  <div
                    className="bg-purple-500"
                    style={{
                      width: `${profitSummary.breakdown.adminPercentage}%`,
                    }}
                    title={`Admin: ${profitSummary.breakdown.adminPercentage}%`}
                  />
                )}
                {profitSummary.breakdown?.franchisePercentage > 0 && (
                  <div
                    className="bg-amber-500"
                    style={{
                      width: `${profitSummary.breakdown.franchisePercentage}%`,
                    }}
                    title={`Franchise: ${profitSummary.breakdown.franchisePercentage}%`}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderKhataSummary = () => {
    if (!data?.khataSummary) return null;

    const { khataSummary } = data;

    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm border border-green-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <MdOutlineAccountBalanceWallet className="mr-2" />
          Khata Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Driver Due
            </p>
            <p
              className={`text-2xl font-bold ${
                khataSummary.driverDue > 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {formatCurrency(khataSummary.driverDue)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Admin Due
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(khataSummary.adminDue)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Franchise Due
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(khataSummary.franchiseDue)}
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Due Payments:{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {khataSummary.totalDuePayments}
            </span>
          </p>
        </div>
      </div>
    );
  };

  const renderFranchiseDetails = () => {
    if (
      !data?.franchise ||
      data.franchise?.message === "No franchise involved"
    ) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <MdOutlineBusiness className="mr-2" />
            Franchise Information
          </h2>
          <div className="text-center py-6">
            <FaBuilding className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No franchise involved
            </p>
          </div>
        </div>
      );
    }

    const { franchise } = data;

    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm border border-amber-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <MdOutlineBusiness className="mr-2" />
          Franchise Information
        </h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
              <FaBuilding size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-lg">
                {franchise.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {franchise.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {franchise.phone}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Earnings
              </p>
              <p className="font-semibold text-green-600 dark:text-green-400 text-lg">
                {formatCurrency(franchise.totalEarning)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDriverDetails = () => {
    if (!data?.driverDetails) return null;

    const { driverDetails } = data;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Driver Wallet Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 border border-blue-100 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Total Earnings
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(driverDetails.totalEarning)}
            </p>
          </div>

          <div className="bg-red-50 dark:bg-gray-700 rounded-lg p-4 border border-red-100 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Due Wallet
            </p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(driverDetails.dueWallet)}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-gray-700 rounded-lg p-4 border border-green-100 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Cash Wallet
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(driverDetails.cashWallet)}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-4 border border-purple-100 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Online Wallet
            </p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(driverDetails.onlineWallet)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending:
        "bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
      approved:
        "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700",
      rejected:
        "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700",
    };
    return `px-3 py-1 rounded-full text-sm font-semibold ${
      styles[status] || styles.pending
    }`;
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
              onClick={() => navigate("/due-request")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Due Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
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
            onClick={() => navigate("/due-request")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Due Requests
          </button>
        </div>
      </div>
    );
  }

  const dueRequest = data.dueRequest || {};

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | Due Request Details</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/due-request")}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <MdArrowBack
                size={24}
                className="text-gray-600 dark:text-gray-400"
              />
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
              {dueRequest.status?.charAt(0).toUpperCase() +
                dueRequest.status?.slice(1)}
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
              {formatDate(dueRequest.createdAt)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="xl:col-span-2 space-y-6">
            {/* Driver Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Driver Information
              </h2>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 overflow-hidden">
                  {dueRequest.requestedBy?.photo ? (
                    <img
                      src={dueRequest.requestedBy.photo}
                      alt={dueRequest.requestedBy.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <FiUser size={24} />
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {dueRequest.requestedBy?.name || "No Name"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {dueRequest.requestedBy?.id || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiPhone className="mr-2 text-gray-400" size={16} />
                    <span className="text-gray-600 dark:text-gray-400">
                      Phone:{" "}
                    </span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">
                      {dueRequest.requestedBy?.phone || "N/A"}
                    </span>
                  </div>
                  {dueRequest.requestedBy?.franchiseId && (
                    <div className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded inline-block">
                      Franchise Driver
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profit Summary */}
            {renderProfitSummary()}

            {/* Khata Summary */}
            {renderKhataSummary()}

            {/* Driver Wallet Details */}
            {renderDriverDetails()}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Request Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Request Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Requested At
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(dueRequest.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Payment Method
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {dueRequest.paymentMethod || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Due Amount
                  </p>
                  <p className="font-semibold text-green-600 dark:text-green-400 text-2xl">
                    {formatCurrency(dueRequest.dueAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Paid Amount
                  </p>
                  <p className="font-semibold text-blue-600 dark:text-blue-400 text-xl">
                    {formatCurrency(dueRequest.paidAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Notes
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {dueRequest.notes || "No notes provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Admin Information
              </h2>
              {dueRequest.admin ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Name
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {dueRequest.admin.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {dueRequest.admin.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {dueRequest.admin.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No admin information available
                </p>
              )}
            </div>

            {/* Franchise Details */}
            {renderFranchiseDetails()}

            {/* Actions Card */}
            {dueRequest.status === "pending" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Actions
                </h2>
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Payment Proof
                </h2>
                <img
                  src={dueRequest.paymentPhoto}
                  alt="Payment Proof"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}

            {/* Status Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Status Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current Status
                  </p>
                  <span className={getStatusBadge(dueRequest.status)}>
                    {dueRequest.status?.charAt(0).toUpperCase() +
                      dueRequest.status?.slice(1)}
                  </span>
                </div>
                {dueRequest.resolvedAt && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Resolved At
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(dueRequest.resolvedAt)}
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
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Cash
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Online
                    </span>
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
