/**
 * Admin API Service
 * Handles all admin-related API calls
 */
import { apiClient } from './apiClient';

export const adminService = {
  // ==========================================
  // DASHBOARD
  // ==========================================

  async getDashboardStats() {
    try {
      const response = await apiClient.get('/admin/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin dashboard error:', error);
      return { success: false, error: error.message };
    }
  },

  // ==========================================
  // PRODUCTS
  // ==========================================

  async getProducts(params = {}) {
    try {
      const response = await apiClient.get('/admin/products', { params });
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      console.error('Admin get products error:', error);
      return { success: false, error: error.message };
    }
  },

  async createProduct(productData) {
    try {
      const response = await apiClient.post('/admin/products', productData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin create product error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateProduct(productId, productData) {
    try {
      const response = await apiClient.patch(`/admin/products/${productId}`, productData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin update product error:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await apiClient.delete(`/admin/products/${productId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin delete product error:', error);
      return { success: false, error: error.message };
    }
  },

  // ==========================================
  // CATEGORIES
  // ==========================================

  async createCategory(categoryData) {
    try {
      const response = await apiClient.post('/admin/categories', categoryData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin create category error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateCategory(categoryId, categoryData) {
    try {
      const response = await apiClient.patch(`/admin/categories/${categoryId}`, categoryData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin update category error:', error);
      return { success: false, error: error.message };
    }
  },

  // ==========================================
  // ORDERS
  // ==========================================

  async getOrders(params = {}) {
    try {
      const response = await apiClient.get('/admin/orders', { params });
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      console.error('Admin get orders error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateOrder(orderId, orderData) {
    try {
      const response = await apiClient.patch(`/admin/orders/${orderId}`, orderData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin update order error:', error);
      return { success: false, error: error.message };
    }
  },

  // ==========================================
  // REVIEWS
  // ==========================================

  async getPendingReviews(params = {}) {
    try {
      const response = await apiClient.get('/admin/reviews/pending', { params });
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      console.error('Admin get reviews error:', error);
      return { success: false, error: error.message };
    }
  },

  async moderateReview(reviewId, moderationData) {
    try {
      const response = await apiClient.patch(`/admin/reviews/${reviewId}`, moderationData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin moderate review error:', error);
      return { success: false, error: error.message };
    }
  },

  // ==========================================
  // USERS
  // ==========================================

  async getUsers(params = {}) {
    try {
      const response = await apiClient.get('/admin/users', { params });
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      console.error('Admin get users error:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserDetails(userId) {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Admin get user details error:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserOrders(userId, params = {}) {
    try {
      const response = await apiClient.get(`/admin/users/${userId}/orders`, { params });
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      console.error('Admin get user orders error:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserAddresses(userId) {
    try {
      const response = await apiClient.get(`/admin/users/${userId}/addresses`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Admin get user addresses error:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserReviews(userId) {
    try {
      const response = await apiClient.get(`/admin/users/${userId}/reviews`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Admin get user reviews error:', error);
      return { success: false, error: error.message };
    }
  },

  async toggleUserStatus(userId, isActive) {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/status`, null, {
        params: { is_active: isActive },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin toggle user status error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateUserRole(userId, role) {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/role`, null, {
        params: { role },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin update user role error:', error);
      return { success: false, error: error.message };
    }
  },

  // ==========================================
  // CONTACT SUBMISSIONS
  // ==========================================

  async getContactSubmissions(params = {}) {
    try {
      const response = await apiClient.get('/admin/contact/submissions', { params });
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      console.error('Admin get contact submissions error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateContactSubmission(submissionId, updateData) {
    try {
      const response = await apiClient.patch(`/admin/contact/submissions/${submissionId}`, updateData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin update contact submission error:', error);
      return { success: false, error: error.message };
    }
  },

  // ==========================================
  // SUPPORT TICKETS
  // ==========================================

  async getSupportTickets(params = {}) {
    try {
      const response = await apiClient.get('/admin/support/tickets', { params });
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      console.error('Admin get support tickets error:', error);
      return { success: false, error: error.message };
    }
  },

  async getTicketDetails(ticketId) {
    try {
      const response = await apiClient.get(`/admin/support/tickets/${ticketId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Admin get ticket details error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateTicketStatus(ticketId, statusData) {
    try {
      const response = await apiClient.patch(`/admin/support/tickets/${ticketId}/status`, statusData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin update ticket status error:', error);
      return { success: false, error: error.message };
    }
  },

  async assignTicket(ticketId, assigneeId) {
    try {
      const response = await apiClient.patch(`/admin/support/tickets/${ticketId}/assign`, null, {
        params: { assigned_to: assigneeId },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin assign ticket error:', error);
      return { success: false, error: error.message };
    }
  },

  async replyToTicket(ticketId, messageData) {
    try {
      const response = await apiClient.post(`/admin/support/tickets/${ticketId}/reply`, messageData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Admin reply to ticket error:', error);
      return { success: false, error: error.message };
    }
  },

  // ==========================================
  // ORDER MANAGEMENT
  // ==========================================

  async getCancellations(params = {}) {
    try {
      const response = await apiClient.get('/admin/orders/cancellations', { params });
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      console.error('Admin get cancellations error:', error);
      return { success: false, error: error.message };
    }
  },

  async getReturns(params = {}) {
    try {
      const response = await apiClient.get('/admin/orders/returns', { params });
      return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
      console.error('Admin get returns error:', error);
      return { success: false, error: error.message };
    }
  },

  async approveReturn(orderId) {
    try {
      const response = await apiClient.post(`/admin/orders/${orderId}/approve-return`);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Admin approve return error:', error);
      return { success: false, error: error.message };
    }
  },

  async rejectReturn(orderId, reason) {
    try {
      const response = await apiClient.post(`/admin/orders/${orderId}/reject-return`, null, {
        params: { reason },
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Admin reject return error:', error);
      return { success: false, error: error.message };
    }
  },

  async updateTracking(orderId, trackingNumber, trackingUrl = null) {
    try {
      const response = await apiClient.patch(`/admin/orders/${orderId}/tracking`, null, {
        params: {
          tracking_number: trackingNumber,
          tracking_url: trackingUrl,
        },
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Admin update tracking error:', error);
      return { success: false, error: error.message };
    }
  },

  async markDelivered(orderId) {
    try {
      const response = await apiClient.patch(`/admin/orders/${orderId}/mark-delivered`);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Admin mark delivered error:', error);
      return { success: false, error: error.message };
    }
  },

  async getOrderStatistics() {
    try {
      const response = await apiClient.get('/admin/orders/statistics');
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Admin get order statistics error:', error);
      return { success: false, error: error.message };
    }
  },
};

export default adminService;
