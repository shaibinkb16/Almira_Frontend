/**
 * Contact & Support API Service
 * Handles customer contact forms and support tickets - Uses Supabase where possible
 */
import { apiClient } from './apiClient';
import { supabase } from '@/lib/supabase/client';

export const contactService = {
  // ==========================================
  // PUBLIC CONTACT FORM
  // ==========================================

  /**
   * Submit a contact form - Supabase (no authentication required)
   * @param {Object} formData - Contact form data
   * @param {string} formData.name - Full name
   * @param {string} formData.email - Email address
   * @param {string} formData.phone - Phone number (optional)
   * @param {string} formData.subject - Message subject
   * @param {string} formData.message - Message content
   */
  async submitContactForm(formData) {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          status: 'new',
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Thank you for contacting us. We will get back to you soon.'
      };
    } catch (error) {
      console.error('Contact form submission error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // SUPPORT TICKETS (Authenticated)
  // ==========================================

  /**
   * Create a support ticket - Uses backend for ticket number generation
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
   * Get user's support tickets - Fetch from Supabase
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   */
  async getMyTickets(params = {}) {
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
        .from('support_tickets')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Filter by status
      if (params.status) {
        query = query.eq('status', params.status);
      }

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: tickets, error, count } = await query.range(from, to);

      if (error) throw error;

      return {
        success: true,
        data: tickets || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error) {
      console.error('Get tickets error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Get ticket details and conversation - Fetch from Supabase
   * @param {string} ticketId - Ticket ID
   */
  async getTicketDetails(ticketId) {
    try {
      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (ticketError) throw ticketError;

      // Get messages
      const { data: messages, error: messagesError } = await supabase
        .from('support_messages')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            role
          )
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      return {
        success: true,
        data: {
          ...ticket,
          messages: messages || [],
        }
      };
    } catch (error) {
      console.error('Get ticket details error:', error);
      return {
        success: false,
        error: error.message,
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
