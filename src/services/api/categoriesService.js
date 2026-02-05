/**
 * Categories API Service
 */
import apiClient from './apiClient';
import { supabase } from '@/lib/supabase/client';

export const categoriesService = {
  /**
   * Get all categories
   */
  async getCategories(params = {}) {
    try {
      const response = await apiClient.get('/categories', { params });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get single category by slug - Fetch from Supabase
   */
  async getCategory(slug) {
    try {
      // Fetch category from Supabase
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (categoryError) throw categoryError;
      if (!category) {
        return {
          success: false,
          error: 'Category not found',
          data: null,
        };
      }

      // Count products in this category
      let productCount = 0;

      if (category.parent_id === null) {
        // This is a parent category - count products in all children
        const { data: children } = await supabase
          .from('categories')
          .select('id')
          .eq('parent_id', category.id);

        if (children && children.length > 0) {
          const childIds = children.map(c => c.id);
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .in('category_id', childIds)
            .eq('status', 'active');
          productCount = count || 0;
        }
      } else if (slug === 'new-arrivals') {
        // Count products created in last 30 days or featured
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .or(`created_at.gte.${thirtyDaysAgo.toISOString()},is_featured.eq.true`)
          .eq('status', 'active');
        productCount = count || 0;
      } else if (slug === 'sale') {
        // Count products with sale prices
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .not('sale_price', 'is', null)
          .eq('status', 'active');
        productCount = count || 0;
      } else {
        // Regular category - count its own products
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'active');
        productCount = count || 0;
      }

      // Return formatted data
      return {
        success: true,
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image_url, // Map image_url to image for compatibility
          image_url: category.image_url,
          productCount: productCount || 0,
          isActive: category.is_active,
          parent_id: category.parent_id,
        },
      };
    } catch (error) {
      console.error('Failed to fetch category:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  },

  /**
   * Get category with products
   */
  async getCategoryWithProducts(slug, params = {}) {
    try {
      const response = await apiClient.get(`/categories/${slug}/products`, {
        params,
      });
      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Failed to fetch category products:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  },
};

export default categoriesService;
