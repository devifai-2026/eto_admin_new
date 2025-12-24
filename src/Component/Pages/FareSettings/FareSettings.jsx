import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  FiSettings,
  FiClock,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { FaHistory, FaRupeeSign } from "react-icons/fa"; // Changed here
import { MdNightlight, MdSpeed } from "react-icons/md";
import CurrentFareSettings from "./CurrentFareSettings";
import UpdateFareForm from "./UpdateFareForm";
import FareCalculator from "./FareCalculator";
import FareHistory from "./FareHistory";
import ResetFareSettings from "./ResetFareSettings";
import InitialSetup from "./InitialSetup";
import fareSettingsAPI from "../../../apis/fareSettings";
import { toast } from "react-toastify";

const FareSettings = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [settingsExist, setSettingsExist] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(false);

  const tabs = [
    { id: "current", label: "Current Settings", icon: <FiSettings /> },
    { id: "update", label: "Update Settings", icon: <FaRupeeSign /> }, // Using actual rupee icon
    { id: "calculator", label: "Fare Calculator", icon: <MdSpeed /> },
    { id: "history", label: "Change History", icon: <FaHistory /> },
    {
      id: "reset",
      label: "Reset to Defaults",
      icon: <FiRefreshCw />,
    },
  ];

  const fetchFareSettings = async () => {
    try {
      setLoading(true);
      const response = await fareSettingsAPI.getCurrentSettings();

      if (response.success) {
        if (response.data) {
          setSettings(response.data);
          setSettingsExist(true);
          setIsInitialSetup(false);
        } else {
          // No settings exist, show initial setup
          setSettings(null);
          setSettingsExist(false);
          setIsInitialSetup(true);
          setActiveTab("setup");
        }
      } else {
        toast.error("Failed to load fare settings");
        setIsInitialSetup(true);
      }
    } catch (error) {
      console.error("Error fetching fare settings:", error);
      if (error.response?.status === 404) {
        // No settings found, show initial setup
        setIsInitialSetup(true);
        setSettingsExist(false);
      } else {
        toast.error("Error loading fare settings");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFareSettings();
  }, [refreshKey]);

  const handleSettingsUpdate = () => {
    toast.success("Fare settings updated successfully!");
    setRefreshKey((prev) => prev + 1);
    setActiveTab("current");
  };

  const handleReset = () => {
    toast.success("Fare settings reset to defaults!");
    setRefreshKey((prev) => prev + 1);
    setActiveTab("current");
  };

  const handleInitialSetup = () => {
    toast.success("Fare settings initialized successfully!");
    setRefreshKey((prev) => prev + 1);
    setActiveTab("current");
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (isInitialSetup) {
      return <InitialSetup onSuccess={handleInitialSetup} />;
    }

    switch (activeTab) {
      case "current":
        return <CurrentFareSettings settings={settings} />;
      case "update":
        return (
          <UpdateFareForm
            settings={settings}
            onSuccess={handleSettingsUpdate}
          />
        );
      case "calculator":
        return <FareCalculator settings={settings} />;
      case "history":
        return <FareHistory />;
      case "reset":
        return <ResetFareSettings onSuccess={handleReset} />;
      default:
        return <CurrentFareSettings settings={settings} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <Helmet>
        <title>Admin | Fare Settings</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <FiSettings className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Fare Settings Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isInitialSetup
                  ? "Initialize fare settings for the platform"
                  : "Configure and manage ride fare calculations across the platform"}
              </p>
            </div>
          </div>

          {/* Stats Summary - Only show if settings exist */}
          {!isInitialSetup && settings && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FaRupeeSign className="text-blue-600 dark:text-blue-400" /> {/* Changed here */}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Base Fare
                    </p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      ₹{settings.base_fare}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <MdSpeed className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Per KM Charge
                    </p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      ₹{settings.per_km_charge}/km
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <MdNightlight className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Night Surcharge
                    </p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {settings.night_surcharge_percentage}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <FiClock className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Night Hours
                    </p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {settings.night_start_hour}:00 - {settings.night_end_hour}
                      :00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tabs - Only show if settings exist */}
          {!isInitialSetup && settingsExist && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Tab Content */}
          <div className="p-6">{renderTabContent()}</div>
        </div>

        {/* Info Banner - Only show if settings exist */}
        {!isInitialSetup && settings && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">Fare Settings Information</p>
                <p>
                  Changes to fare settings affect all rides across the platform.
                  Night surcharge applies to rides starting between{" "}
                  {settings?.night_start_hour || 22}:00 and{" "}
                  {settings?.night_end_hour || 6}:00. All fare calculations are
                  rounded to the nearest whole number.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FareSettings;