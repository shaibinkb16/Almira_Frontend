/**
 * Cart API Service
 * Handles cart operations directly through Supabase
 */
import { supabase } from '@/lib/supabase/client';

export const cartService = {
  /**
   * Get user's cart with all items - Fetch from Supabase
   * @returns {Promise<Object>} Cart with items and summary
   */
  async getCart() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'Authentication required',
          requiresAuth: true,
        };
      }

      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          variant_id,
          quantity,
          created_at,
          products (
            id,
            name,
            slug,
            base_price,
            sale_price,
            images,
            stock_quantity,
            status
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format cart items
      const items = cartItems.map(item => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        product_name: item.products.name,
        product_slug: item.products.slug,
        product_image: item.products.images?.[0]?.url || item.products.images?.[0] || null,
        base_price: item.products.base_price,
        sale_price: item.products.sale_price,
        unit_price: item.products.sale_price || item.products.base_price,
        total_price: (item.products.sale_price || item.products.base_price) * item.quantity,
        stock_quantity: item.products.stock_quantity,
        is_available: item.products.status === 'active' && item.products.stock_quantity > 0,
        added_at: item.created_at,
      }));

      return {
        success: true,
        data: {
          items,
          summary: this.calculateTotals(items),
        },
      };
    } catch (error) {
      console.error('Get cart error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Add item to cart - Supabase
   * @param {Object} item - Item to add
   * @param {string} item.product_id - Product ID
   * @param {string} item.variant_id - Variant ID (optional)
   * @param {number} item.quantity - Quantity to add
   */
  async addItem(item) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'Authentication required',
          requiresAuth: true,
        };
      }

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', item.product_id)
        .eq('variant_id', item.variant_id || null)
        .maybeSingle();

      if (existingItem) {
        // Update quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + (item.quantity || 1) })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;
        return { success: true, data };
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            quantity: item.quantity || 1,
          })
          .select()
          .single();

        if (error) throw error;
        return { success: true, data };
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Update cart item quantity - Supabase
   * @param {string} itemId - Cart item ID
   * @param {number} quantity - New quantity
   */
  async updateItem(itemId, quantity) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Update cart item error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Remove item from cart - Supabase
   * @param {string} itemId - Cart item ID
   */
  async removeItem(itemId) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Clear entire cart - Supabase
   */
  async clearCart() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Clear cart error:', error);
      return {
        success: false,
        error: error.message,
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
