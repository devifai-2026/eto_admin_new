import axiosInstance from "../utils/axiosInstance";

export const allDriverAPI = {
  // Get all drivers
  getAllDrivers: async (params = {}) => {
    try {
      console.log("API Call: GET /driver with params:", params);
      const response = await axiosInstance.get("/driver", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || undefined,
          isActive: params.isActive,
          isOnRide: params.isOnRide,
          sortBy: params.sortBy || "createdAt",
          sortOrder: params.sortOrder || "desc",
          franchiseId: params.franchiseId,
          adminId: params.adminId,
        },
      });
      console.log("API Response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching all drivers:", error);
      // Return a consistent error response
      return {
        status: error.response?.status || 500,
        data: null,
        message: error.response?.data?.message || "Failed to fetch drivers",
      };
    }
  },

  // Get driver by ID
  getDriverById: async (driverId) => {
    try {
      const response = await axiosInstance.get(`/driver/admin/${driverId}`);
      const driver = response.data;
      return driver;
    } catch (error) {
      console.error("Error fetching driver details:", error);
      throw error;
    }
  },

  // Delete driver
  deleteDriver: async (driverId) => {
    try {
      const response = await axiosInstance.delete(`/driver/deleteAccount/${driverId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting driver:", error);
      throw error;
    }
  },

  // Update driver status
  updateDriverStatus: async (driverId, status) => {
    try {
      const response = await axiosInstance.patch(`/driver/${driverId}`, {
        isActive: status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating driver status:", error);
      throw error;
    }
  },
};
