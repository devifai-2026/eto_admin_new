// components/Layout/Layout.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Dashboard from "../Pages/Dashboard";
import TopDrivers from "../Pages/TopDrivers";
import AllDrivers from "../Pages/AllDrivers";
import AllPassengers from "../Pages/AllPassengers";
import ActiveRides from "../Pages/ActiveRides";
import DueRequest from "../Pages/DueRequest";
import RideHistory from "../Pages/RideHistory";
import DriverVerification from "../Pages/DriverVerification";
import TopDriverDetails from "../Pages/TopDriverDetails";
import AllDriverDetails from "../Pages/AllDriverDetails";
import AllPassengersDetails from "../Pages/AllPassengersDetails";
import ActiveRidesDetails from "../Pages/ActiveRidesDetails";
import DueRequestDetails from "../Pages/DueRequestDetails";
import RideHistoryDetails from "../Pages/RideHistoryDetails";
import AddFranchise from "../Pages/AddFranchise/AddFranchise";
import AllFranchise from "../Pages/AllFranchise/Franchice/AllFranchise";
import AllFranchiseDetails from "../Pages/AllFranchise/FranchiseDetails/AllFranchiseDetails";
import AddPinCode from "../Pages/AllFranchise/AddPinCode";
import FranchiseDrivers from "../Pages/AllFranchise/FrinchiseDrivers/FranchiseDrivers";
import FranchiseDriverDetails from "../Pages/AllFranchise/FranchiseDriverDetails";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import FareSettings from "../Pages/FareSettings/FareSettings";
import AllCommissionSettings from "../Pages/AllFranchise/Commission/AllCommissionSettings";
import CommissionSettingsDetails from "../Pages/AllFranchise/Commission/CommissionSettingsDetails";
import EditCommissionSettings from "../Pages/AllFranchise/Commission/EditCommissionSettings";
import CommissionHistory from "../Pages/AllFranchise/Commission/CommissionHistory";
import DriversWithoutFranchise from "../Pages/AllFranchise/DriverWithoutFranchise/DriversWithoutFranchise";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      return stored === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const htmlElement = document.documentElement;

    if (isDarkMode) {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar - Fixed */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onThemeToggle={handleThemeToggle}
          isDarkMode={isDarkMode}
          onLogout={handleLogout}
        />

        {/* Main Content - Scrollable */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <Routes>
            {/* Add this route for the root path */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/top-drivers"
              element={
                <ProtectedRoute>
                  <TopDrivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/top-driver-details/:driverId"
              element={
                <ProtectedRoute>
                  <TopDriverDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-drivers"
              element={
                <ProtectedRoute>
                  <AllDrivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-driver-details/:driverId"
              element={
                <ProtectedRoute>
                  <AllDriverDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-passengers"
              element={
                <ProtectedRoute>
                  <AllPassengers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-passenger-details/:passengerId"
              element={
                <ProtectedRoute>
                  <AllPassengersDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/active-rides"
              element={
                <ProtectedRoute>
                  <ActiveRides />
                </ProtectedRoute>
              }
            />
            <Route
              path="/active-rides-details/:activeRideId"
              element={
                <ProtectedRoute>
                  <ActiveRidesDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/due-request"
              element={
                <ProtectedRoute>
                  <DueRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/due-request/:dueRequestId"
              element={
                <ProtectedRoute>
                  <DueRequestDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ride-history"
              element={
                <ProtectedRoute>
                  <RideHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ride-history/:rideHistoryId"
              element={
                <ProtectedRoute>
                  <RideHistoryDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-verification"
              element={
                <ProtectedRoute>
                  <DriverVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drivers-without-franchise"
              element={
                <ProtectedRoute>
                  <DriversWithoutFranchise />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-franchise"
              element={
                <ProtectedRoute>
                  <AddFranchise />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-franchise/:franchiseId"
              element={
                <ProtectedRoute>
                  <AddFranchise />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-franchise"
              element={
                <ProtectedRoute>
                  <AllFranchise />
                </ProtectedRoute>
              }
            />
            <Route
              path="/franchise-drivers/:franchiseId"
              element={
                <ProtectedRoute>
                  <FranchiseDrivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/franchise-drivers-details/:driverId"
              element={
                <ProtectedRoute>
                  <FranchiseDriverDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/franchise-details/:franchiseId"
              element={
                <ProtectedRoute>
                  <AllFranchiseDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-pinCode/:id"
              element={
                <ProtectedRoute>
                  <AddPinCode />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fare-settings"
              element={
                <ProtectedRoute>
                  <FareSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fare-settings"
              element={
                <ProtectedRoute>
                  <FareSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/commission-settings"
              element={
                <ProtectedRoute>
                  <AllCommissionSettings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/commission-settings/:franchiseId"
              element={
                <ProtectedRoute>
                  <CommissionSettingsDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/commission-settings/:franchiseId/edit"
              element={
                <ProtectedRoute>
                  <EditCommissionSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/commission-settings/:franchiseId/history"
              element={
                <ProtectedRoute>
                  <CommissionHistory />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route for undefined paths */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      404
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Page not found
                    </p>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;
