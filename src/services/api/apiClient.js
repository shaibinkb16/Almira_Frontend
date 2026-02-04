/**
 * API Client Configuration
 * Axios instance with interceptors for auth and error handling
 */
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { session } = useAuthStore.getState();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper: Convert snake_case to camelCase
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Helper: Transform object keys from snake_case to camelCase
const transformKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item));
  }

  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = toCamelCase(key);
      let value = obj[key];

      // Convert string numbers to actual numbers for price/rating fields
      if (typeof value === 'string' && ['basePrice', 'salePrice', 'price', 'rating'].includes(camelKey)) {
        const num = parseFloat(value);
        value = isNaN(num) ? value : num;
      }

      // Recursively transform nested objects/arrays
      acc[camelKey] = transformKeys(value);
      return acc;
    }, {});
  }

  return obj;
};

// Response interceptor - Handle errors and transform data
apiClient.interceptors.response.use(
  (response) => {
    // Transform snake_case to camelCase and convert string numbers
    return transformKeys(response.data);
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized
      if (status === 401) {
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        window.location.href = '/auth/login';
      }
      
      // Return formatted error
      return Promise.reject({
        status,
        message: data?.error?.message || data?.message || 'An error occurred',
        code: data?.error?.code || 'UNKNOWN_ERROR',
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      });
    } else {
      // Something else happened
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      });
    }
  }
);

export default apiClient;
