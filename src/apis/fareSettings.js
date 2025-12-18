import axiosInstance from "../utils/axiosInstance";

const fareSettingsAPI = {
  // Get current fare settings
  getCurrentSettings: async () => {
    try {
      const response = await axiosInstance.get("/fare-settings");
      return response.data;
    } catch (error) {
      console.error("Error fetching fare settings:", error);
      throw error;
    }
  },

  // Create initial fare settings
  createSettings: async (settingsData) => {
    try {
      const response = await axiosInstance.post("/fare-settings", settingsData);
      return response.data;
    } catch (error) {
      console.error("Error creating fare settings:", error);
      throw error;
    }
  },

  // Update fare settings
  updateSettings: async (updateData) => {
    try {
      const response = await axiosInstance.put(
        "/fare-settings/update",
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating fare settings:", error);
      throw error;
    }
  },

  // Calculate fare
  calculateFare: async (calculationData) => {
    try {
      const response = await axiosInstance.post(
        "/fare-settings/calculate",
        calculationData
      );
      return response.data;
    } catch (error) {
      console.error("Error calculating fare:", error);
      throw error;
    }
  },

  // Get fare history
  getFareHistory: async (params = {}) => {
    try {
      const response = await axiosInstance.get("/fare-settings/history", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching fare history:", error);
      throw error;
    }
  },

  // Reset to defaults
  resetToDefaults: async (reason) => {
    try {
      const response = await axiosInstance.post("/fare-settings/reset", {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error resetting fare settings:", error);
      throw error;
    }
  },

  // Delete fare settings (for testing)
  deleteSettings: async () => {
    try {
      const response = await axiosInstance.delete("/fare-settings");
      return response.data;
    } catch (error) {
      console.error("Error deleting fare settings:", error);
      throw error;
    }
  },

  // Check if settings exist
  checkSettingsExist: async () => {
    try {
      const response = await axiosInstance.get("/fare-settings");
      return response.data.success && response.data.data !== null;
    } catch (error) {
      console.error("Error checking fare settings:", error);
      return false;
    }
  },
};

export default fareSettingsAPI;