/**
 * Reviews API Service
 * Handles product reviews with photos and detailed feedback
 */
import { supabase } from '@/lib/supabase/client';
import { apiClient } from './apiClient';

export const reviewsService = {
  /**
   * Get reviews for a product
   * @param {string} productId - Product ID
   * @param {Object} params - Query parameters
   */
  async getProductReviews(productId, params = {}) {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .eq('status', 'approved') // Only show approved reviews
        .order('created_at', { ascending: false });

      // Filter by rating if specified
      if (params.rating) {
        query = query.eq('rating', params.rating);
      }

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      };
    } catch (error) {
      console.error('Get product reviews error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Get review statistics for a product
   * @param {string} productId - Product ID
   */
  async getReviewStats(productId) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating, would_recommend')
        .eq('product_id', productId)
        .eq('status', 'approved');

      if (error) throw error;

      const stats = {
        total: data.length,
        average: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recommendationRate: 0,
      };

      if (data.length > 0) {
        // Calculate average
        const sum = data.reduce((acc, review) => acc + review.rating, 0);
        stats.average = (sum / data.length).toFixed(1);

        // Calculate distribution
        data.forEach((review) => {
          stats.distribution[review.rating]++;
        });

        // Calculate recommendation rate
        const recommendations = data.filter((r) => r.would_recommend === true).length;
        stats.recommendationRate = Math.round((recommendations / data.length) * 100);
      }

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error('Get review stats error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Submit a new review
   * @param {Object} reviewData - Review data
   */
  async submitReview(reviewData) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Review submitted successfully',
      };
    } catch (error) {
      console.error('Submit review error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Check if user can review a product
   * @param {string} productId - Product ID
   * @param {string} userId - User ID
   */
  async canReview(productId, userId) {
    try {
      // Check if user has already reviewed
      const { data: existingReview, error: reviewError } = await supabase
        .from('reviews')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', userId)
        .maybeSingle();

      if (reviewError) throw reviewError;

      if (existingReview) {
        return {
          success: false,
          canReview: false,
          reason: 'already_reviewed',
          message: 'You have already reviewed this product',
        };
      }

      // Optionally: Check if user has purchased the product
      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select(`
          id,
          order_items!inner(product_id)
        `)
        .eq('user_id', userId)
        .eq('order_items.product_id', productId)
        .eq('status', 'delivered')
        .limit(1);

      if (orderError) throw orderError;

      if (!orders || orders.length === 0) {
        return {
          success: true,
          canReview: true,
          verifiedPurchase: false,
          message: 'You can review this product, but it won\'t be marked as verified purchase',
        };
      }

      return {
        success: true,
        canReview: true,
        verifiedPurchase: true,
        message: 'You can review this product as a verified purchaser',
      };
    } catch (error) {
      console.error('Can review check error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Get user's reviews
   * @param {string} userId - User ID
   */
  async getUserReviews(userId) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          products(name, slug, images)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      console.error('Get user reviews error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Update a review
   * @param {string} reviewId - Review ID
   * @param {Object} updates - Review updates
   */
  async updateReview(reviewId, updates) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Review updated successfully',
      };
    } catch (error) {
      console.error('Update review error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   */
  async deleteReview(reviewId) {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      return {
        success: true,
        message: 'Review deleted successfully',
      };
    } catch (error) {
      console.error('Delete review error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Mark review as helpful
   * @param {string} reviewId - Review ID
   * @param {string} userId - User ID
   */
  async markHelpful(reviewId, userId) {
    try {
      // Check if already marked
      const { data: existing } = await supabase
        .from('review_helpfulness')
        .select('id')
        .eq('review_id', reviewId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        // Remove helpful mark
        await supabase
          .from('review_helpfulness')
          .delete()
          .eq('id', existing.id);

        return {
          success: true,
          marked: false,
          message: 'Helpful mark removed',
        };
      } else {
        // Add helpful mark
        await supabase
          .from('review_helpfulness')
          .insert({ review_id: reviewId, user_id: userId });

        return {
          success: true,
          marked: true,
          message: 'Marked as helpful',
        };
      }
    } catch (error) {
      console.error('Mark helpful error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Get helpful count for a review
   * @param {string} reviewId - Review ID
   */
  async getHelpfulCount(reviewId) {
    try {
      const { count, error } = await supabase
        .from('review_helpfulness')
        .select('*', { count: 'exact', head: true })
        .eq('review_id', reviewId);

      if (error) throw error;

      return {
        success: true,
        count: count || 0,
      };
    } catch (error) {
      console.error('Get helpful count error:', error);
      return {
        success: false,
        count: 0,
      };
    }
  },

  /**
   * Report a review
   * @param {string} reviewId - Review ID
   * @param {string} userId - User ID
   * @param {string} reason - Report reason
   */
  async reportReview(reviewId, userId, reason) {
    try {
      const { data, error } = await supabase
        .from('review_reports')
        .insert({
          review_id: reviewId,
          user_id: userId,
          reason,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Review reported. We will investigate.',
      };
    } catch (error) {
      console.error('Report review error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Format review for display
   * @param {Object} review - Raw review object
   */
  formatReview(review) {
    return {
      ...review,
      customerName: review.profiles?.full_name || 'Anonymous',
      customerAvatar: review.profiles?.avatar_url || null,
      timeAgo: this.getTimeAgo(review.created_at),
      hasPhotos: review.images && review.images.length > 0,
      photoCount: review.images?.length || 0,
    };
  },

  /**
   * Get time ago string
   * @param {string} dateString - ISO date string
   */
  getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  },
};

export default reviewsService;
