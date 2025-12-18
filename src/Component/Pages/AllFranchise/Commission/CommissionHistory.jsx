import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FiArrowLeft, FiCalendar, FiUser, FiFilter } from "react-icons/fi";
import { toast } from "react-toastify";
import commissionAPI from "../../../../apis/commissionSettings";
import Pagination from "../../../../utils/Pagination";

const CommissionHistory = () => {
  const { franchiseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [franchiseInfo, setFranchiseInfo] = useState(null);
  const [historyData, setHistoryData] = useState({
    history: [],
    pagination: {
      total: 0,
      page: 1,
      pages: 1,
      limit: 10,
    },
  });

  useEffect(() => {
    fetchHistoryData();
  }, [franchiseId, filter, currentPage]);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        setting_type: filter === "all" ? "" : filter,
      };

      const response = await commissionAPI.getCommissionHistory(
        franchiseId,
        params
      );
      if (response.success) {
        setFranchiseInfo(response.data.franchise);
        setHistoryData({
          history: response.data.history,
          pagination: response.data.pagination,
        });
      }
    } catch (error) {
      toast.error("Failed to load commission history");
    } finally {
      setLoading(false);
    }
  };

  const getChangeTypeColor = (type) => {
    switch (type) {
      case "admin_commission":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "franchise_commission":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Helmet>
        <title>
          {franchiseInfo
            ? `Commission History - ${franchiseInfo.name}`
            : "Commission History"}
        </title>
      </Helmet>

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Back to Details
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              Commission History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {franchiseInfo?.name || "Loading..."}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Changes</option>
              <option value="admin_commission">Admin Commission</option>
              <option value="franchise_commission">Franchise Commission</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading history...</div>
        ) : historyData.history.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No commission history found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Change Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Changed By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {historyData.history.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(
                            item.setting_type
                          )}`}
                        >
                          {item.setting_type === "admin_commission"
                            ? "Admin Commission"
                            : "Franchise Commission"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <span className="font-medium">{item.field_name}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-gray-500 line-through">
                              {item.old_value}%
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              {item.new_value}%
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {item.changed_by?.name || "System"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.changed_by?.email || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatDate(item.changed_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                          {item.reason}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-200 dark:divide-gray-600">
              {historyData.history.map((item, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getChangeTypeColor(
                        item.setting_type
                      )}`}
                    >
                      {item.setting_type === "admin_commission"
                        ? "Admin Commission"
                        : "Franchise Commission"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(item.changed_at)}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 line-through">
                        {item.old_value}%
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {item.new_value}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Field: {item.field_name}
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="text-sm font-medium">
                      {item.changed_by?.name || "System"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.changed_by?.email || ""}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {historyData.pagination.pages > 1 && (
              <div className="border-t border-gray-200 dark:border-gray-600">
                <Pagination
                  pagination={historyData.pagination}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommissionHistory;