
import axiosInstance from "../utils/axiosInstance";

export const allDriverAPI = {
  // Get all drivers
  getAllDrivers: async () => {
    try {
      const response = await axiosInstance.get('/eto/api/v1/driver');
      return response.data;
    } catch (error) {
      console.error('Error fetching all drivers:', error);
      throw error;
    }
  },

  // Get driver by ID
  getDriverById: async (driverId) => {
    try {
      const response = await axiosInstance.get('/eto/api/v1/driver');
      const drivers = response.data.data.drivers;
      const driver = drivers.find(d => {
        const id = typeof d._id === 'object' && '$oid' in d._id ? d._id.$oid : d._id;
        return id === driverId;
      });
      return driver;
    } catch (error) {
      console.error('Error fetching driver details:', error);
      throw error;
    }
  },

  // Delete driver
  deleteDriver: async (driverId) => {
    try {
      const response = await axiosInstance.delete(`/eto/api/v1/driver/deleteAccount/${driverId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting driver:', error);
      throw error;
    }
  },

  // Update driver status
  updateDriverStatus: async (driverId, status) => {
    try {
      const response = await axiosInstance.patch(`/eto/api/v1/driver/${driverId}`, {
        isActive: status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating driver status:', error);
      throw error;
    }
  }
};