// utils/axiosInstance.js
import axios from "axios";

const isProduction = true; // Change this to false for development

console.log("Axios Instance - Production Mode:", isProduction);

const url = {
  production: "https://www.totoserver.in",
  development: "http://localhost:8000",
};

const axiosInstance = axios.create({
  baseURL: isProduction ? url.production : url.development,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration/errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    if (error.response?.status === 401) {
      // Handle unauthorized access (token expired/invalid)
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      window.location.href = "/signin"; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;