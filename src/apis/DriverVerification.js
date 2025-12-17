// services/driverVerificationAPI.js
import axiosInstance from "../utils/axiosInstance";

export const driverVerificationAPI = {
  // Get new registered drivers
  getNewDrivers: async () => {
    try {
      const response = await axiosInstance.get("/driver/newRegistered");
      return response.data;
    } catch (error) {
      console.error("Error fetching new drivers:", error);
      throw error;
    }
  },

  // Get rejected drivers
  getRejectedDrivers: async () => {
    try {
      const response = await axiosInstance.get("/driver/rejected");
      return response.data;
    } catch (error) {
      console.error("Error fetching rejected drivers:", error);
      throw error;
    }
  },

  // Approve driver 
  approveDriver: async (requestBody) => {
    try {
      const response = await axiosInstance.patch(
        "/driver/approve",
        requestBody
      );
      return response.data;
    } catch (error) {
      console.error("Error approving driver:", error);
      throw error;
    }
  },

  // Reject driver
  rejectDriver: async (requestBody) => {
    try {
      const response = await axiosInstance.patch("/driver/reject", requestBody);
      return response.data;
    } catch (error) {
      console.error("Error rejecting driver:", error);
      throw error;
    }
  },

  // Delete driver account
  deleteDriver: async (driverId) => {
    try {
      const response = await axiosInstance.delete(
        `/driver/deleteAccount/${driverId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting driver:", error);
      throw error;
    }
  },

  // Get driver details by ID
  getDriverById: async (driverId) => {
    try {
      const response = await axiosInstance.get("/driver");
      const drivers = response.data.data.drivers;
      const driver = drivers.find((d) => {
        const id =
          typeof d._id === "object" && "$oid" in d._id ? d._id.$oid : d._id;
        return id === driverId;
      });
      return driver;
    } catch (error) {
      console.error("Error fetching driver details:", error);
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

  // Get driver statistics
  getDriverStats: async () => {
    try {
      const [newDriversResponse, rejectedDriversResponse] = await Promise.all([
        axiosInstance.get("/driver/newRegistered"),
        axiosInstance.get("/driver/rejected"),
      ]);

      return {
        newDrivers: newDriversResponse.data.data.drivers || [],
        rejectedDrivers: rejectedDriversResponse.data.data.drivers || [],
      };
    } catch (error) {
      console.error("Error fetching driver statistics:", error);
      throw error;
    }
  },
};
