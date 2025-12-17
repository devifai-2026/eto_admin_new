import axiosInstance from "../utils/axiosInstance";

const loginAPI = {
  // Send OTP to phone number
  sendOtp: async (requestData) => {
    try {
      console.log("📞 Sending OTP with data:", requestData);
      const response = await axiosInstance.post(
        "/auth/login",
        requestData
      );
      console.log("✅ OTP sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Send OTP failed:", error);
      throw error;
    }
  },

  // Verify OTP
  verifyOtp: async (phone, verificationId, code) => {
    try {
      console.log("🔍 Verifying OTP...");
      const response = await axiosInstance.post("/auth/verifyotp", {
        phone: phone,
        verificationId: verificationId,
        code: code,
      });
      console.log("✅ OTP verified successfully");
      return response.data;
    } catch (error) {
      console.error("❌ Verify OTP failed:", error);
      throw error;
    }
  },

  // Resend OTP
  resendOtp: async (phone) => {
    try {
      console.log("🔄 Resending OTP...");
      const response = await axiosInstance.post("/auth/resend_otp", {
        phone: phone,
      });
      console.log("✅ OTP resent successfully");
      return response.data;
    } catch (error) {
      console.error("❌ Resend OTP failed:", error);
      throw error;
    }
  },

  // Get user type
  getUserType: () => {
    return localStorage.getItem("userType") || "admin";
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    localStorage.removeItem("data");
    localStorage.removeItem("refreshToken");
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default loginAPI;
