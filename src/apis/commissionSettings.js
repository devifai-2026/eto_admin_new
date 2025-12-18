import axiosInstance from "../utils/axiosInstance";

const commissionAPI = {
  // Get all franchises with commission settings
  getAllFranchisesWithSettings: async (params = {}) => {
    try {
      const response = await axiosInstance.get("/commission-settings", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Get commission settings failed:", error);
      throw error;
    }
  },

  // Get commission settings for specific franchise
  getFranchiseCommissionSettings: async (franchiseId) => {
    try {
      const response = await axiosInstance.get(
        `/commission-settings/${franchiseId}`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Get franchise commission settings failed:", error);
      throw error;
    }
  },

  // Update commission settings
  updateCommissionSettings: async (franchiseId, updateData) => {
    try {
      const response = await axiosInstance.put(
        `/commission-settings/${franchiseId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Update commission settings failed:", error);
      throw error;
    }
  },

  // Get commission history
  getCommissionHistory: async (franchiseId, params = {}) => {
    try {
      const response = await axiosInstance.get(
        `/commission-settings/${franchiseId}/history`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Get commission history failed:", error);
      throw error;
    }
  },

  // Deactivate commission settings
  deactivateSettings: async (franchiseId, reasonData) => {
    try {
      const response = await axiosInstance.put(
        `/commission-settings/${franchiseId}/deactivate`,
        reasonData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Deactivate commission settings failed:", error);
      throw error;
    }
  },

  // Reactivate commission settings
  reactivateSettings: async (franchiseId, reasonData) => {
    try {
      const response = await axiosInstance.put(
        `/commission-settings/${franchiseId}/reactivate`,
        reasonData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Reactivate commission settings failed:", error);
      throw error;
    }
  },

  // Create default commission settings
  createDefaultSettings: async (franchiseId) => {
    try {
      const response = await axiosInstance.post(
        `/commission-settings/${franchiseId}/create`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Create default settings failed:", error);
      throw error;
    }
  },

  // Get commission statistics
  getCommissionStats: async () => {
    try {
      const response = await axiosInstance.get("/commission-settings/stats");
      return response.data;
    } catch (error) {
      console.error("❌ Get commission stats failed:", error);
      throw error;
    }
  },
};

export default commissionAPI;
