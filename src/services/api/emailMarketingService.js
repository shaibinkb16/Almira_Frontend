/**
 * Email Marketing & Newsletter Service
 * Handles email subscriptions, abandoned cart, and marketing campaigns
 */
import { supabase } from '@/lib/supabase/client';
import { apiClient } from './apiClient';

export const emailMarketingService = {
  /**
   * Subscribe to newsletter
   * @param {string} email - Email address
   * @param {string} source - Subscription source (exit_popup, inline_form, footer, etc.)
   */
  async subscribe(email, source = 'unknown') {
    try {
      // Store in Supabase
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email,
          source,
          status: 'active',
          subscribed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        // Check if email already exists
        if (error.code === '23505') {
          return {
            success: false,
            error: 'This email is already subscribed',
          };
        }
        throw error;
      }

      // Send welcome email (via backend or email service)
      await this.sendWelcomeEmail(email);

      return {
        success: true,
        data,
        message: 'Successfully subscribed to newsletter',
      };
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Unsubscribe from newsletter
   * @param {string} email - Email address
   */
  async unsubscribe(email) {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
        .eq('email', email);

      if (error) throw error;

      return {
        success: true,
        message: 'Successfully unsubscribed',
      };
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Track abandoned cart
   * @param {string} email - Email address
   * @param {Array} cartItems - Cart items
   */
  async trackAbandonedCart(email, cartItems) {
    try {
      const { data, error } = await supabase
        .from('abandoned_carts')
        .insert({
          email,
          cart_data: cartItems,
          created_at: new Date().toISOString(),
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Schedule abandoned cart email (24 hours later)
      await this.scheduleAbandonedCartEmail(email, cartItems, data.id);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Track abandoned cart error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Send welcome email (via backend or EmailJS)
   * @param {string} email - Email address
   */
  async sendWelcomeEmail(email) {
    try {
      // Option 1: Use backend API
      await apiClient.post('/email/welcome', { email });

      // Option 2: Use EmailJS (uncomment if using EmailJS)
      /*
      const emailjs = await import('@emailjs/browser');
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'welcome_template',
        {
          to_email: email,
          discount_code: 'WELCOME10',
        },
        'YOUR_PUBLIC_KEY'
      );
      */

      return { success: true };
    } catch (error) {
      console.error('Send welcome email error:', error);
      // Don't fail subscription if email send fails
      return { success: false };
    }
  },

  /**
   * Schedule abandoned cart recovery email
   * @param {string} email - Email address
   * @param {Array} cartItems - Cart items
   * @param {string} cartId - Abandoned cart ID
   */
  async scheduleAbandonedCartEmail(email, cartItems, cartId) {
    try {
      // This would typically be handled by backend cron job or email service
      // For now, just log it
      console.log('Abandoned cart email scheduled for:', email);

      // Could use backend API to schedule
      await apiClient.post('/email/schedule-abandoned-cart', {
        email,
        cart_items: cartItems,
        cart_id: cartId,
      });

      return { success: true };
    } catch (error) {
      console.error('Schedule abandoned cart email error:', error);
      return { success: false };
    }
  },

  /**
   * Send order confirmation email
   * @param {string} email - Email address
   * @param {Object} order - Order data
   */
  async sendOrderConfirmation(email, order) {
    try {
      await apiClient.post('/email/order-confirmation', {
        email,
        order,
      });

      return { success: true };
    } catch (error) {
      console.error('Send order confirmation error:', error);
      return { success: false };
    }
  },

  /**
   * Send shipping notification
   * @param {string} email - Email address
   * @param {Object} shipmentData - Shipment data
   */
  async sendShippingNotification(email, shipmentData) {
    try {
      await apiClient.post('/email/shipping-notification', {
        email,
        ...shipmentData,
      });

      return { success: true };
    } catch (error) {
      console.error('Send shipping notification error:', error);
      return { success: false };
    }
  },

  /**
   * Get subscriber preferences
   * @param {string} email - Email address
   */
  async getSubscriberPreferences(email) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get subscriber preferences error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Update subscriber preferences
   * @param {string} email - Email address
   * @param {Object} preferences - Preferences to update
   */
  async updatePreferences(email, preferences) {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update(preferences)
        .eq('email', email);

      if (error) throw error;

      return {
        success: true,
        message: 'Preferences updated successfully',
      };
    } catch (error) {
      console.error('Update preferences error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default emailMarketingService;
