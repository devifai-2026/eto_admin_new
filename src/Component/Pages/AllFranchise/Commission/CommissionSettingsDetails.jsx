// Pages/CommissionSettings/CommissionSettingsDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FiArrowLeft, FiCalendar, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import commissionAPI from "../../../../apis/commissionSettings";
import LoadingState from "../Franchice/LoadingState";
import ErrorState from "../Franchice/ErrorState";

const CommissionSettingsDetails = () => {
  const { franchiseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commissionData, setCommissionData] = useState(null);

  // Check if data was passed in navigation state
  const initialData = location.state;

  useEffect(() => {
    if (initialData) {
      // Use data from navigation state if available
      setCommissionData(initialData);
      setLoading(false);
    } else if (franchiseId) {
      // Otherwise fetch from API
      fetchCommissionDetails();
    } else {
      setError("Franchise ID is required");
      setLoading(false);
    }
  }, [franchiseId, initialData]);

  const fetchCommissionDetails = async () => {
    setLoading(true);
    try {
      const response = await commissionAPI.getFranchiseCommissionSettings(
        franchiseId
      );
      if (response.success) {
        setCommissionData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load commission details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} retry={fetchCommissionDetails} />;
  if (!commissionData)
    return (
      <ErrorState
        error="No commission data found"
        retry={fetchCommissionDetails}
      />
    );

  const { franchise, commission_settings } = commissionData;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Commission Settings - {franchise.name}</title>
      </Helmet>

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Back to Commission Settings
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              Commission Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{franchise.name}</p>
          </div>

          <button
            onClick={() =>
              navigate(`/commission-settings/${franchise._id}/edit`, {
                state: commissionData,
              })
            }
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Edit Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Franchise Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Franchise Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <FiUser className="text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium">{franchise.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FiUser className="text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium">{franchise.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Rates Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Commission Rates
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {commission_settings.admin_commission_rate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Admin
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {commission_settings.franchise_commission_rate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Franchise
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {100 -
                    commission_settings.admin_commission_rate -
                    commission_settings.franchise_commission_rate}
                  %
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Driver
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    commission_settings.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {commission_settings.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Info Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Settings Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Changed By
                </p>
                <p className="font-medium">
                  {commission_settings.last_changed_by?.name || "System"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {commission_settings.last_changed_by?.email || ""}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created At
                </p>
                <p className="font-medium">
                  {new Date(commission_settings.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Changes
                </p>
                <p className="font-medium text-xl">
                  {commission_settings.settings_history?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Updated
                </p>
                <p className="font-medium">
                  {new Date(commission_settings.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionSettingsDetails;
