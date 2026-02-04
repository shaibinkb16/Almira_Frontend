/**
 * Wishlist API Service
 * Handles wishlist operations
 */
import { apiClient } from './apiClient';

export const wishlistService = {
  /**
   * Get user's wishlist
   * @returns {Promise<Object>} Wishlist with products
   */
  async getWishlist() {
    try {
      const response = await apiClient.get('/wishlist');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Get wishlist error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Add product to wishlist
   * @param {string} productId - Product ID
   */
  async addToWishlist(productId) {
    try {
      const response = await apiClient.post(`/wishlist/${productId}`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Add to wishlist error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Remove product from wishlist
   * @param {string} productId - Product ID
   */
  async removeFromWishlist(productId) {
    try {
      const response = await apiClient.delete(`/wishlist/${productId}`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Check if product is in wishlist
   * @param {string} productId - Product ID
   * @returns {Promise<boolean>}
   */
  async isInWishlist(productId) {
    try {
      const response = await apiClient.get(`/wishlist/check/${productId}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Check wishlist error:', error);
      return {
        success: false,
        data: false,
      };
    }
  },

  /**
   * Toggle product in wishlist
   * @param {string} productId - Product ID
   * @param {boolean} isInWishlist - Current wishlist state
   */
  async toggleWishlist(productId, isInWishlist) {
    if (isInWishlist) {
      return await this.removeFromWishlist(productId);
    } else {
      return await this.addToWishlist(productId);
    }
  },

  /**
   * Move wishlist item to cart
   * @param {string} productId - Product ID
   * @param {Function} addToCart - Cart add function
   */
  async moveToCart(productId, addToCart) {
    try {
      // Add to cart first
      const cartResult = await addToCart(productId);

      if (cartResult.success) {
        // Then remove from wishlist
        await this.removeFromWishlist(productId);
        return {
          success: true,
          message: 'Moved to cart successfully',
        };
      }

      return cartResult;
    } catch (error) {
      console.error('Move to cart error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Get wishlist count
   * @param {Array} wishlist - Wishlist items
   * @returns {number}
   */
  getWishlistCount(wishlist) {
    return wishlist?.length || 0;
  },

  /**
   * Check if wishlist is empty
   * @param {Array} wishlist - Wishlist items
   * @returns {boolean}
   */
  isEmpty(wishlist) {
    return !wishlist || wishlist.length === 0;
  },

  /**
   * Filter wishlist by category
   * @param {Array} wishlist - Wishlist items
   * @param {string} categorySlug - Category slug
   * @returns {Array}
   */
  filterByCategory(wishlist, categorySlug) {
    if (!categorySlug) return wishlist;
    return wishlist.filter((item) => item.category_slug === categorySlug);
  },

  /**
   * Sort wishlist items
   * @param {Array} wishlist - Wishlist items
   * @param {string} sortBy - Sort criteria (price_asc, price_desc, newest, oldest)
   * @returns {Array}
   */
  sortWishlist(wishlist, sortBy = 'newest') {
    const sorted = [...wishlist];

    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => {
          const priceA = a.sale_price || a.base_price;
          const priceB = b.sale_price || b.base_price;
          return priceA - priceB;
        });

      case 'price_desc':
        return sorted.sort((a, b) => {
          const priceA = a.sale_price || a.base_price;
          const priceB = b.sale_price || b.base_price;
          return priceB - priceA;
        });

      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },

  /**
   * Get products out of stock in wishlist
   * @param {Array} wishlist - Wishlist items
   * @returns {Array}
   */
  getOutOfStock(wishlist) {
    return wishlist.filter((item) => item.stock_quantity === 0 || item.status !== 'active');
  },

  /**
   * Get products on sale in wishlist
   * @param {Array} wishlist - Wishlist items
   * @returns {Array}
   */
  getOnSale(wishlist) {
    return wishlist.filter((item) => item.sale_price && item.sale_price < item.base_price);
  },

  /**
   * Calculate total value of wishlist
   * @param {Array} wishlist - Wishlist items
   * @returns {number}
   */
  getTotalValue(wishlist) {
    return wishlist.reduce((total, item) => {
      const price = item.sale_price || item.base_price;
      return total + price;
    }, 0);
  },

  /**
   * Calculate total savings if all wishlist items bought
   * @param {Array} wishlist - Wishlist items
   * @returns {number}
   */
  getTotalSavings(wishlist) {
    return wishlist.reduce((total, item) => {
      if (item.sale_price && item.sale_price < item.base_price) {
        return total + (item.base_price - item.sale_price);
      }
      return total;
    }, 0);
  },

  /**
   * Format currency (INR)
   * @param {number} amount - Amount in rupees
   * @returns {string} Formatted currency
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  },
};

export default wishlistService;
