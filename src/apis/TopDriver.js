
import axiosInstance from "../utils/axiosInstance";

export const topDriverAPI = {
  // Get all top drivers
  getAllTopDrivers: async () => {
    try {
      const response = await axiosInstance.get('/eto/api/v1/driver/topDrivers');
      return response.data;
    } catch (error) {
      console.error('Error fetching top drivers:', error);
      throw error;
    }
  },

  // Get driver by ID from top drivers list
  getDriverById: async (driverId) => {
    try {
      const response = await axiosInstance.get('/eto/api/v1/driver/topDrivers');
      const drivers = response.data.data;
      const driver = drivers.find(d => d.driverId === driverId || d.driverDetails._id === driverId);
      return driver;
    } catch (error) {
      console.error('Error fetching driver details:', error);
      throw error;
    }
  },

  // Get individual driver details directly
  getDriverDetails: async (driverId) => {
    try {
      const response = await axiosInstance.get(`/eto/api/v1/driver/${driverId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching driver details:', error);
      throw error;
    }
  }

 
};