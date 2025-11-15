// services/login.js
import axios from 'axios';

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

// Create axios instance with common config
const api = axios.create({
  baseURL: BACKEND_URI,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const loginAPI = {
  // Send OTP to phone number
  sendOtp: async (phone) => {
    const response = await api.post('/eto/api/v1/auth/login', {
      phone: phone,
      isDriver: false,
      isAdmin: true,
    });
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (phone, verificationId, code) => {
    const response = await api.post('/eto/api/v1/auth/verifyotp', {
      phone: phone,
      verificationId: verificationId,
      code: code,
    });
    return response.data;
  },

  // Resend OTP
  resendOtp: async (phone) => {
    const response = await api.post('/eto/api/v1/auth/resend_otp', {
      phone: phone,
    });
    return response.data;
  },
};

export default loginAPI;