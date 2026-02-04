/**
 * Contact & Support API Service
 * Handles customer contact forms and support tickets
 */
import { apiClient } from './apiClient';

export const contactService = {
  // ==========================================
  // PUBLIC CONTACT FORM
  // ==========================================

  /**
   * Submit a contact form (no authentication required)
   * @param {Object} formData - Contact form data
   * @param {string} formData.name - Full name
   * @param {string} formData.email - Email address
   * @param {string} formData.phone - Phone number (optional)
   * @param {string} formData.subject - Message subject
   * @param {string} formData.message - Message content
   */
  async submitContactForm(formData) {
    try {
      const response = await apiClient.post('/contact/contact', formData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Contact form submission error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  // ==========================================
  // SUPPORT TICKETS (Authenticated)
  // ==========================================

  /**
   * Create a support ticket (requires authentication)
   * @param {Object} ticketData - Ticket data
   * @param {string} ticketData.subject - Ticket subject
   * @param {string} ticketData.description - Detailed description
   * @param {string} ticketData.category - Category (order_issue, product_issue, etc.)
   * @param {string} ticketData.order_id - Related order ID (optional)
   * @param {string[]} ticketData.attachments - Array of attachment URLs (optional)
   */
  async createTicket(ticketData) {
    try {
      const response = await apiClient.post('/contact/support/ticket', ticketData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Create ticket error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Get user's support tickets
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   */
  async getMyTickets(params = {}) {
    try {
      const response = await apiClient.get('/contact/support/tickets', { params });
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error('Get tickets error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Get ticket details and conversation
   * @param {string} ticketId - Ticket ID
   */
  async getTicketDetails(ticketId) {
    try {
      const response = await apiClient.get(`/contact/support/tickets/${ticketId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Get ticket details error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Reply to a ticket
   * @param {string} ticketId - Ticket ID
   * @param {Object} messageData - Message data
   * @param {string} messageData.message - Message content
   * @param {string[]} messageData.attachments - Attachment URLs (optional)
   */
  async replyToTicket(ticketId, messageData) {
    try {
      const response = await apiClient.post(
        `/contact/support/tickets/${ticketId}/messages`,
        messageData
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Reply to ticket error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Close a ticket
   * @param {string} ticketId - Ticket ID
   */
  async closeTicket(ticketId) {
    try {
      const response = await apiClient.patch(`/contact/support/tickets/${ticketId}/close`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Close ticket error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },
};

export default contactService;
