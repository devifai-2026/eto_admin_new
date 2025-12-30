import axiosInstance from "../utils/axiosInstance";
import loginAPI from "./Login";

export const rideHistoryAPI = {
  // Get ride history with franchise/admin support
  getRideHistory: async (params = {}) => {
    try {
      // Get current user information
      const user = loginAPI.getCurrentUser();
      const userType = loginAPI.getUserType();

      // Add user type specific parameters
      if (userType === "admin" && user?._id) {
        params.adminId = user._id;
      } else if (userType === "franchise" && user?._id) {
        params.franchiseId = user._id;
      }

      // Remove undefined values
      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );

      console.log("Fetching ride history with params:", params);

      const response = await axiosInstance.get("/rides/rideHistory", {
        params,
      });

      console.log("Ride History API Response:", response.data);

      if (response.data && response.data.statusCode === 200) {
        const data = response.data.data;
        return {
          rides: data.rides || [],
          summary: data.summary || {},
          pagination: data.pagination || {
            page: 1,
            pages: 1,
            total: 0,
            limit: 20,
          },
          filters: data.filters || {},
        };
      }

      throw new Error(response.data?.message || "Failed to fetch ride history");
    } catch (error) {
      console.error("Error fetching ride history:", error);
      throw error;
    }
  },

  // Get ride by ID from ride history
  getRideById: async (rideId) => {
    try {
      const response = await axiosInstance.get(`/rides/${rideId}`);

      if (response.data && response.data.statusCode === 200) {
        return response.data.data;
      }

      throw new Error(response.data?.message || "Failed to fetch ride details");
    } catch (error) {
      console.error("Error fetching ride details:", error);
      throw error;
    }
  },

  // Get address from coordinates using Google Maps API
  getAddressFromCoordinates: async (coordinates) => {
    if (!coordinates || coordinates.length !== 2) {
      return "Invalid coordinates";
    }

    const GOOGLE_API_KEY = "AIzaSyADoCI2hyTYNI3jXfG4jRZzVu0qdMMEH4Q";

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
  },
};
