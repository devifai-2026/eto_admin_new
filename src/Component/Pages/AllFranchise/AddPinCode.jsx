import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiSave,
  FiPlus,
  FiTrash2,
  FiSearch,
  FiCheck,
  FiAlertCircle,
  FiUser,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import franchiseAPI from "../../../apis/franchise";
import { toast } from "react-toastify";

const AddPinCode = () => {
  const { id } = useParams(); // Franchise ID
  const navigate = useNavigate();
  const location = useLocation();

  const [franchise, setFranchise] = useState(null);
  const [pincodes, setPincodes] = useState([]); // Array of pincode objects
  const [newPincode, setNewPincode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch franchise and pincodes data
  useEffect(() => {
    if (id) {
      fetchFranchiseAndPincodes();
    }
  }, [id]);

  const fetchFranchiseAndPincodes = async () => {
    try {
      setFetching(true);
      setError("");

      // Fetch franchise details
      const franchiseResponse = await franchiseAPI.getFranchiseById(id);

      if (franchiseResponse.success && franchiseResponse.data?.franchise) {
        const franchiseData = franchiseResponse.data.franchise;
        setFranchise(franchiseData);

        // Extract pincodes from accessible_pincodes array
        const accessiblePincodes = franchiseData.accessible_pincodes || [];
        const activePincodes = accessiblePincodes.filter((p) => p.isActive);
        setPincodes(activePincodes);
      } else {
        setError("Failed to fetch franchise data");
        toast.error("Failed to fetch franchise details");
      }
    } catch (err) {
      console.error("Error fetching franchise:", err);
      setError(err.response?.data?.message || "Failed to fetch franchise data");
      toast.error("Failed to load franchise data");
    } finally {
      setFetching(false);
    }
  };

  const handleAddPincode = async () => {
    if (!newPincode.trim()) {
      setError("Please enter a pincode");
      return;
    }

    // Validate pincode format (6 digits)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(newPincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    // Check for duplicates
    if (pincodes.some((p) => p.pincode === newPincode)) {
      setError("This pincode is already added");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await franchiseAPI.addPincodeAccess(id, {
        pincode: newPincode,
      });

      if (response.success) {
        setSuccess("Pincode added successfully!");
        toast.success("Pincode added successfully");

        // Add the new pincode to the list
        const newPincodeObj = {
          _id:
            response.data?.franchise?.accessible_pincodes?.[0]?._id ||
            `temp-${Date.now()}`,
          pincode: newPincode,
          addedAt: new Date(),
          addedBy: response.data?.franchise?.accessible_pincodes?.[0]
            ?.addedBy || { name: "Admin" },
          isActive: true,
        };

        setPincodes((prev) => [...prev, newPincodeObj]);
        setNewPincode("");

        // Refresh franchise data to get updated info
        await fetchFranchiseAndPincodes();

        // Show assignment details if drivers were assigned
        if (response.data?.assignedDrivers > 0) {
          toast.info(
            `${response.data.assignedDrivers} driver(s) automatically assigned to this franchise`
          );
        }
      } else {
        setError(response.message || "Failed to add pincode");
        toast.error(response.message || "Failed to add pincode");
      }
    } catch (err) {
      console.error("Error adding pincode:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to add pincode";
      setError(errorMessage);
      toast.error(errorMessage);

      // Show conflict details if available
      if (err.response?.data?.data?.conflictingFranchise) {
        const conflict = err.response.data.data.conflictingFranchise;
        toast.error(
          `Pincode already assigned to ${conflict.name} (${conflict.email})`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePincode = async (pincodeId, pincodeValue) => {
    if (!pincodeId || !pincodeValue) {
      setError("Invalid pincode data");
      return;
    }

    // Check if trying to remove franchise's own address pincode
    if (franchise?.address?.pincode === pincodeValue) {
      setError("Cannot remove franchise's own address pincode");
      toast.error("Cannot remove franchise's own address pincode");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to remove pincode ${pincodeValue}?`
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await franchiseAPI.removePincodeAccess(id, pincodeId);

      if (response.success) {
        setSuccess("Pincode removed successfully!");
        toast.success("Pincode removed successfully");

        // Remove pincode from list
        setPincodes((prev) => prev.filter((p) => p._id !== pincodeId));

        // Refresh franchise data
        await fetchFranchiseAndPincodes();
      } else {
        setError(response.message || "Failed to remove pincode");
        toast.error(response.message || "Failed to remove pincode");
      }
    } catch (err) {
      console.error("Error removing pincode:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to remove pincode";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchFranchiseAndPincodes();
    toast.info("Refreshing pincode data...");
  };

  const filteredPincodes = pincodes.filter((pincode) =>
    pincode.pincode.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (fetching) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="lg:col-span-2 h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/all-franchise")}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <FiArrowLeft size={20} />
            <span>Back to Franchises</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiMapPin className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Manage Pincode Access
                </h1>
                {franchise && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      For{" "}
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {franchise.name}
                      </span>
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      • ID: {franchise._id?.slice(-8)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      • Own Pincode: {franchise.address?.pincode}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <FiCheck className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  {success}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Pincode Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add New Pincode Access
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pincode (6 digits)
                  </label>
                  <input
                    type="text"
                    value={newPincode}
                    onChange={(e) =>
                      setNewPincode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    placeholder="Enter 6-digit pincode"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    maxLength={6}
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Note: Adding a pincode will automatically assign eligible
                    drivers to this franchise
                  </p>
                </div>

                <button
                  onClick={handleAddPincode}
                  disabled={!newPincode.trim() || loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} />
                      <span>Add Pincode</span>
                    </>
                  )}
                </button>
              </div>

              {/* Franchise Info Card */}
              {franchise && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Franchise Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        City:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {franchise.address?.city || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        State:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {franchise.address?.state || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        District:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {franchise.address?.district || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Own Pincode:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium font-mono">
                        {franchise.address?.pincode || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pincodes List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Accessible Pincodes ({pincodes.length})
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Pincodes where this franchise can operate and assign drivers
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pincodes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={loading}
                  />
                </div>
              </div>

              {filteredPincodes.length > 0 ? (
                <div className="space-y-3">
                  {filteredPincodes.map((pincode) => (
                    <div
                      key={pincode._id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <FiMapPin
                            className="text-blue-600 dark:text-blue-400"
                            size={14}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                              {pincode.pincode}
                            </span>
                            {franchise?.address?.pincode ===
                              pincode.pincode && (
                              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                                Own Address
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                            {pincode.addedBy?.name && (
                              <div className="flex items-center space-x-1">
                                <FiUser size={10} />
                                <span>Added by: {pincode.addedBy.name}</span>
                              </div>
                            )}
                            {pincode.addedAt && (
                              <div className="flex items-center space-x-1">
                                <FiCalendar size={10} />
                                <span>
                                  Added: {formatDate(pincode.addedAt)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {franchise?.address?.pincode !== pincode.pincode && (
                        <button
                          onClick={() =>
                            handleRemovePincode(pincode._id, pincode.pincode)
                          }
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove pincode access"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                    📍
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No pincodes added yet
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm
                      ? "No pincodes match your search"
                      : "Add pincodes to manage franchise service areas"}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() =>
                        document
                          .querySelector(
                            'input[placeholder="Enter 6-digit pincode"]'
                          )
                          .focus()
                      }
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus size={16} />
                      <span>Add Your First Pincode</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-start space-x-3">
                <FiAlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    How Pincode Access Works
                  </h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                    <li>
                      • Adding a pincode gives this franchise access to operate
                      in that area
                    </li>
                    <li>
                      • Drivers with matching pincode will be automatically
                      assigned (if not on ride)
                    </li>
                    <li>• Franchise's own address pincode cannot be removed</li>
                    <li>
                      • Pincodes can only be assigned to one franchise at a time
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {pincodes.length}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Total Pincodes
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {filteredPincodes.length}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Showing
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {franchise?.address?.city || "N/A"}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">
              Primary City
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {franchise?.total_drivers || 0}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">
              Total Drivers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPinCode;
