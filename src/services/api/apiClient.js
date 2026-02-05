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
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.log('API Request with auth:', {
          url: config.url,
          method: config.method,
          hasToken: true,
          tokenPrefix: session.access_token.substring(0, 20) + '...'
        });
      }
    } else if (import.meta.env.DEV) {
      console.warn('API Request without auth token:', {
        url: config.url,
        method: config.method
      });
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

// Track consecutive 401 errors to prevent redirect loops
let consecutiveUnauthorized = 0;
const MAX_401_BEFORE_LOGOUT = 2; // Reduced from 3 to 2

// Response interceptor - Handle errors and transform data
apiClient.interceptors.response.use(
  (response) => {
    // Reset 401 counter on successful response
    consecutiveUnauthorized = 0;
    // Transform snake_case to camelCase and convert string numbers
    return transformKeys(response.data);
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      // Handle 401 Unauthorized - only logout after multiple failures
      if (status === 401) {
        consecutiveUnauthorized++;
        console.warn(`Authentication failed (${consecutiveUnauthorized}/${MAX_401_BEFORE_LOGOUT})`, {
          url: error.config?.url,
          hasToken: !!error.config?.headers?.Authorization
        });

        // Only clear auth and redirect after multiple consecutive 401s
        // This prevents redirect loops from temporary auth issues
        if (consecutiveUnauthorized >= MAX_401_BEFORE_LOGOUT) {
          console.error('Too many authentication failures, logging out...');
          const { clearAuth } = useAuthStore.getState();
          clearAuth();
          consecutiveUnauthorized = 0; // Reset counter

          // Use navigate instead of window.location for SPA routing
          // Check if we're not already on login page to avoid loop
          if (!window.location.pathname.includes('/auth/login')) {
            window.location.href = '/auth/login';
          }
        }
      } else {
        // Reset counter for non-401 errors
        consecutiveUnauthorized = 0;
      }

      // Return formatted error
      return Promise.reject({
        status,
        message: data?.detail || data?.error?.message || data?.message || 'An error occurred',
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
