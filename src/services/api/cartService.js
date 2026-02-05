/**
 * Cart API Service
 * Handles cart operations through the backend API
 */
import { apiClient } from './apiClient';

export const cartService = {
  /**
   * Get user's cart with all items
   * @returns {Promise<Object>} Cart with items and summary
   */
  async getCart() {
    try {
      const response = await apiClient.get('/cart');
      return {
        success: true,
        data: response.data.cart,
      };
    } catch (error) {
      console.error('Get cart error:', error);
      
      // Don't retry on authentication errors
      if (error.status === 401) {
        return {
          success: false,
          error: 'Authentication required',
          requiresAuth: true,
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Add item to cart
   * @param {Object} item - Item to add
   * @param {string} item.product_id - Product ID
   * @param {string} item.variant_id - Variant ID (optional)
   * @param {number} item.quantity - Quantity to add
   */
  async addItem(item) {
    try {
      const response = await apiClient.post('/cart/items', {
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        quantity: item.quantity || 1,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Add to cart error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Update cart item quantity
   * @param {string} itemId - Cart item ID
   * @param {number} quantity - New quantity
   */
  async updateItem(itemId, quantity) {
    try {
      const response = await apiClient.patch(`/cart/items/${itemId}`, {
        quantity,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Update cart item error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Remove item from cart
   * @param {string} itemId - Cart item ID
   */
  async removeItem(itemId) {
    try {
      const response = await apiClient.delete(`/cart/items/${itemId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Clear entire cart
   */
  async clearCart() {
    try {
      const response = await apiClient.delete('/cart');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Clear cart error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Calculate cart totals
   * @param {Array} items - Cart items
   * @returns {Object} Cart summary with subtotal, shipping, tax, total
   */
  calculateTotals(items) {
    const subtotal = items.reduce((total, item) => {
      const price = item.sale_price || item.unit_price || item.base_price;
      return total + price * item.quantity;
    }, 0);

    const shipping = subtotal >= 2999 ? 0 : 99; // Free shipping above ₹2999
    const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
    const total = subtotal + shipping + tax;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  },

  /**
   * Validate cart item before adding
   * @param {Object} product - Product object
   * @param {number} quantity - Quantity to add
   * @returns {Object} Validation result
   */
  validateCartItem(product, quantity = 1) {
    if (!product) {
      return {
        valid: false,
        error: 'Product is required',
      };
    }

    if (quantity < 1) {
      return {
        valid: false,
        error: 'Quantity must be at least 1',
      };
    }

    if (product.stock_quantity < quantity) {
      return {
        valid: false,
        error: `Only ${product.stock_quantity} items available in stock`,
      };
    }

    if (product.status !== 'active') {
      return {
        valid: false,
        error: 'Product is not available',
      };
    }

    return { valid: true };
  },

  /**
   * Format cart item for display
   * @param {Object} item - Raw cart item
   * @returns {Object} Formatted cart item
   */
  formatCartItem(item) {
    return {
      id: item.id,
      productId: item.product_id,
      variantId: item.variant_id,
      name: item.product_name,
      slug: item.product_slug,
      image: item.product_image,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      salePrice: item.sale_price,
      totalPrice: item.total_price,
      stockQuantity: item.stock_quantity,
      isAvailable: item.is_available,
      addedAt: item.added_at,
    };
  },
};

export default cartService;
