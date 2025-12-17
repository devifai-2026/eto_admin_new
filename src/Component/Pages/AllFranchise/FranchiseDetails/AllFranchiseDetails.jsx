import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome,
  FiGlobe,
  FiCreditCard,
  FiFileText,
  FiCalendar,
  FiArrowLeft,
  FiEdit,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiDownload,
} from "react-icons/fi";
import { Helmet } from "react-helmet";
import { FaIndianRupeeSign } from "react-icons/fa6";
import franchiseAPI from "../../../../apis/franchise";
import { toast } from "react-toastify";
import DocumentViewerModal from "./DocumentViewerModal";

const AllFranchiseDetails = () => {
  const { franchiseId } = useParams();
  const navigate = useNavigate();

  const [franchise, setFranchise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    fetchFranchiseDetails();
  }, [franchiseId]);

  const fetchFranchiseDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const id = franchiseId === "me" ? "me" : franchiseId;
      const response = await franchiseAPI.getFranchiseById(id);

      if (response.success && response.data?.franchise) {
        setFranchise(response.data.franchise);
      } else {
        setError("Franchise data not found");
      }
    } catch (err) {
      console.error("Error fetching franchise:", err);
      setError(
        err.response?.data?.message || "Failed to fetch franchise details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/all-franchise");
  };

  const handleEdit = () => {
    navigate(`/edit-franchise/${franchise._id}`);
  };

  const handleViewAllDrivers = () => {
    if (franchise) {
      navigate(`/franchise-drivers/${franchise._id}`, {
        state: {
          franchise: franchise,
          franchiseName: franchise.name,
        },
      });
    }
  };

  // Document viewing functions
  const handleViewDocument = (url, name) => {
    setViewingDocument(url);
    setDocumentName(name);
  };

  const handleCloseDocument = () => {
    setViewingDocument(null);
    setDocumentName("");
  };

  const handleDownloadDocument = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (isActive, isApproved) => {
    if (!isApproved) {
      return {
        text: "Pending Approval",
        color: "bg-yellow-100 text-yellow-800 border border-yellow-300",
        dotColor: "bg-yellow-500",
      };
    }
    if (isActive) {
      return {
        text: "Active",
        color: "bg-green-100 text-green-800 border border-green-300",
        dotColor: "bg-green-500",
      };
    }
    return {
      text: "Inactive",
      color: "bg-red-100 text-red-800 border border-red-300",
      dotColor: "bg-red-500",
    };
  };

  const getDocumentName = (url) => {
    if (!url) return "Document";

    try {
      // Extract filename from URL
      const urlObj = new URL(url);
      let fileName = urlObj.pathname.split("/").pop();

      // Decode URL encoding (convert %20 to space, etc.)
      fileName = decodeURIComponent(fileName);

      // Clean up the filename - remove timestamps and random numbers
      fileName = fileName.replace(/-\d{13}-\d{9}/, "");

      // If cleaning removed everything, return a default name
      return fileName || "Document";
    } catch (error) {
      // If URL parsing fails, try to extract from string
      const parts = url.split("/");
      let fileName = parts[parts.length - 1];
      fileName = decodeURIComponent(fileName);
      fileName = fileName.replace(/-\d{13}-\d{9}/, "");
      return fileName || "Document";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileTypeIcon = (fileName) => {
    if (!fileName) return "📄";

    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return "🖼️";
    } else if (fileName.match(/\.(pdf)$/i)) {
      return "📕";
    } else if (fileName.match(/\.(doc|docx)$/i)) {
      return "📘";
    } else {
      return "📄";
    }
  };

  const getFileTypeText = (fileName) => {
    if (!fileName) return "Document";

    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return "Image";
    } else if (fileName.match(/\.(pdf)$/i)) {
      return "PDF";
    } else if (fileName.match(/\.(doc|docx)$/i)) {
      return "Word Document";
    } else {
      return "File";
    }
  };

  const renderStatsCards = () => {
    if (!franchise) return null;

    const status = getStatusBadge(franchise.isActive, franchise.isApproved);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Status
              </p>
              <div className="flex items-center mt-2">
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${status.dotColor}`}
                ></span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {status.text}
                </span>
              </div>
            </div>
            {franchise.isApproved && franchise.isActive ? (
              <FiCheckCircle className="text-2xl text-green-500" />
            ) : !franchise.isApproved ? (
              <FiClock className="text-2xl text-yellow-500" />
            ) : (
              <FiXCircle className="text-2xl text-red-500" />
            )}
          </div>
        </div>

        {/* Total Drivers Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Drivers
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {franchise.total_drivers || 0}
              </p>
            </div>
            <FiUsers className="text-2xl text-blue-500" />
          </div>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ₹{(franchise.total_earnings || 0).toLocaleString()}
              </p>
            </div>
            <FaIndianRupeeSign className="text-2xl text-green-500" />
          </div>
        </div>

        {/* Member Since Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Member Since
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                {formatDate(franchise.createdAt)}
              </p>
            </div>
            <FiCalendar className="text-2xl text-purple-500" />
          </div>
        </div>
      </div>
    );
  };

  const renderBasicInfo = () => {
    if (!franchise) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <FiUser className="text-blue-600" size={20} />
          <span>Basic Information</span>
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Franchise Name
              </label>
              <p className="text-base text-gray-900 dark:text-white font-medium">
                {franchise.name}
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Email Address
              </label>
              <p className="text-base text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                <FiMail className="text-gray-400" size={16} />
                <span>{franchise.email}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Phone Number
              </label>
              <p className="text-base text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                <FiPhone className="text-gray-400" size={16} />
                <span>{franchise.phone}</span>
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Created By
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {franchise.createdBy?.name || "Admin"}
              </p>
            </div>
          </div>

          {franchise.description && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Description
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {franchise.description}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAddressInfo = () => {
    if (!franchise?.address) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <FiMapPin className="text-green-600" size={20} />
          <span>Address Information</span>
        </h3>
        <div className="space-y-4">
          {franchise.address.street_address && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Street Address
              </label>
              <p className="text-base text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                <FiHome className="text-gray-400" size={16} />
                <span>{franchise.address.street_address}</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                City
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {franchise.address.city}
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                State
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {franchise.address.state}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                District
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {franchise.address.district}
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Pincode
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {franchise.address.pincode}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Country
            </label>
            <p className="text-base text-gray-900 dark:text-white flex items-center space-x-2">
              <FiGlobe className="text-gray-400" size={16} />
              <span>{franchise.address.country}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderBankInfo = () => {
    if (!franchise?.bank_details) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <FiCreditCard className="text-purple-600" size={20} />
          <span>Bank Account Information</span>
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Account Holder Name
            </label>
            <p className="text-base text-gray-900 dark:text-white font-medium">
              {franchise.bank_details.account_holder_name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Account Number
              </label>
              <p className="text-base text-gray-900 dark:text-white font-mono">
                {franchise.bank_details.account_number}
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                IFSC Code
              </label>
              <p className="text-base text-gray-900 dark:text-white font-mono">
                {franchise.bank_details.ifsc_code}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Branch Name
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {franchise.bank_details.branch_name}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderDocuments = () => {
    if (!franchise?.documents) return null;

    const { identity_documents, trade_license } = franchise.documents;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <FiFileText className="text-orange-600" size={20} />
          <span>Documents</span>
        </h3>
        <div className="space-y-6">
          {/* Identity Documents */}
          {identity_documents && identity_documents.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Identity Documents ({identity_documents.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {identity_documents.map((doc, index) => {
                  const docName = getDocumentName(doc);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="flex-shrink-0 text-2xl">
                          {getFileTypeIcon(docName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {docName}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{getFileTypeText(docName)}</span>
                            <span>•</span>
                            <span>ID Doc {index + 1}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleViewDocument(doc, docName)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="View"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(doc, docName)}
                          className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                          title="Download"
                        >
                          <FiDownload size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Trade License */}
          {trade_license && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Trade License
              </h4>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="flex-shrink-0 text-2xl">
                    {getFileTypeIcon(getDocumentName(trade_license))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {getDocumentName(trade_license)}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getFileTypeText(trade_license)} • Trade License
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() =>
                      handleViewDocument(
                        trade_license,
                        getDocumentName(trade_license)
                      )
                    }
                    className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    title="View"
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadDocument(
                        trade_license,
                        getDocumentName(trade_license)
                      )
                    }
                    className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                    title="Download"
                  >
                    <FiDownload size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* No Documents Message */}
          {(!identity_documents || identity_documents.length === 0) &&
            !trade_license && (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 text-5xl mb-3">
                  📄
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  No documents uploaded yet
                </p>
              </div>
            )}
        </div>
      </div>
    );
  };

  const renderAccessiblePincodes = () => {
    if (
      !franchise?.accessible_pincodes ||
      franchise.accessible_pincodes.length === 0
    )
      return null;

    const activePincodes = franchise.accessible_pincodes.filter(
      (p) => p.isActive
    );

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <FiMapPin className="text-red-600" size={20} />
          <span>Accessible Pincodes ({activePincodes.length})</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {activePincodes.map((pincode, index) => (
            <div
              key={index}
              className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {pincode.pincode}
                </span>
                {pincode.addedBy?.name && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    • Added by {pincode.addedBy.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              ❌
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Franchise
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Franchises
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!franchise) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              🔍
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Franchise Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The franchise you're looking for doesn't exist.
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Franchises
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = getStatusBadge(franchise.isActive, franchise.isApproved);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | Franchise Details - {franchise.name}</title>
      </Helmet>

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <DocumentViewerModal
          documentUrl={viewingDocument}
          documentName={documentName}
          onClose={handleCloseDocument}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FiArrowLeft size={20} />
              <span>Back to Franchises</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleViewAllDrivers}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiUsers size={18} />
                <span>View Drivers</span>
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit size={18} />
                <span>Edit</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
              <FiUser size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {franchise.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ID: {franchise._id}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${status.dotColor}`}
                  ></span>
                  {status.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {renderBasicInfo()}
            {renderAddressInfo()}
            {renderAccessiblePincodes()}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {renderBankInfo()}
            {renderDocuments()}
          </div>
        </div>

        {/* Additional Info (if needed) */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Last Updated: {formatDate(franchise.updatedAt)}</p>
            {franchise.lastSeen && (
              <p className="mt-1">
                Last Active: {formatDate(franchise.lastSeen)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFranchiseDetails;
