import { useState } from "react";
import {
  FiDollarSign,
  FiNavigation,
  FiMoon,
  FiClock,
  FiEdit2,
} from "react-icons/fi";
import fareSettingsAPI from "../../../apis/fareSettings";
import { toast } from "react-toastify";

const UpdateFareForm = ({ settings, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    base_fare: settings?.base_fare || "",
    per_km_charge: settings?.per_km_charge || "",
    night_surcharge_percentage: settings?.night_surcharge_percentage || "",
    night_start_hour: settings?.night_start_hour || "",
    night_end_hour: settings?.night_end_hour || "",
    reason: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (formData.base_fare === "" || formData.base_fare < 0) {
      newErrors.base_fare = "Base fare must be a positive number";
    }

    if (formData.per_km_charge === "" || formData.per_km_charge < 0) {
      newErrors.per_km_charge = "Per km charge must be a positive number";
    }

    if (
      formData.night_surcharge_percentage < 0 ||
      formData.night_surcharge_percentage > 100
    ) {
      newErrors.night_surcharge_percentage = "Must be between 0 and 100";
    }

    if (formData.night_start_hour < 0 || formData.night_start_hour > 23) {
      newErrors.night_start_hour = "Must be between 0 and 23";
    }

    if (formData.night_end_hour < 0 || formData.night_end_hour > 23) {
      newErrors.night_end_hour = "Must be between 0 and 23";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for change is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const updateData = {};

      // Only include fields that have changed from current settings
      if (
        formData.base_fare !== "" &&
        parseFloat(formData.base_fare) !== settings?.base_fare
      ) {
        updateData.base_fare = parseFloat(formData.base_fare);
      }

      if (
        formData.per_km_charge !== "" &&
        parseFloat(formData.per_km_charge) !== settings?.per_km_charge
      ) {
        updateData.per_km_charge = parseFloat(formData.per_km_charge);
      }

      if (
        formData.night_surcharge_percentage !== "" &&
        parseFloat(formData.night_surcharge_percentage) !==
          settings?.night_surcharge_percentage
      ) {
        updateData.night_surcharge_percentage = parseFloat(
          formData.night_surcharge_percentage
        );
      }

      if (
        formData.night_start_hour !== "" &&
        parseInt(formData.night_start_hour) !== settings?.night_start_hour
      ) {
        updateData.night_start_hour = parseInt(formData.night_start_hour);
      }

      if (
        formData.night_end_hour !== "" &&
        parseInt(formData.night_end_hour) !== settings?.night_end_hour
      ) {
        updateData.night_end_hour = parseInt(formData.night_end_hour);
      }

      // Always include reason
      updateData.reason = formData.reason;

      // Check if there are any changes to fare settings (excluding reason)
      const hasChanges = Object.keys(updateData).some(
        (key) => key !== "reason" && updateData[key] !== undefined
      );

      if (!hasChanges) {
        toast.warning("No changes detected to update");
        setLoading(false);
        return;
      }

      const response = await fareSettingsAPI.updateSettings(updateData);

      if (response.success) {
        toast.success("Fare settings updated successfully!");
        onSuccess();
        // Reset form except for current values
        setFormData((prev) => ({
          ...prev,
          reason: "",
        }));
      } else {
        toast.error(response.message || "Failed to update fare settings");
      }
    } catch (error) {
      console.error("Error updating fare settings:", error);
      toast.error(
        error.response?.data?.message || "Failed to update fare settings"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hour) => {
    if (hour === "" || hour === null || hour === undefined) return "";
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
        <div className="flex items-start space-x-3">
          <FiEdit2 className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Update Fare Settings</p>
            <p>
              Changes will affect all future rides. Please provide a reason for
              each update. Current values are pre-filled for reference.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base Fare Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Base Fare (₹)
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.base_fare}
                onChange={(e) => handleInputChange("base_fare", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.base_fare
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter base fare"
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Current: ₹{settings?.base_fare}
              </span>
              {errors.base_fare && (
                <span className="text-xs text-red-600 dark:text-red-400">
                  {errors.base_fare}
                </span>
              )}
            </div>
          </div>

          {/* Per KM Charge Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Per Kilometer Charge (₹/km)
            </label>
            <div className="relative">
              <FiNavigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.per_km_charge}
                onChange={(e) =>
                  handleInputChange("per_km_charge", e.target.value)
                }
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.per_km_charge
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter per km charge"
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Current: ₹{settings?.per_km_charge}/km
              </span>
              {errors.per_km_charge && (
                <span className="text-xs text-red-600 dark:text-red-400">
                  {errors.per_km_charge}
                </span>
              )}
            </div>
          </div>

          {/* Night Surcharge Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Night Surcharge (%)
            </label>
            <div className="relative">
              <FiMoon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.night_surcharge_percentage}
                onChange={(e) =>
                  handleInputChange(
                    "night_surcharge_percentage",
                    e.target.value
                  )
                }
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.night_surcharge_percentage
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter night surcharge percentage"
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Current: {settings?.night_surcharge_percentage}%
              </span>
              {errors.night_surcharge_percentage && (
                <span className="text-xs text-red-600 dark:text-red-400">
                  {errors.night_surcharge_percentage}
                </span>
              )}
            </div>
          </div>

          {/* Night Start Hour Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Night Start Hour (24-hour format)
            </label>
            <div className="relative">
              <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                min="0"
                max="23"
                value={formData.night_start_hour}
                onChange={(e) =>
                  handleInputChange("night_start_hour", e.target.value)
                }
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.night_start_hour
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter night start hour (0-23)"
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Current: {formatTime(settings?.night_start_hour)}
              </span>
              {errors.night_start_hour && (
                <span className="text-xs text-red-600 dark:text-red-400">
                  {errors.night_start_hour}
                </span>
              )}
            </div>
          </div>

          {/* Night End Hour Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Night End Hour (24-hour format)
            </label>
            <div className="relative">
              <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                min="0"
                max="23"
                value={formData.night_end_hour}
                onChange={(e) =>
                  handleInputChange("night_end_hour", e.target.value)
                }
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.night_end_hour
                    ? "border-red-300 dark:border-red-700"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"`}
                placeholder="Enter night end hour (0-23)"
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Current: {formatTime(settings?.night_end_hour)}
              </span>
              {errors.night_end_hour && (
                <span className="text-xs text-red-600 dark:text-red-400">
                  {errors.night_end_hour}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reason Field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reason for Update *
          </label>
          <textarea
            rows={3}
            value={formData.reason}
            onChange={(e) => handleInputChange("reason", e.target.value)}
            className={`w-full px-4 py-3 border ${
              errors.reason
                ? "border-red-300 dark:border-red-700"
                : "border-gray-300 dark:border-gray-600"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder="Please provide a detailed reason for updating the fare settings"
          />
          {errors.reason && (
            <span className="text-xs text-red-600 dark:text-red-400 mt-1 block">
              {errors.reason}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <FiDollarSign size={18} />
                <span>Update Fare Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateFareForm;
