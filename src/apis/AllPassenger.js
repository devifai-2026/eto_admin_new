
import axiosInstance from "../utils/axiosInstance";

export const allPassengerAPI = {
  // Get all passengers
  getAllPassengers: async () => {
    try {
      const response = await axiosInstance.get('/rider');
      const passengersArr = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data?.riders || response.data?.data || []);
      return passengersArr;
    } catch (error) {
      console.error('Error fetching all passengers:', error);
      throw error;
    }
  },

  // Get passenger by ID
  getPassengerById: async (passengerId) => {
    try {
      const response = await axiosInstance.get('/rider');
      const passengers = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data?.riders || response.data?.data || []);
      
     
      const foundPassenger = passengers.find(p => {
        const pId = typeof p.id === 'object' && '$oid' in p.id ? p.id.$oid : p.id;
        const paramId = typeof passengerId === 'object' && '$oid' in passengerId ? passengerId.$oid : passengerId;
        return pId === paramId;
      });
      
      return foundPassenger;
    } catch (error) {
      console.error('Error fetching passenger details:', error);
      throw error;
    }
  },

  // Delete passenger
  deletePassenger: async (passengerId) => {
    try {
      const response = await axiosInstance.delete(`/rider/delete/${passengerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting passenger:', error);
      throw error;
    }
  },

  // Update passenger status
  updatePassengerStatus: async (passengerId, status) => {
    try {
      const response = await axiosInstance.patch(`/rider/${passengerId}`, {
        is_on_ride: status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating passenger status:', error);
      throw error;
    }
  }
};