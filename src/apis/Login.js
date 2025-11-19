// src/apis/Login.js
import axios from 'axios';

// Use the environment variable with fallback
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || 'https://www.totoserver.in';

console.log('Backend Base URL:', BACKEND_URI);

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: BACKEND_URI,
  timeout: 30000, // Increased timeout for production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to:`, config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.baseURL + error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

const loginAPI = {
  // Send OTP to phone number
  sendOtp: async (phone) => {
    try {
      console.log('📞 Sending OTP to phone:', phone);
      const response = await api.post('/eto/api/v1/auth/login', {
        phone: phone,
        isDriver: false,
        isAdmin: true,
      });
      console.log('✅ OTP sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Send OTP failed:', error);
      throw error;
    }
  },

  // Verify OTP
  verifyOtp: async (phone, verificationId, code) => {
    try {
      console.log('🔍 Verifying OTP...');
      const response = await api.post('/eto/api/v1/auth/verifyotp', {
        phone: phone,
        verificationId: verificationId,
        code: code,
      });
      console.log('✅ OTP verified successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Verify OTP failed:', error);
      throw error;
    }
  },

  // Resend OTP
  resendOtp: async (phone) => {
    try {
      console.log('🔄 Resending OTP...');
      const response = await api.post('/eto/api/v1/auth/resend_otp', {
        phone: phone,
      });
      console.log('✅ OTP resent successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Resend OTP failed:', error);
      throw error;
    }
  },
};

export default loginAPI;