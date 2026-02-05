/**
 * Payment Service
 * Razorpay payment integration
 */

import apiClient from './apiClient';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export const paymentService = {
  /**
   * Create Razorpay order
   * @param {string} orderId - Internal order ID
   * @returns {Promise<Object>} Razorpay order details
   */
  async createPaymentOrder(orderId) {
    try {
      const response = await apiClient.post('/payments/create-order', {
        order_id: orderId,
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create payment order',
      };
    }
  },

  /**
   * Verify Razorpay payment
   * @param {Object} paymentData - Razorpay payment response
   * @returns {Promise<Object>} Verification result
   */
  async verifyPayment(paymentData) {
    try {
      const response = await apiClient.post('/payments/verify', paymentData);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Payment verification failed',
      };
    }
  },

  /**
   * Get payment status
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Payment status
   */
  async getPaymentStatus(orderId) {
    try {
      const response = await apiClient.get(`/payments/status/${orderId}`);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get payment status',
      };
    }
  },

  /**
   * Open Razorpay checkout
   * @param {Object} options - Payment options
   * @param {string} options.orderId - Internal order ID
   * @param {number} options.amount - Amount in rupees
   * @param {string} options.razorpayOrderId - Razorpay order ID
   * @param {Function} options.onSuccess - Success callback
   * @param {Function} options.onFailure - Failure callback
   */
  openCheckout({
    orderId,
    amount,
    razorpayOrderId,
    keyId,
    customerName = '',
    customerEmail = '',
    customerPhone = '',
    onSuccess,
    onFailure,
  }) {
    const options = {
      key: keyId || RAZORPAY_KEY_ID,
      amount: amount, // Amount in paise
      currency: 'INR',
      name: 'Almira',
      description: `Order #${orderId}`,
      order_id: razorpayOrderId,
      image: '/logo.png', // Your logo URL
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      theme: {
        color: '#D97706', // Amber color matching your theme
      },
      handler: async function (response) {
        // Payment successful
        const verificationData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          order_id: orderId,
        };

        // Verify payment on backend
        const verifyResult = await paymentService.verifyPayment(
          verificationData
        );

        if (verifyResult.success && verifyResult.data.paymentVerified) {
          onSuccess(response);
        } else {
          onFailure(new Error('Payment verification failed'));
        }
      },
      modal: {
        ondismiss: function () {
          onFailure(new Error('Payment cancelled'));
        },
      },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        onFailure(response.error);
      });

      rzp.open();
    } else {
      onFailure(new Error('Razorpay script not loaded'));
    }
  },

  /**
   * Format amount for display
   * @param {number} amountInPaise - Amount in paise
   * @returns {string} Formatted amount
   */
  formatAmount(amountInPaise) {
    const rupees = amountInPaise / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(rupees);
  },

  /**
   * Convert rupees to paise
   * @param {number} rupees - Amount in rupees
   * @returns {number} Amount in paise
   */
  rupeesToPaise(rupees) {
    return Math.round(rupees * 100);
  },

  /**
   * Convert paise to rupees
   * @param {number} paise - Amount in paise
   * @returns {number} Amount in rupees
   */
  paiseToRupees(paise) {
    return paise / 100;
  },
};

export default paymentService;
