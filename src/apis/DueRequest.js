import axiosInstance from "../utils/axiosInstance";

export const dueRequestAPI = {
  // Get all pending due requests
  getPendingDueRequests: async () => {
    try {
      const response = await axiosInstance.get("/dueRequest/pendingDueRequest");

      console.log("Full API Response:", response);
      console.log("Response Data:", response.data);

      let requestsData = [];

      if (Array.isArray(response.data)) {
        requestsData = response.data;
      } else if (Array.isArray(response.data.data)) {
        requestsData = response.data.data;
      } else if (
        response.data.data &&
        Array.isArray(response.data.data.requests)
      ) {
        requestsData = response.data.data.requests;
      } else if (
        response.data.requests &&
        Array.isArray(response.data.requests)
      ) {
        requestsData = response.data.requests;
      } else {
        const findArrayInObject = (obj) => {
          for (let key in obj) {
            if (Array.isArray(obj[key])) {
              return obj[key];
            }
            if (typeof obj[key] === "object" && obj[key] !== null) {
              const result = findArrayInObject(obj[key]);
              if (result) return result;
            }
          }
          return null;
        };

        const foundArray = findArrayInObject(response.data);
        requestsData = foundArray || [];
      }

      console.log("Final requests data:", requestsData);
      return requestsData;
    } catch (error) {
      console.error("Error fetching pending due requests:", error);
      throw error;
    }
  },

  // Get due request by ID
  getDueRequestById: async (dueRequestId) => {
    try {
      console.log("Fetching due request details for ID:", dueRequestId);

      const response = await axiosInstance.get(
        `/dueRequest/getDueRequestDetails/${dueRequestId}`
      );

      // console.log("API Response:", response.data.data);

      // Check for ApiResponse structure
      if (response.data.statusCode === 200 && response.data.data) {
        return response.data.data;
      }
      // If direct object
      else if (response.data) {
        return response.data;
      }

      console.warn("Unexpected response structure:", response.data);
      return null;
    } catch (error) {
      console.error("Error fetching due request details:", error);
      // Return error details for better debugging
      const errorDetails = {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data,
      };
      throw errorDetails;
    }
  },

  // Update due request status
  updateDueRequestStatus: async (requestId, updateData) => {
    try {
      const response = await axiosInstance.patch(
        `/dueRequest/updateDueRequestStatus/${requestId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating due request status:", error);
      throw error;
    }
  },

  // Upload payment image to Cloudinary
  uploadPaymentImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "EtoAdmin_payemntPhotoUpload");
      formData.append("cloud_name", "dswrynlti");

      const response = await axiosInstance.post(
        "https://api.cloudinary.com/v1_1/dswrynlti/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading payment image:", error);
      throw error;
    }
  },
};
