/**
 * Categories API Service
 */
import apiClient from './apiClient';

export const categoriesService = {
  /**
   * Get all categories
   */
  async getCategories(params = {}) {
    try {
      const response = await apiClient.get('/categories', { params });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get single category by slug
   */
  async getCategory(slug) {
    try {
      const response = await apiClient.get(`/categories/${slug}`);
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Failed to fetch category:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  },

  /**
   * Get category with products
   */
  async getCategoryWithProducts(slug, params = {}) {
    try {
      const response = await apiClient.get(`/categories/${slug}/products`, {
        params,
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
        data: null,
      };
    }
  },
};

export default categoriesService;
