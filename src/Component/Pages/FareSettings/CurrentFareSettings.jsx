import { FiUser, FiCalendar, FiInfo } from "react-icons/fi";

const CurrentFareSettings = ({ settings }) => {
  if (!settings) return null;

  const formatTime = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current Fare Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base Fare Card */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Base Fare
              </h4>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{settings.base_fare}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Initial charge applied to every ride, regardless of distance.
            </p>
          </div>

          {/* Per KM Charge Card */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Per Kilometer Charge
              </h4>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{settings.per_km_charge}/km
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Charge applied for each kilometer traveled during the ride.
            </p>
          </div>

          {/* Night Surcharge Card */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Night Surcharge
              </h4>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {settings.night_surcharge_percentage}%
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Additional percentage applied to total fare during night hours.
            </p>
          </div>

          {/* Night Hours Card */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Night Hours
              </h4>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatTime(settings.night_start_hour)} -{" "}
                {formatTime(settings.night_end_hour)}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Time period when night surcharge is applied.
            </p>
          </div>
        </div>
      </div>

      {/* Last Updated Information */}
      {settings.last_changed_by && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3 mb-3">
            <FiInfo className="text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-blue-800 dark:text-blue-300">
              Last Updated
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FiUser className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Updated By
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {settings.last_changed_by.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiCalendar className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last Updated
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(settings.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formula Explanation */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Fare Calculation Formula
        </h4>
        <div className="space-y-3">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Base Fare
            </p>
            <p className="font-medium">₹{settings.base_fare} (fixed)</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Distance Charge
            </p>
            <p className="font-medium">
              Distance (km) × ₹{settings.per_km_charge}
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Night Surcharge
            </p>
            <p className="font-medium">
              (Base Fare + Distance Charge) ×{" "}
              {settings.night_surcharge_percentage}%
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                (applies {formatTime(settings.night_start_hour)} -{" "}
                {formatTime(settings.night_end_hour)})
              </span>
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Fare
            </p>
            <p className="font-medium text-green-600 dark:text-green-400">
              Base Fare + Distance Charge + Night Surcharge (rounded to nearest
              whole number)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentFareSettings;
