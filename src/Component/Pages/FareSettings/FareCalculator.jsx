import { useState, useEffect } from "react";
import { FiNavigation, FiCalendar, FiDollarSign } from "react-icons/fi";
import { FaCalculator } from "react-icons/fa";
import { MdNightlight, MdCalculate } from "react-icons/md";
import fareSettingsAPI from "../../../apis/fareSettings";
import { toast } from "react-toastify";

const FareCalculator = ({ settings }) => {
  const [loading, setLoading] = useState(false);
  const [calculation, setCalculation] = useState(null);
  const [formData, setFormData] = useState({
    distance_km: "",
    ride_start_time: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.distance_km || formData.distance_km <= 0) {
      newErrors.distance_km = "Distance must be greater than 0";
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

  const calculateFare = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const calculationData = {
        distance_km: parseFloat(formData.distance_km),
        ride_start_time: formData.ride_start_time || new Date().toISOString(),
      };

      const response = await fareSettingsAPI.calculateFare(calculationData);

      if (response.success) {
        setCalculation(response.data);
      } else {
        toast.error(response.message || "Failed to calculate fare");
      }
    } catch (error) {
      console.error("Error calculating fare:", error);
      toast.error(error.response?.data?.message || "Failed to calculate fare");
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setCalculation(null);
    setFormData({
      distance_km: "",
      ride_start_time: "",
    });
    setErrors({});
  };

  // Pre-fill current time as default
  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toISOString().slice(0, 16);
    setFormData((prev) => ({
      ...prev,
      ride_start_time: formattedTime,
    }));
  }, []);

  // Reset calculation when settings change
  useEffect(() => {
    setCalculation(null);
  }, [settings]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-3 mb-4">
          <FaCalculator className="text-2xl text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Fare Calculator
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Calculate estimated fare based on distance and time
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <form onSubmit={calculateFare} className="space-y-6">
            {/* Distance Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Distance (kilometers) *
              </label>
              <div className="relative">
                <FiNavigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.distance_km}
                  onChange={(e) =>
                    handleInputChange("distance_km", e.target.value)
                  }
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.distance_km
                      ? "border-red-300 dark:border-red-700"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Enter distance in kilometers"
                />
              </div>
              {errors.distance_km && (
                <span className="text-xs text-red-600 dark:text-red-400 mt-1 block">
                  {errors.distance_km}
                </span>
              )}
            </div>

            {/* Ride Start Time Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ride Start Time
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="datetime-local"
                  value={formData.ride_start_time}
                  onChange={(e) =>
                    handleInputChange("ride_start_time", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty to use current time. Night surcharge applies between{" "}
                {settings?.night_start_hour || 22}:00 and{" "}
                {settings?.night_end_hour || 6}:00.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <MdCalculate size={18} />
                    <span>Calculate Fare</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetCalculator}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Current Settings Display */}
          {settings && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Current Fare Settings
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-sm">
                  <p className="text-gray-500 dark:text-gray-400">Base Fare</p>
                  <p className="font-medium">₹{settings.base_fare}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 dark:text-gray-400">Per KM</p>
                  <p className="font-medium">₹{settings.per_km_charge}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 dark:text-gray-400">
                    Night Surcharge
                  </p>
                  <p className="font-medium">
                    {settings.night_surcharge_percentage}%
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 dark:text-gray-400">
                    Night Hours
                  </p>
                  <p className="font-medium">
                    {settings.night_start_hour}:00 - {settings.night_end_hour}
                    :00
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calculation Results */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Calculation Results
          </h3>

          {calculation ? (
            <div className="space-y-6">
              {/* Total Fare Card */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-xl p-5 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Fare
                    </p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      ₹{calculation.fare_calculation.total_fare}
                    </p>
                  </div>
                  <FiDollarSign className="text-3xl text-green-500 dark:text-green-400" />
                </div>
                {calculation.fare_calculation.is_night_time && (
                  <div className="mt-3 inline-flex items-center px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-sm">
                    <MdNightlight className="mr-2" />
                    Night Surcharge Applied
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                        <FiDollarSign className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Base Fare
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Fixed charge
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ₹{calculation.fare_calculation.base_fare}
                    </p>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                        <FiNavigation className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Distance Charge
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {calculation.fare_calculation.distance_km} km × ₹
                          {calculation.fare_settings.per_km_charge}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ₹{calculation.fare_calculation.distance_charge}
                    </p>
                  </div>

                  {calculation.fare_calculation.is_night_time && (
                    <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded">
                          <MdNightlight className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Night Surcharge
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {
                              calculation.fare_calculation
                                .night_surcharge_percentage
                            }
                            % of subtotal
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-amber-600 dark:text-amber-400">
                        ₹{calculation.fare_calculation.night_surcharge_amount}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Ride Information
                    </p>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {calculation.fare_calculation.distance_km} km
                      </p>
                      {calculation.fare_calculation.is_night_time ? (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Night Ride
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Day Ride
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Formula */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calculation Formula
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <code className="text-sm text-gray-700 dark:text-gray-300">
                    Total = Base Fare (₹{calculation.fare_calculation.base_fare}
                    ) + <br />
                    (Distance {calculation.fare_calculation.distance_km}km × ₹
                    {calculation.fare_settings.per_km_charge})
                    {calculation.fare_calculation.is_night_time ? " + " : ""}
                    {calculation.fare_calculation.is_night_time && (
                      <>
                        <br />(
                        {calculation.fare_calculation.base_fare +
                          calculation.fare_calculation.distance_charge}{" "}
                        ×{" "}
                        {
                          calculation.fare_calculation
                            .night_surcharge_percentage
                        }
                        %)
                      </>
                    )}
                  </code>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaCalculator className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Enter distance and time to calculate fare
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FareCalculator;
