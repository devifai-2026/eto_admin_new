import { useState } from "react";
import { FiAlertTriangle, FiRefreshCw, FiInfo, FiShield } from "react-icons/fi";
import fareSettingsAPI from "../../../apis/fareSettings";
import { toast } from "react-toastify";

const ResetFareSettings = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const defaultValues = {
    base_fare: 20,
    per_km_charge: 8,
    night_surcharge_percentage: 20,
    night_start_hour: 22,
    night_end_hour: 6,
  };

  const handleReset = async () => {
    if (confirmText !== "RESET FARES") {
      toast.error('Please type "RESET FARES" to confirm');
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for resetting");
      return;
    }

    setLoading(true);
    try {
      const response = await fareSettingsAPI.resetToDefaults(reason);

      if (response.success) {
        toast.success("Fare settings reset to defaults successfully!");
        onSuccess();
        setReason("");
        setConfirmText("");
      } else {
        toast.error(response.message || "Failed to reset fare settings");
      }
    } catch (error) {
      console.error("Error resetting fare settings:", error);
      toast.error(
        error.response?.data?.message || "Failed to reset fare settings"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
        <div className="flex items-start space-x-3">
          <FiAlertTriangle className="text-red-600 dark:text-red-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
              ⚠️ Critical Action Warning
            </h4>
            <p className="text-red-700 dark:text-red-400 mb-3">
              Resetting fare settings will revert all values to their defaults.
              This action:
            </p>
            <ul className="list-disc list-inside text-red-700 dark:text-red-400 space-y-1">
              <li>Will affect all future ride calculations</li>
              <li>Cannot be undone automatically</li>
              <li>Will be logged in the change history</li>
              <li>Requires administrator confirmation</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reset Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Reset to Default Values
          </h3>

          <div className="space-y-6">
            {/* Reason Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Reset *
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Provide a detailed reason for resetting fare settings to defaults..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This reason will be recorded in the change history.
              </p>
            </div>

            {/* Confirmation Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type <span className="font-mono text-red-600">RESET FARES</span>{" "}
                to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                placeholder="Type RESET FARES here..."
              />
              <div className="flex items-center space-x-2 mt-2">
                <FiShield className="text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This additional confirmation prevents accidental resets.
                </p>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              disabled={
                loading || confirmText !== "RESET FARES" || !reason.trim()
              }
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <FiRefreshCw size={18} />
                  <span>Reset to Defaults</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Default Values Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <FiInfo className="text-2xl text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Default Values Preview
            </h3>
          </div>

          <div className="space-y-4">
            {Object.entries(defaultValues).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {key === "night_start_hour" || key === "night_end_hour"
                      ? "Hour (0-23)"
                      : key === "night_surcharge_percentage"
                      ? "Percentage"
                      : "Rupees"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {key === "base_fare" || key === "per_km_charge"
                      ? `₹${value}`
                      : key === "night_surcharge_percentage"
                      ? `${value}%`
                      : `${value}:00`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Default Value
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Formula Preview */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Default Fare Calculation
            </h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Base Fare:</span>
                  <span className="font-mono">₹{defaultValues.base_fare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Per KM Charge:</span>
                  <span className="font-mono">
                    ₹{defaultValues.per_km_charge} per km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Night Surcharge:</span>
                  <span className="font-mono">
                    {defaultValues.night_surcharge_percentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Night Hours:</span>
                  <span className="font-mono">
                    {defaultValues.night_start_hour}:00 -{" "}
                    {defaultValues.night_end_hour}:00
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between font-medium">
                    <span>Example (5km Day Ride):</span>
                    <span className="font-mono">
                      ₹{defaultValues.base_fare} + (5 × ₹
                      {defaultValues.per_km_charge}) = ₹
                      {defaultValues.base_fare +
                        5 * defaultValues.per_km_charge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetFareSettings;
