// utils/axiosInstance.js
import axios from "axios";

// Change this ONE value only
const IS_PRODUCTION = false; // true = production, false = development

const DEV_URI = "http://localhost:8000/eto/api/v1";
const PROD_URI = "https://www.totoserver.in/eto/api/v1";

// Define your URLs
const API_BASE_URLS = {
  production: PROD_URI,
  development: DEV_URI,
};

// Select base URL based on IS_PRODUCTION
const BASE_URL = IS_PRODUCTION
  ? API_BASE_URLS.production
  : API_BASE_URLS.development;

console.log("🚀 Axios Instance Configuration");
console.log("Mode:", IS_PRODUCTION ? "🎯 PRODUCTION" : "💻 DEVELOPMENT");
console.log("Base URL:", BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Clear all tokens
const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userType");
  localStorage.removeItem("refreshToken");
};

axiosInstance.interceptors.request.use(
  (config) => {
    // Get token
    const token = getToken();

    // Add token to headers if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log in development mode only
    if (!IS_PRODUCTION) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development mode
    if (!IS_PRODUCTION) {
      console.log(`✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Log error
    console.error("API Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log("Unauthorized - Clearing tokens");
      clearTokens();

      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
