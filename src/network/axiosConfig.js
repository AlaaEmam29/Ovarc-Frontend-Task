// src/network/axiosConfig.js
import axios from 'axios';

// Environment variables
const API_BASE_URL = import.meta.env.VITE_BASE_PATH || "/";
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Create axios instance with common configuration
const axiosInstance = axios.create({
  baseURL: USE_MOCK_API ? '/api' : API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login or refresh token
          console.error('Unauthorized access');
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          // Other errors
          console.error('Request failed');
      }
    } else if (error.request) {
      // Request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Error in setting up the request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;