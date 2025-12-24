import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Breadcrumbs from "../../Breadcrumbs/BreadCrumbs";
import StatsCards from "./StatsCards";
import FiltersSection from "./FiltersSection";
import DriverTable from "./DriverTable";
import { allDriverAPI } from "../../../apis/AllDriver";
import loginAPI from "../../../apis/Login";

const AllDrivers = () => {
  const navigate = useNavigate();

  // State management
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get current user information
  const getCurrentUserInfo = useCallback(() => {
    const user = loginAPI.getCurrentUser();
    const userType = loginAPI.getUserType();

    return {
      user,
      userType,
      userId: user?._id,
      franchiseId: user?._id,
    };
  }, []);

  // Fetch drivers data from API
  const fetchDrivers = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        // Get current user information
        const { userType, userId, franchiseId } = getCurrentUserInfo();

        // Prepare query parameters for the API
        const apiParams = {
          page: currentPage,
          limit: itemsPerPage,
          ...params,
        };

        // Add user type specific parameters
        if (userType === "admin" && userId) {
          apiParams.adminId = userId;
        } else if (userType === "franchise" && franchiseId) {
          apiParams.franchiseId = franchiseId;
        }

        // If there's a search term, add it to params
        if (searchTerm.trim() !== "") {
          apiParams.search = searchTerm;
        }

        // If active filter is not "all", add isActive parameter
        if (activeFilter !== "all") {
          apiParams.isActive = activeFilter === "active";
        }

        // Remove undefined values
        Object.keys(apiParams).forEach(
          (key) => apiParams[key] === undefined && delete apiParams[key]
        );

        console.log("Fetching drivers with params:", apiParams);

        const response = await allDriverAPI.getAllDrivers(apiParams);

        console.log("API Response:", response);

        if (response.status === 200) {
          const data = response.data.data;

          // Set summary statistics
          if (data.summary) {
            setSummary(data.summary);
          }

          // Set drivers data
          if (data.drivers && Array.isArray(data.drivers)) {
            setDrivers(data.drivers);
            setFilteredDrivers(data.drivers);
          } else {
            setDrivers([]);
            setFilteredDrivers([]);
          }
        } else {
          throw new Error(response.message || "Failed to fetch drivers");
        }
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError(err.message || "Failed to load drivers");
        setDrivers([]);
        setFilteredDrivers([]);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, itemsPerPage, searchTerm, activeFilter, getCurrentUserInfo]
  );

  // Initial fetch
  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Apply filters with debouncing - CLIENT SIDE FILTERING
  // Note: This is now mainly for local UI filtering as API already handles filtering
  useEffect(() => {
    const timerId = setTimeout(() => {
      // Only apply client-side filtering if we have a search term
      // For activeFilter, we're already passing to API
      if (searchTerm.trim() === "") {
        // If no search term, just use the original drivers
        setFilteredDrivers(drivers);
      } else {
        // Apply local search filter on already fetched data
        applyLocalFilters();
      }
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm, drivers]);

  // Apply local filters (client-side)
  const applyLocalFilters = useCallback(() => {
    let result = [...drivers];

    // Apply search filter locally
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((driver) => {
        const nameMatch = driver.name?.toLowerCase().includes(term) || false;
        const emailMatch = driver.email?.toLowerCase().includes(term) || false;
        const phoneMatch = driver.phone?.includes(term) || false;
        const etoIdMatch =
          driver.etoCard?.eto_id_num?.toLowerCase().includes(term) || false;

        return nameMatch || emailMatch || phoneMatch || etoIdMatch;
      });
    }

    setFilteredDrivers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, drivers]);

  // Handle search or filter change - FETCH FROM API
  useEffect(() => {
    // When search term changes significantly or active filter changes, fetch from API
    const timerId = setTimeout(() => {
      fetchDrivers();
    }, 800); // Slightly longer debounce for API calls

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm, activeFilter]);

  // Handle driver deletion
  const handleDeleteDriver = async (driverId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this driver? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await allDriverAPI.deleteDriver(driverId);
      // Refetch data after deletion
      fetchDrivers();
    } catch (error) {
      alert("Failed to delete driver. Please try again.");
      console.error(error);
    }
  };

  // Handle driver view
  const viewDriverDetails = (driverId) => {
    navigate(`/all-driver-details/${driverId}`);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Page change will trigger fetchDrivers via useEffect dependency
  };

  if (error && !loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | All Drivers</title>
      </Helmet>
      <Breadcrumbs />

      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            All Drivers
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage and monitor all registered drivers in the system
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards summary={summary} />

        {/* Filters Section */}
        <FiltersSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Driver Table with Pagination */}
        <DriverTable
          drivers={drivers}
          filteredDrivers={filteredDrivers}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={handlePageChange} // Updated to use handler
          viewDriverDetails={viewDriverDetails}
          handleDeleteDriver={handleDeleteDriver}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AllDrivers;
