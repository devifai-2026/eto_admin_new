import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { TbKeyframeAlignCenter } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import franchiseAPI from "../../../../apis/franchise";

// Import components
import FranchiseStats from "./FranchiseStats";
import FranchiseFilters from "./FranchiseFilters";
import Pagination from "../../../../utils/Pagination";
import FranchiseTableRow from "./FranchiseTableRow";
import MobileFranchiseCard from "./MobileFranchiseCard";
import EmptyState from "./EmptyState";
import ActionModal from "./ActionModal";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

const AllFranchise = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [franchisesData, setFranchisesData] = useState({
    summary: {
      total_franchises: 0,
      active_franchises: 0,
      approved_franchises: 0,
      total_drivers: 0,
      total_completed_rides: 0,
      total_franchise_earnings: 0,
      total_admin_earnings: 0,
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

  // Fetch franchises data with debounced search
  const fetchFranchises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
      };

      const response = await franchiseAPI.getAllFranchises(params);

      if (response.success) {
        setFranchisesData(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch franchises");
      }
    } catch (err) {
      console.error("Error fetching franchises:", err);
      setError(err.message || "Failed to load franchises. Please try again.");
      toast.error("Failed to load franchises");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, itemsPerPage]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchFranchises();
      } else {
        setCurrentPage(1);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  // Fetch when page changes
  useEffect(() => {
    fetchFranchises();
  }, [currentPage]);

  // Action handlers
  const handleViewDetails = (franchise) => {
    navigate(`/franchise-details/${franchise._id}`, { state: { franchise } });
  };

  const handleEdit = (franchise) => {
    navigate(`/edit-franchise/${franchise._id}`);
  };

  const handleDelete = async (franchise) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${franchise.name}? This action cannot be undone.`
      )
    ) {
      try {
        await franchiseAPI.deleteFranchise(franchise._id);
        toast.success("Franchise deleted successfully");
        fetchFranchises(); // Refresh the list
        setShowActionModal(false);
      } catch (error) {
        toast.error("Failed to delete franchise");
        console.error("Delete error:", error);
      }
    }
  };

  const handleAddPincode = (franchise) => {
    navigate(`/add-pinCode/${franchise._id}`, { state: { franchise } });
    setShowActionModal(false);
  };

  const handleUpdateStatus = async (franchiseId, statusData) => {
    try {
      await franchiseAPI.updateFranchiseStatus(franchiseId, statusData);
      toast.success("Franchise status updated");
      fetchFranchises(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Update status error:", error);
    }
  };

  const openActionMenu = (franchiseId, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === franchiseId ? null : franchiseId);
  };

  const openActionModal = (franchise) => {
    setSelectedFranchise(franchise);
    setShowActionModal(true);
    setActiveMenu(null);
  };

  const getStatusBadge = (isActive, isApproved) => {
    if (!isApproved) {
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    } else if (isActive) {
      return "bg-green-100 text-green-800 border border-green-300";
    } else {
      return "bg-red-100 text-red-800 border border-red-300";
    }
  };

  const getStatusText = (isActive, isApproved) => {
    if (!isApproved) return "Pending";
    return isActive ? "Active" : "Inactive";
  };

  // Loading state
  if (loading && !franchisesData.franchises.length) {
    return <LoadingState retry={fetchFranchises} />;
  }

  // Error state
  if (error && !franchisesData.franchises.length) {
    return <ErrorState error={error} retry={fetchFranchises} />;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>Admin | All Franchise</title>
      </Helmet>

      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <TbKeyframeAlignCenter className="text-2xl sm:text-3xl text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              All Franchises
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage and monitor all franchise partners in the system
          </p>
        </div>

        {/* Stats Section */}
        <FranchiseStats summary={franchisesData.summary} />

        {/* Filters Section */}
        <FranchiseFilters
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
              Franchise List ({franchisesData.pagination.total} franchises)
            </h2>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden">
            {franchisesData.franchises.map((franchise) => (
              <MobileFranchiseCard
                key={franchise._id}
                franchise={franchise}
                activeMenu={activeMenu}
                openActionMenu={openActionMenu}
                handleViewDetails={handleViewDetails}
                handleAddPincode={handleAddPincode}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                getStatusBadge={getStatusBadge}
                getStatusText={getStatusText}
              />
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            {franchisesData.franchises.length > 0 ? (
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Franchise
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Contact
                    </th>
                    {/* <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th> */}
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Statistics
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {franchisesData.franchises.map((franchise) => (
                    <FranchiseTableRow
                      key={franchise._id}
                      franchise={franchise}
                      activeMenu={activeMenu}
                      openActionMenu={openActionMenu}
                      handleViewDetails={handleViewDetails}
                      handleEdit={handleEdit}
                      handleAddPincode={handleAddPincode}
                      handleDelete={handleDelete}
                      getStatusBadge={getStatusBadge}
                      getStatusText={getStatusText}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState searchTerm={searchTerm} statusFilter={statusFilter} />
            )}
          </div>

          {/* Empty State for Mobile */}
          {franchisesData.franchises.length === 0 && (
            <EmptyState searchTerm={searchTerm} statusFilter={statusFilter} />
          )}

          {/* Pagination */}
          {franchisesData.franchises.length > 0 &&
            franchisesData.pagination.pages > 1 && (
              <Pagination
                pagination={franchisesData.pagination}
                onPageChange={setCurrentPage}
              />
            )}
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedFranchise && (
        <ActionModal
          franchise={selectedFranchise}
          onClose={() => setShowActionModal(false)}
          onView={() => handleViewDetails(selectedFranchise)}
          onEdit={() => handleEdit(selectedFranchise)}
          onAddPincode={() => handleAddPincode(selectedFranchise)}
          onDelete={() => handleDelete(selectedFranchise)}
        />
      )}
    </div>
  );
};

export default AllFranchise;
