
import axiosInstance from "../utils/axiosInstance";

export const activeRidesAPI = {
  // Get all active rides
  getActiveRides: async () => {
    try {
      const response = await axiosInstance.get('/eto/api/v1/rides/activeRides');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching active rides:', error);
      throw error;
    }
  },

  // Get ride by ID from active rides
  getRideById: async (rideId) => {
    try {
      const response = await axiosInstance.get('/eto/api/v1/rides/activeRides');
      const rides = response.data.data || [];
      const foundRide = rides.find(r => r.rideId === rideId);
      return foundRide;
    } catch (error) {
      console.error('Error fetching ride details:', error);
      throw error;
    }
  },

  cancelRide: async (rideId) => {
    try {
      const response = await axiosInstance.patch(`/eto/api/v1/rides/${rideId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling ride:', error);
      throw error;
    }
  }
};