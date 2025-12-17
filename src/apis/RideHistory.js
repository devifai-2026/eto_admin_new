
import axiosInstance from "../utils/axiosInstance";

export const rideHistoryAPI = {
  // Get all ride history
  getRideHistory: async () => {
    try {
      const response = await axiosInstance.get('/rides/rideHistory');
      
      console.log("Ride History API Response:", response.data);
      
      // Extract data based on different possible response structures
      let ridesData = [];
      
      if (Array.isArray(response.data)) {
        ridesData = response.data;
      } else if (Array.isArray(response.data.data)) {
        ridesData = response.data.data;
      } else if (response.data.data && Array.isArray(response.data.data.rides)) {
        ridesData = response.data.data.rides;
      } else if (response.data.rides && Array.isArray(response.data.rides)) {
        ridesData = response.data.rides;
      } else {
        // Fallback: try to find any array in the response
        const findArrayInObject = (obj) => {
          for (let key in obj) {
            if (Array.isArray(obj[key])) {
              return obj[key];
            }
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              const result = findArrayInObject(obj[key]);
              if (result) return result;
            }
          }
          return null;
        };
        
        const foundArray = findArrayInObject(response.data);
        ridesData = foundArray || [];
      }
      
      console.log("Final rides data:", ridesData);
      return ridesData;
    } catch (error) {
      console.error('Error fetching ride history:', error);
      throw error;
    }
  },

  // Get ride by ID from ride history
  getRideById: async (rideId) => {
    try {
      const response = await axiosInstance.get('/rides/rideHistory');
      
      let ridesData = [];
      
      if (Array.isArray(response.data)) {
        ridesData = response.data;
      } else if (Array.isArray(response.data.data)) {
        ridesData = response.data.data;
      } else if (response.data.data && Array.isArray(response.data.data.rides)) {
        ridesData = response.data.data.rides;
      } else if (response.data.rides && Array.isArray(response.data.rides)) {
        ridesData = response.data.rides;
      } else {
        const findArrayInObject = (obj) => {
          for (let key in obj) {
            if (Array.isArray(obj[key])) {
              return obj[key];
            }
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              const result = findArrayInObject(obj[key]);
              if (result) return result;
            }
          }
          return null;
        };
        
        ridesData = findArrayInObject(response.data) || [];
      }
      
      const foundRide = ridesData.find(r => r._id === rideId);
      return foundRide;
    } catch (error) {
      console.error('Error fetching ride details:', error);
      throw error;
    }
  },

  // Get address from coordinates using Google Maps API
  getAddressFromCoordinates: async (coordinates) => {
    if (!coordinates || coordinates.length !== 2) {
      return "Invalid coordinates";
    }

    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!GOOGLE_API_KEY) {
      return `Lat: ${coordinates[1]}, Lng: ${coordinates[0]}`;
    }
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates[1]},${coordinates[0]}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return `Lat: ${coordinates[1]}, Lng: ${coordinates[0]}`;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return `Lat: ${coordinates[1]}, Lng: ${coordinates[0]}`;
    }
  }
};