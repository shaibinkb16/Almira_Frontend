/**
 * Products API Service
 */
import apiClient from './apiClient';

// Transform backend product data (snake_case) to frontend format (camelCase)
const transformProduct = (product) => {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    basePrice: parseFloat(product.base_price),
    salePrice: product.sale_price ? parseFloat(product.sale_price) : null,
    status: product.status,
    images: product.images || [],
    rating: product.rating ? parseFloat(product.rating) : null,
    reviewCount: product.review_count || 0,
    isNewArrival: product.is_new || false,
    isFeatured: product.is_featured || false,
    stockQuantity: product.stock_quantity,
    description: product.description,
    category: product.category,
    categoryId: product.category_id,
  };
};

export const productsService = {
  /**
   * Get all products with filters
   */
  async getProducts(params = {}) {
    try {
      const response = await apiClient.get('/products', { params });
      const products = response.data || response;
      return {
        success: true,
        data: Array.isArray(products) ? products.map(transformProduct) : [],
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
        data: transformProduct(response.data || response),
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
      const products = response.data || response;
      return {
        success: true,
        data: Array.isArray(products) ? products.map(transformProduct) : [],
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
      const products = response.data || response;
      return {
        success: true,
        data: Array.isArray(products) ? products.map(transformProduct) : [],
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
      const products = response.data || response;
      return {
        success: true,
        data: Array.isArray(products) ? products.map(transformProduct) : [],
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
      const products = response.data || response;
      return {
        success: true,
        data: Array.isArray(products) ? products.map(transformProduct) : [],
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
      const products = response.data || response;
      return {
        success: true,
        data: Array.isArray(products) ? products.map(transformProduct) : [],
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
