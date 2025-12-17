import axiosInstance from "../utils/axiosInstance";

const franchiseAPI = {
  // Create new franchise
  createFranchise: async (franchiseData) => {
    try {
      console.log("📝 Creating franchise:", franchiseData);

      // Convert form data to match backend schema
      const formattedData = {
        name: franchiseData.name,
        email: franchiseData.email,
        phone: franchiseData.contactNo,
        address: {
          street_address: franchiseData.address.street,
          city: franchiseData.address.city,
          state: franchiseData.address.state,
          country: franchiseData.address.country || "India",
          pincode: franchiseData.address.pincode,
          district: franchiseData.address.city, // Temporary - add district field in UI if needed
        },
        bank_details: {
          account_holder_name: franchiseData.bankDetails.accountHolderName,
          account_number: franchiseData.bankDetails.accountNo,
          ifsc_code: franchiseData.bankDetails.ifscCode,
          branch_name: franchiseData.bankDetails.branchName,
        },
        documents: {
          identity_documents: ["pending-upload"], // Array format
          trade_license: "pending-upload",
        },
        description: franchiseData.description || "",
      };

      console.log("📤 Sending franchise data:", formattedData);

      const response = await axiosInstance.post("/franchises", formattedData);

      console.log("✅ Franchise created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Create franchise failed:", error);
      throw error;
    }
  },

  // Upload franchise documents
  uploadFranchiseDocuments: async (franchiseId, documents) => {
    try {
      console.log("📎 Uploading documents for franchise:", franchiseId);

      const formData = new FormData();

      // Add identity documents (plural field name - "identity_documents")
      if (
        documents.identityDocuments &&
        documents.identityDocuments.length > 0
      ) {
        documents.identityDocuments.forEach((file) => {
          formData.append("identity_documents", file); // Same field name for multiple files
        });
      }

      // Add trade license
      if (documents.tradeLicense) {
        formData.append("trade_license", documents.tradeLicense);
      }

      // Debug: Log FormData contents
      for (let pair of formData.entries()) {
        console.log(`📋 FormData: ${pair[0]} = ${pair[1].name || pair[1]}`);
      }

      const response = await axiosInstance.post(
        `/franchises/${franchiseId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Documents uploaded successfully");
      return response.data;
    } catch (error) {
      console.error("❌ Document upload failed:", error);
      throw error;
    }
  },

  // Get all franchises
  getAllFranchises: async (params = {}) => {
    try {
      const response = await axiosInstance.get("/franchises", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Get franchises failed:", error);
      throw error;
    }
  },

  // Get franchise by ID
  getFranchiseById: async (id) => {
    try {
      const response = await axiosInstance.get(`/franchises/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Get franchise failed:", error);
      throw error;
    }
  },

  // Update franchise
  updateFranchise: async (id, updateData) => {
    try {
      const response = await axiosInstance.put(`/franchises/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error("❌ Update franchise failed:", error);
      throw error;
    }
  },

  // Delete franchise
  deleteFranchise: async (id) => {
    try {
      const response = await axiosInstance.delete(`/franchises/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Delete franchise failed:", error);
      throw error;
    }
  },

  // Get franchise drivers
  getFranchiseDrivers: async (id, params = {}) => {
    try {
      const response = await axiosInstance.get(`/franchises/${id}/drivers`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Get franchise drivers failed:", error);
      throw error;
    }
  },

  // Add pincode access
  addPincodeAccess: async (id, pincodeData) => {
    try {
      const response = await axiosInstance.post(
        `/franchises/${id}/pincodes`,
        pincodeData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Add pincode access failed:", error);
      throw error;
    }
  },

  // Remove pincode access
  removePincodeAccess: async (id, pincodeId) => {
    try {
      const response = await axiosInstance.delete(
        `/franchises/${id}/pincodes/${pincodeId}`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Remove pincode access failed:", error);
      throw error;
    }
  },

  // Get franchise pincodes
  getFranchisePincodes: async (id) => {
    try {
      const response = await axiosInstance.get(`/franchises/${id}/pincodes`);
      return response.data;
    } catch (error) {
      console.error("❌ Get franchise pincodes failed:", error);
      throw error;
    }
  },

  // Update franchise status
  updateFranchiseStatus: async (id, statusData) => {
    try {
      const response = await axiosInstance.patch(
        `/franchises/${id}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Update franchise status failed:", error);
      throw error;
    }
  },

  // Get drivers without franchise
  getDriversWithoutFranchise: async (params = {}) => {
    try {
      const response = await axiosInstance.get(
        "/franchises/drivers/without-franchise",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Get drivers without franchise failed:", error);
      throw error;
    }
  },

  // Assign drivers to franchise
  assignDriversToFranchise: async (id, driverIds) => {
    try {
      const response = await axiosInstance.post(
        `/franchises/${id}/assign-drivers`,
        { driverIds }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Assign drivers to franchise failed:", error);
      throw error;
    }
  },
};

export default franchiseAPI;
