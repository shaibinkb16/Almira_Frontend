/**
 * Orders API Service
 * Handles order operations - Read ops use Supabase, Write ops use API
 */
import { apiClient } from './apiClient';
import { supabase } from '@/lib/supabase/client';

export const ordersService = {
  /**
   * Get list of user's orders - Fetch from Supabase
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.status - Filter by status
   */
  async getOrders(params = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'Authentication required',
          requiresAuth: true,
        };
      }

      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            product_image,
            quantity,
            unit_price,
            total_price
          )
        `, { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Filter by status
      if (params.status) {
        query = query.eq('status', params.status);
      }

      // Pagination
      const page = params.page || 1;
      const perPage = params.per_page || 10;
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data: orders, error, count } = await query.range(from, to);

      if (error) throw error;

      return {
        success: true,
        data: orders || [],
        pagination: {
          page,
          per_page: perPage,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / perPage),
        },
      };
    } catch (error) {
      console.error('Get orders error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Get single order details - Fetch from Supabase
   * @param {string} orderId - Order ID
   */
  async getOrderDetails(orderId) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            product_slug,
            product_image,
            product_sku,
            variant_id,
            variant_name,
            quantity,
            unit_price,
            discount_amount,
            total_price
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: order,
      };
    } catch (error) {
      console.error('Get order details error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Create new order from cart
   * @param {Object} orderData - Order data
   * @param {string} orderData.shipping_address_id - Shipping address ID
   * @param {string} orderData.payment_method - Payment method (cod, card, upi, etc.)
   * @param {string} orderData.coupon_code - Coupon code (optional)
   * @param {string} orderData.notes - Customer notes (optional)
   */
  async createOrder(orderData) {
    try {
      console.log('🚀 Sending order request:', orderData);
      const response = await apiClient.post('/orders', orderData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Create order error:', error);
      console.error('Error response:', error.response?.data);

      // FastAPI validation errors come in detail array
      let errorMessage = error.message;
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          // Format validation errors
          errorMessage = error.response.data.detail.map(err =>
            `${err.loc?.join(' -> ') || 'Field'}: ${err.msg}`
          ).join('\n');
        } else {
          errorMessage = error.response.data.detail;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Cancel an order
   * @param {string} orderId - Order ID
   * @param {string} reason - Cancellation reason
   */
  async cancelOrder(orderId, reason = null) {
    try {
      const response = await apiClient.post(`/orders/${orderId}/cancel`, null, {
        params: reason ? { reason } : {},
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Cancel order error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Request return for delivered order
   * @param {string} orderId - Order ID
   * @param {string} reason - Return reason
   */
  async requestReturn(orderId, reason) {
    try {
      const response = await apiClient.post(`/orders/${orderId}/return`, null, {
        params: { reason },
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Request return error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Track order status - Fetch from Supabase
   * @param {string} orderId - Order ID
   */
  async trackOrder(orderId) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          tracking_number,
          tracking_url,
          created_at,
          confirmed_at,
          shipped_at,
          delivered_at,
          estimated_delivery
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: order,
      };
    } catch (error) {
      console.error('Track order error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Get order status badge color
   * @param {string} status - Order status
   * @returns {string} Tailwind color class
   */
  getStatusColor(status) {
    const colors = {
      pending: 'yellow',
      confirmed: 'blue',
      processing: 'indigo',
      shipped: 'purple',
      out_for_delivery: 'cyan',
      delivered: 'green',
      cancelled: 'red',
      returned: 'orange',
      refunded: 'gray',
    };
    return colors[status] || 'gray';
  },

  /**
   * Get order status display name
   * @param {string} status - Order status
   * @returns {string} Display name
   */
  getStatusName(status) {
    const names = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      returned: 'Returned',
      refunded: 'Refunded',
    };
    return names[status] || status;
  },

  /**
   * Get payment status badge color
   * @param {string} status - Payment status
   * @returns {string} Tailwind color class
   */
  getPaymentStatusColor(status) {
    const colors = {
      pending: 'yellow',
      paid: 'green',
      failed: 'red',
      refunded: 'gray',
      partially_refunded: 'orange',
    };
    return colors[status] || 'gray';
  },

  /**
   * Check if order can be cancelled
   * @param {string} status - Order status
   * @returns {boolean}
   */
  canCancel(status) {
    return ['pending', 'confirmed'].includes(status);
  },

  /**
   * Check if order can be returned
   * @param {string} status - Order status
   * @param {string} deliveredAt - Delivery timestamp
   * @returns {boolean}
   */
  canReturn(status, deliveredAt) {
    if (status !== 'delivered' || !deliveredAt) {
      return false;
    }

    // Check if within 7 days
    const deliveryDate = new Date(deliveredAt);
    const now = new Date();
    const diffDays = Math.floor((now - deliveryDate) / (1000 * 60 * 60 * 24));

    return diffDays <= 7;
  },

  /**
   * Format order date
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatOrderDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Calculate estimated delivery date
   * @param {string} createdAt - Order creation date
   * @param {number} businessDays - Number of business days
   * @returns {string} Formatted date
   */
  getEstimatedDelivery(createdAt, businessDays = 5) {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + businessDays);

    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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

export default ordersService;
