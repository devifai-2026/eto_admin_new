
import axiosInstance from "../utils/axiosInstance";

export const allDriverAPI = {
  // Get all drivers
  getAllDrivers: async () => {
    try {
      const response = await axiosInstance.get('/driver');
      return response.data;
    } catch (error) {
      console.error('Error fetching all drivers:', error);
      throw error;
    }
  },

  // Get driver by ID
  getDriverById: async (driverId) => {
    try {
      const response = await axiosInstance.get(`/driver/${driverId}`);
      const driver = response.data;
      return driver;
    } catch (error) {
      console.error('Error fetching driver details:', error);
      throw error;
    }
  },

  // Delete driver
  deleteDriver: async (driverId) => {
    try {
      const response = await axiosInstance.delete(`/deleteAccount/${driverId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting driver:', error);
      throw error;
    }
  },

  // Update driver status
  updateDriverStatus: async (driverId, status) => {
    try {
      const response = await axiosInstance.patch(`/driver/${driverId}`, {
        isActive: status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating driver status:', error);
      throw error;
    }
  }
};