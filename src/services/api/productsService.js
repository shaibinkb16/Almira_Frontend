/**
 * Products API Service
 */
import apiClient from './apiClient';

export const productsService = {
  /**
   * Get all products with filters
   */
  async getProducts(params = {}) {
    try {
      const response = await apiClient.get('/products', { params });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get single product by slug
   */
  async getProduct(slug) {
    try {
      const response = await apiClient.get(`/products/${slug}`);
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  },

  /**
   * Search products
   */
  async searchProducts(query, params = {}) {
    try {
      const response = await apiClient.get('/products/search', {
        params: { q: query, ...params },
      });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Failed to search products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 8) {
    try {
      const response = await apiClient.get('/products', {
        params: { featured: true, limit },
      });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get new arrival products
   */
  async getNewArrivals(limit = 8) {
    try {
      const response = await apiClient.get('/products', {
        params: { new_arrival: true, limit },
      });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Failed to fetch new arrivals:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get sale products
   */
  async getSaleProducts(params = {}) {
    try {
      const response = await apiClient.get('/products', {
        params: { on_sale: true, ...params },
      });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Failed to fetch sale products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(categorySlug, params = {}) {
    try {
      const response = await apiClient.get('/products', {
        params: { category: categorySlug, ...params },
      });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Failed to fetch category products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },
};

export default productsService;
