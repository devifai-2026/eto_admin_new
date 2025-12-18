import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { TbSettings } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import commissionAPI from "../../../../apis/commissionSettings";

// Import components
import CommissionStats from "./CommissionStats";
import CommissionFilters from "./CommissionFilters";
import Pagination from "../../../../utils/Pagination";
import CommissionTableRow from "./CommissionTableRow";
import MobileCommissionCard from "./MobileCommissionCard";
import EmptyState from "../Franchice/EmptyState";
import ActionModal from "./ActionModal";
import LoadingState from "../Franchice/LoadingState";
import ErrorState from "../Franchice/ErrorState";

const AllCommissionSettings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commissionData, setCommissionData] = useState({
    summary: {
      total_franchises: 0,
      active_franchises: 0,
      pending_settings: 0,
      total_commission_changes: 0,
      total_admin_commission: 0,
      total_franchise_commission: 0,
    },
    franchises: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  });

  // Fetch franchises with commission settings data
  const fetchCommissionSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
      };

      const response = await commissionAPI.getAllFranchisesWithSettings(params);

      if (response.success) {
        setCommissionData(response.data);
      } else {
        throw new Error(
          response.message || "Failed to fetch commission settings"
        );
      }
    } catch (err) {
      console.error("Error fetching commission settings:", err);
      setError(
        err.message || "Failed to load commission settings. Please try again."
      );
      toast.error("Failed to load commission settings");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, itemsPerPage]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchCommissionSettings();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, fetchCommissionSettings]);

  // Fetch when page changes
  useEffect(() => {
    fetchCommissionSettings();
  }, [currentPage, fetchCommissionSettings]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Action handlers
  const handleViewDetails = (franchiseItem) => {
    navigate(`/commission-settings/${franchiseItem.franchise._id}`, {
      state: {
        franchise: franchiseItem.franchise,
        commission_settings: franchiseItem.commission_settings,
      },
    });
  };

  const handleEdit = (franchiseItem) => {
    navigate(`/commission-settings/${franchiseItem.franchise._id}/edit`, {
      state: {
        franchise: franchiseItem.franchise,
        commission_settings: franchiseItem.commission_settings,
      },
    });
  };

  const handleViewHistory = (franchiseItem) => {
    navigate(`/commission-settings/${franchiseItem.franchise._id}/history`, {
      state: {
        franchise: franchiseItem.franchise,
        commission_settings: franchiseItem.commission_settings,
      },
    });
  };

  const handleActivate = async (franchiseItem) => {
    try {
      const franchiseId = franchiseItem.franchise._id;
      await commissionAPI.reactivateSettings(franchiseId, {
        reason: "Activated by admin",
      });
      toast.success("Commission settings activated successfully");
      fetchCommissionSettings();
      setShowActionModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to activate commission settings"
      );
      console.error("Activation error:", error);
    }
  };

  const handleDeactivate = async (franchiseItem) => {
    const franchiseName = franchiseItem.franchise.name;
    if (
      window.confirm(
        `Are you sure you want to deactivate commission settings for ${franchiseName}?`
      )
    ) {
      try {
        const franchiseId = franchiseItem.franchise._id;
        await commissionAPI.deactivateSettings(franchiseId, {
          reason: "Deactivated by admin",
        });
        toast.success("Commission settings deactivated");
        fetchCommissionSettings();
        setShowActionModal(false);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to deactivate commission settings"
        );
        console.error("Deactivation error:", error);
      }
    }
  };

  const openActionMenu = (franchiseId, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === franchiseId ? null : franchiseId);
  };

  const openActionModal = (franchiseItem) => {
    setSelectedCommission(franchiseItem);
    setShowActionModal(true);
    setActiveMenu(null);
  };

  const getStatusBadge = (settings) => {
    if (!settings) {
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    } else if (!settings.isActive) {
      return "bg-red-100 text-red-800 border border-red-300";
    } else {
      return "bg-green-100 text-green-800 border border-green-300";
    }
  };

  const getStatusText = (settings) => {
    if (!settings) return "Not Configured";
    return settings.isActive ? "Active" : "Inactive";
  };

  const getCommissionRates = (franchise) => {
    if (franchise.commission_settings) {
      return {
        admin: franchise.commission_settings.admin_commission_rate,
        franchise: franchise.commission_settings.franchise_commission_rate,
      };
    }
    return { admin: "N/A", franchise: "N/A" };
  };

  // Loading state
  if (loading && commissionData.franchises?.length === 0) {
    return <LoadingState retry={fetchCommissionSettings} />;
  }

  // Error state
  if (error && commissionData.franchises.length === 0) {
    return <ErrorState error={error} retry={fetchCommissionSettings} />;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | Commission Settings</title>
      </Helmet>

      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <TbSettings className="text-2xl sm:text-3xl text-purple-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              Commission Settings
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage commission rates for all franchise partners
          </p>
        </div>

        {/* Stats Section */}
        <CommissionStats summary={commissionData.summary} />

        {/* Filters Section */}
        <CommissionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Franchise Commission Settings (
              {commissionData.pagination?.total || 0} franchises)
            </h2>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden">
            {commissionData.franchises?.length > 0 ? (
              commissionData.franchises.map((item) => (
                <MobileCommissionCard
                  key={item.franchise._id}
                  franchise={item.franchise}
                  commissionSettings={item.commission_settings}
                  activeMenu={activeMenu}
                  openActionMenu={openActionMenu}
                  openActionModal={openActionModal}
                  handleViewDetails={() => handleViewDetails(item)}
                  handleEdit={() => handleEdit(item)}
                  handleViewHistory={() => handleViewHistory(item)}
                  handleActivate={() => handleActivate(item)}
                  handleDeactivate={() => handleDeactivate(item)}
                  getStatusBadge={getStatusBadge}
                  getStatusText={getStatusText}
                  getCommissionRates={() => getCommissionRates(item)}
                />
              ))
            ) : (
              <EmptyState searchTerm={searchTerm} statusFilter={statusFilter} />
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            {commissionData.franchises?.length > 0 ? (
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Franchise
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Commission Rates
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {commissionData.franchises.map((item) => (
                    <CommissionTableRow
                      key={item.franchise._id}
                      franchise={item.franchise}
                      commissionSettings={item.commission_settings}
                      activeMenu={activeMenu}
                      openActionMenu={openActionMenu}
                      openActionModal={() => openActionModal(item)}
                      handleViewDetails={() => handleViewDetails(item)}
                      handleEdit={() => handleEdit(item)}
                      handleViewHistory={() => handleViewHistory(item)}
                      handleActivate={() => handleActivate(item)}
                      handleDeactivate={() => handleDeactivate(item)}
                      getStatusBadge={getStatusBadge}
                      getStatusText={getStatusText}
                      getCommissionRates={() => getCommissionRates(item)}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState searchTerm={searchTerm} statusFilter={statusFilter} />
            )}
          </div>

          {/* Pagination */}
          {commissionData.franchises?.length > 0 &&
            commissionData.pagination?.pages > 1 && (
              <Pagination
                pagination={commissionData.pagination}
                onPageChange={setCurrentPage}
              />
            )}
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedCommission && (
        <ActionModal
          franchise={selectedCommission.franchise}
          commissionSettings={selectedCommission.commission_settings}
          onClose={() => setShowActionModal(false)}
          onView={() => handleViewDetails(selectedCommission)}
          onEdit={() => handleEdit(selectedCommission)}
          onViewHistory={() => handleViewHistory(selectedCommission)}
          onActivate={() => handleActivate(selectedCommission)}
          onDeactivate={() => handleDeactivate(selectedCommission)}
        />
      )}
    </div>
  );
};

export default AllCommissionSettings;
