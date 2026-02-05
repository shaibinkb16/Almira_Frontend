/**
 * Products API Service
 */
import apiClient from './apiClient';
import { supabase } from '@/lib/supabase/client';

// Transform backend product data to frontend format
const transformProduct = (product) => {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    basePrice: product.base_price || product.basePrice,
    salePrice: product.sale_price || product.salePrice || null,
    status: product.status,
    images: product.images || [],
    rating: product.rating || 0,
    reviewCount: product.review_count || product.reviewCount || 0,
    isNewArrival: product.is_new || product.isNew || false,
    isFeatured: product.is_featured || product.isFeatured || false,
    stockQuantity: product.stock_quantity || product.stockQuantity || 0,
    description: product.description,
    material: product.material,
    category: product.category,
    categoryId: product.category_id || product.categoryId,
  };
};

export const productsService = {
  /**
   * Get all products with filters - Fetch from Supabase
   */
  async getProducts(params = {}) {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active');

      // Filter by category slug
      if (params.category) {
        // First get the category and its children
        const { data: category } = await supabase
          .from('categories')
          .select('id, parent_id')
          .eq('slug', params.category)
          .single();

        if (category) {
          // If it's a parent category, get all children
          if (category.parent_id === null) {
            const { data: children } = await supabase
              .from('categories')
              .select('id')
              .eq('parent_id', category.id);

            if (children && children.length > 0) {
              const childIds = children.map(c => c.id);
              query = query.in('category_id', childIds);
            } else {
              // No children, just use this category
              query = query.eq('category_id', category.id);
            }
          } else {
            // Regular category
            query = query.eq('category_id', category.id);
          }
        }
      }

      // Filter by featured
      if (params.featured) {
        query = query.eq('is_featured', true);
      }

      // Filter by sale
      if (params.on_sale) {
        query = query.not('sale_price', 'is', null);
      }

      // Filter by new arrivals (created in last 30 days OR featured)
      if (params.new_arrival) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.or(`created_at.gte.${thirtyDaysAgo.toISOString()},is_featured.eq.true`);
      }

      // Limit
      if (params.limit) {
        query = query.limit(params.limit);
      }

      // Execute query
      const { data: products, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: products ? products.map(transformProduct) : [],
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get single product by slug - Fetch from Supabase
   */
  async getProduct(slug) {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (error) throw error;

      return {
        success: true,
        data: transformProduct(product),
      };
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  },

  /**
   * Search products - Fetch from Supabase
   */
  async searchProducts(query, params = {}) {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(params.limit || 50);

      if (error) throw error;

      return {
        success: true,
        data: products ? products.map(transformProduct) : [],
      };
    } catch (error) {
      console.error('Failed to search products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get featured products - Fetch from Supabase
   */
  async getFeaturedProducts(limit = 8) {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: products ? products.map(transformProduct) : [],
      };
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get new arrival products - Fetch from Supabase
   */
  async getNewArrivals(limit = 8) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .or(`created_at.gte.${thirtyDaysAgo.toISOString()},is_featured.eq.true`)
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        data: products ? products.map(transformProduct) : [],
      };
    } catch (error) {
      console.error('Failed to fetch new arrivals:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get sale products - Fetch from Supabase
   */
  async getSaleProducts(params = {}) {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .not('sale_price', 'is', null)
        .limit(params.limit || 50);

      if (error) throw error;

      return {
        success: true,
        data: products ? products.map(transformProduct) : [],
      };
    } catch (error) {
      console.error('Failed to fetch sale products:', error);
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get products by category - Fetch from Supabase
   */
  async getProductsByCategory(categorySlug, params = {}) {
    return this.getProducts({ category: categorySlug, ...params });
  },
};

export default productsService;
