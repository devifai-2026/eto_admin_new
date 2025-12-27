import axiosInstance from "../utils/axiosInstance";

export const activeRidesAPI = {
  // Get all active rides
  getActiveRides: async (params = {}) => {
    try {
      console.log("API Call: GET /ride/activeRides with params:", params);

      // Ensure page and limit are numbers
      const cleanParams = {
        ...params,
        page: params.page ? parseInt(params.page) : 1,
        limit: params.limit ? parseInt(params.limit) : 10,
      };

      // Remove undefined/null values
      Object.keys(cleanParams).forEach((key) => {
        if (cleanParams[key] === undefined || cleanParams[key] === null) {
          delete cleanParams[key];
        }
      });

      // Correct endpoint: /ride/activeRides (not /ride/active-rides)
      const response = await axiosInstance.get("/rides/activeRides", {
        params: cleanParams,
      });

      console.log("API Response Status:", response.status);
      console.log("API Response Data:", response.data);

      // Check if the response has the expected structure
      if (response.data && response.data.status === 200) {
        return {
          status: 200,
          data: response.data,
          message: response.data.message || "Active rides fetched successfully",
        };
      } else {
        // Handle different response structures
        return {
          status: response.status,
          data: response.data || { data: [] },
          message: response.data?.message || "Active rides fetched",
        };
      }
    } catch (error) {
      console.error("Error fetching active rides:", error);

      // Return a structured error response
      return {
        status: error.response?.status || 500,
        data: null,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch active rides",
      };
    }
  },

  // Get ride by ID from active rides
  getRideById: async (rideId) => {
    try {
      const response = await axiosInstance.get(`/rides/${rideId}`);

      if (response.status === 200) {
        return {
          status: 200,
          data: response.data.data || response.data,
          message: "Ride details fetched successfully",
        };
      }

      return {
        status: response.status,
        data: null,
        message: response.data?.message || "Failed to fetch ride details",
      };
    } catch (error) {
      console.error("Error fetching ride by ID:", error);
      return {
        status: error.response?.status || 500,
        data: null,
        message:
          error.response?.data?.message || "Failed to fetch ride details",
      };
    }
  },

  cancelRide: async (rideId) => {
    try {
      const response = await axiosInstance.patch(`/rides/${rideId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Error cancelling ride:", error);
      throw error;
    }
  },
};
