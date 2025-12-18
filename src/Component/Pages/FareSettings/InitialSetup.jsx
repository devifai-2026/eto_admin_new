import { useState } from "react";
import {
  FiSettings,
  FiDollarSign,
  FiNavigation,
  FiMoon,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import fareSettingsAPI from "../../../apis/fareSettings";
import { toast } from "react-toastify";

const InitialSetup = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    base_fare: 20,
    per_km_charge: 8,
    night_surcharge_percentage: 20,
    night_start_hour: 22,
    night_end_hour: 6,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.base_fare || formData.base_fare < 0) {
      newErrors.base_fare = "Base fare must be a positive number";
    }

    if (!formData.per_km_charge || formData.per_km_charge < 0) {
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
      const response = await fareSettingsAPI.createSettings(formData);

      if (response.success) {
        toast.success("Fare settings initialized successfully!");
        onSuccess();
      } else {
        toast.error(response.message || "Failed to initialize fare settings");
      }
    } catch (error) {
      console.error("Error initializing fare settings:", error);
      toast.error(
        error.response?.data?.message || "Failed to initialize fare settings"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Setup Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <FiSettings className="text-3xl text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Welcome to Fare Settings Setup
            </h3>
            <p className="text-blue-700 dark:text-blue-400">
              This is a one-time setup to configure the fare calculation system
              for your platform. These settings will be used for all ride fare
              calculations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Setup Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Configure Fare Settings
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Base Fare */}
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
                  onChange={(e) =>
                    handleInputChange("base_fare", e.target.value)
                  }
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.base_fare
                      ? "border-red-300 dark:border-red-700"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter base fare"
                />
              </div>
              {errors.base_fare && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1 block">
                  {errors.base_fare}
                </span>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Initial charge applied to every ride
              </p>
            </div>

            {/* Per KM Charge */}
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
              {errors.per_km_charge && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1 block">
                  {errors.per_km_charge}
                </span>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Charge per kilometer traveled
              </p>
            </div>

            {/* Night Surcharge */}
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
              {errors.night_surcharge_percentage && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1 block">
                  {errors.night_surcharge_percentage}
                </span>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Additional percentage applied during night hours
              </p>
            </div>

            {/* Night Start Hour */}
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
                  placeholder="Enter night start hour"
                />
              </div>
              {errors.night_start_hour && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1 block">
                  {errors.night_start_hour}
                </span>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                When night surcharge starts (0-23)
              </p>
            </div>

            {/* Night End Hour */}
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
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter night end hour"
                />
              </div>
              {errors.night_end_hour && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1 block">
                  {errors.night_end_hour}
                </span>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                When night surcharge ends (0-23)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Initializing...</span>
                </>
              ) : (
                <>
                  <FiSettings size={18} />
                  <span>Initialize Fare Settings</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <FiAlertCircle className="text-2xl text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Settings Preview
            </h3>
          </div>

          <div className="space-y-6">
            {/* Example Calculation */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3">
                Example Calculation
              </h4>
              <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <div className="flex justify-between">
                  <span>Base Fare:</span>
                  <span className="font-mono">₹{formData.base_fare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Per KM Charge:</span>
                  <span className="font-mono">₹{formData.per_km_charge}</span>
                </div>
                <div className="flex justify-between">
                  <span>Night Surcharge:</span>
                  <span className="font-mono">
                    {formData.night_surcharge_percentage}%
                  </span>
                </div>
                <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                  <div className="flex justify-between font-medium">
                    <span>5km Day Ride:</span>
                    <span className="font-mono">
                      ₹
                      {Math.round(
                        formData.base_fare + 5 * formData.per_km_charge
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>5km Night Ride:</span>
                    <span className="font-mono">
                      ₹
                      {Math.round(
                        (formData.base_fare + 5 * formData.per_km_charge) *
                          (1 + formData.night_surcharge_percentage / 100)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Night Hours Info */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                Night Hours Configuration
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Night surcharge will be applied from{" "}
                <span className="font-bold">
                  {formData.night_start_hour}:00
                </span>{" "}
                to{" "}
                <span className="font-bold">{formData.night_end_hour}:00</span>
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                Note: Times are in 24-hour format. If start hour is greater than
                end hour, it spans across midnight.
              </p>
            </div>

            {/* Important Notes */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Important Notes
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  This is a one-time setup. Use the Update tab for changes.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  All fare calculations are rounded to the nearest whole number.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Night surcharge is calculated on the total of base fare and
                  distance charge.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  These settings affect all rides across the platform.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialSetup;
