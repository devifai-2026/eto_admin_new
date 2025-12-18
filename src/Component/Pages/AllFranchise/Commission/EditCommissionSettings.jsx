// Pages/CommissionSettings/EditCommissionSettings.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FiArrowLeft, FiSave, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import commissionAPI from "../../../../apis/commissionSettings";

const EditCommissionSettings = () => {
  const { franchiseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    admin_commission_rate: 18,
    franchise_commission_rate: 10,
    reason: "",
  });
  const [franchiseInfo, setFranchiseInfo] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCommissionData();
  }, [franchiseId]);

  const fetchCommissionData = async () => {
    setLoading(true);
    try {
      const response = await commissionAPI.getFranchiseCommissionSettings(
        franchiseId
      );
      if (response.success) {
        const { franchise, commission_settings } = response.data;
        setFranchiseInfo(franchise);
        setFormData({
          admin_commission_rate: commission_settings.admin_commission_rate,
          franchise_commission_rate:
            commission_settings.franchise_commission_rate,
          reason: "",
        });
      }
    } catch (error) {
      toast.error("Failed to load commission data");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (
      formData.admin_commission_rate < 0 ||
      formData.admin_commission_rate > 100
    ) {
      newErrors.admin_commission_rate =
        "Admin commission must be between 0-100%";
    }

    if (
      formData.franchise_commission_rate < 0 ||
      formData.franchise_commission_rate > 100
    ) {
      newErrors.franchise_commission_rate =
        "Franchise commission must be between 0-100%";
    }

    const total =
      formData.admin_commission_rate + formData.franchise_commission_rate;
    if (total > 100) {
      newErrors.total = "Total commission cannot exceed 100%";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required for changes";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    try {
      await commissionAPI.updateCommissionSettings(franchiseId, formData);
      toast.success("Commission settings updated successfully!");
      navigate(`/commission-settings/${franchiseId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Edit Commission Settings - {franchiseInfo?.name}</title>
      </Helmet>

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Back to Details
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Edit Commission Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {franchiseInfo?.name}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Warning Alert */}
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="flex items-start">
              <FiAlertCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                  Important Note
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Commission changes will affect future rides only. Existing
                  pending payments will not be recalculated.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Commission Rates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Commission Rates (%)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Admin Commission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Commission Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={formData.admin_commission_rate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            admin_commission_rate:
                              parseFloat(e.target.value) || 0,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.admin_commission_rate
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      <span className="absolute right-3 top-2 text-gray-500">
                        %
                      </span>
                    </div>
                    {errors.admin_commission_rate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.admin_commission_rate}
                      </p>
                    )}
                  </div>

                  {/* Franchise Commission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Franchise Commission Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={formData.franchise_commission_rate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            franchise_commission_rate:
                              parseFloat(e.target.value) || 0,
                          })
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.franchise_commission_rate
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      <span className="absolute right-3 top-2 text-gray-500">
                        %
                      </span>
                    </div>
                    {errors.franchise_commission_rate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.franchise_commission_rate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Driver Commission Display */}
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Driver Commission Rate
                  </p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {100 -
                      formData.admin_commission_rate -
                      formData.franchise_commission_rate}
                    %
                  </p>
                </div>

                {errors.total && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.total}
                  </p>
                )}
              </div>

              {/* Change Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Change
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  rows={3}
                  placeholder="Explain why you're changing these commission rates..."
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.reason
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.reason}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This reason will be logged in the commission history.
                </p>
              </div>

              {/* Summary */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Summary
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="font-bold text-red-600 dark:text-red-400">
                      {formData.admin_commission_rate}%
                    </div>
                    <div>Admin</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="font-bold text-green-600 dark:text-green-400">
                      {formData.franchise_commission_rate}%
                    </div>
                    <div>Franchise</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {100 -
                        formData.admin_commission_rate -
                        formData.franchise_commission_rate}
                      %
                    </div>
                    <div>Driver</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <FiSave className="mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCommissionSettings;
