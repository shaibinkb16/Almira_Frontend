/**
 * Products API Service
 * Uses direct REST API to avoid Supabase client AbortError issues
 */
import { fetchProducts, fetchProductBySlug, supabaseRest } from '@/lib/supabase/restClient';

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
   * Get all products with filters - Using REST API
   */
  async getProducts(params = {}) {
    try {
      let categoryIds = null;

      // Handle category filtering
      if (params.category) {
        // First get the category
        const { data: category } = await supabaseRest('categories', {
          select: 'id, parent_id',
          filters: [{ column: 'slug', operator: 'eq', value: params.category }],
          single: true,
        });

        if (category) {
          if (category.parent_id === null) {
            // Parent category - get children
            const { data: children } = await supabaseRest('categories', {
              select: 'id',
              filters: [{ column: 'parent_id', operator: 'eq', value: category.id }],
            });

            if (children && children.length > 0) {
              categoryIds = children.map(c => c.id);
            } else {
              categoryIds = [category.id];
            }
          } else {
            categoryIds = [category.id];
          }
        }
      }

      const { data: products, error } = await fetchProducts({
        categoryIds,
        featured: params.featured,
        onSale: params.on_sale,
        limit: params.limit,
      });

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
   * Get single product by slug - Using REST API
   */
  async getProduct(slug) {
    try {
      const { data: product, error } = await fetchProductBySlug(slug);

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
   * Search products - Using REST API
   */
  async searchProducts(query, params = {}) {
    try {
      const { data: products, error } = await supabaseRest('products', {
        select: '*',
        filters: [
          { column: 'status', operator: 'eq', value: 'active' },
          { column: 'name', operator: 'ilike', value: `%${query}%` },
        ],
        limit: params.limit || 50,
      });

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
   * Get featured products - Using REST API
   */
  async getFeaturedProducts(limit = 8) {
    try {
      const { data: products, error } = await fetchProducts({
        featured: true,
        limit,
      });

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
   * Get new arrival products - Using REST API
   */
  async getNewArrivals(limit = 8) {
    try {
      // For new arrivals, fetch featured products as fallback
      const { data: products, error } = await fetchProducts({
        featured: true,
        limit,
      });

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
   * Get sale products - Using REST API
   */
  async getSaleProducts(params = {}) {
    try {
      const { data: products, error } = await fetchProducts({
        onSale: true,
        limit: params.limit || 50,
      });

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
   * Get products by category - Using REST API
   */
  async getProductsByCategory(categorySlug, params = {}) {
    return this.getProducts({ category: categorySlug, ...params });
  },
};

export default productsService;
