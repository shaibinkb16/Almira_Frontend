/**
 * API Services
 * Export all API service modules
 */

export { default as apiClient } from './apiClient';
export { productsService } from './productsService';
export { categoriesService } from './categoriesService';
export { adminService } from './adminService';
export { contactService } from './contactService';
export { uploadService } from './uploadService';
export { cartService } from './cartService';
export { ordersService } from './ordersService';
export { wishlistService } from './wishlistService';

// Helper to check if API is available
export const checkAPIConnection = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.warn('Backend API not available, using mock data');
    return false;
  }
};
