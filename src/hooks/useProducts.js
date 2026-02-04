/**
 * Products Hook
 * Fetches products from API with fallback to mock data
 */
import { useState, useEffect } from 'react';
import { productsService } from '@/services/api';

// Mock data fallback (keeping existing images)
const mockProducts = [
  {
    id: 1,
    name: 'Elegant Gold Necklace',
    slug: 'elegant-gold-necklace',
    basePrice: 45999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isFeatured: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 2,
    name: 'Diamond Stud Earrings',
    slug: 'diamond-stud-earrings',
    basePrice: 28999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 89,
  },
  // Add more mock products as needed
];

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const result = await productsService.getProducts(params);

      if (result.success && result.data.length > 0) {
        // Use API data
        setProducts(result.data);
      } else {
        // Fallback to mock data
        console.log('Using mock product data');
        setProducts(mockProducts);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [JSON.stringify(params)]);

  return { products, loading, error };
};

export const useFeaturedProducts = (limit = 8) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await productsService.getFeaturedProducts(limit);

      if (result.success && result.data.length > 0) {
        setProducts(result.data);
      } else {
        setProducts(mockProducts.slice(0, limit));
      }

      setLoading(false);
    };

    fetchProducts();
  }, [limit]);

  return { products, loading };
};

export const useNewArrivals = (limit = 12) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await productsService.getNewArrivals(limit);

      if (result.success && result.data.length > 0) {
        setProducts(result.data);
      } else {
        // Fallback to mock data
        setProducts(mockProducts.slice(0, limit));
      }

      setLoading(false);
    };

    fetchProducts();
  }, [limit]);

  return { products, loading };
};

export const useSaleProducts = (limit = 12) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await productsService.getSaleProducts(limit);

      if (result.success && result.data.length > 0) {
        setProducts(result.data);
      } else {
        // Fallback to mock data with sale prices
        const saleProducts = mockProducts.map((p) => ({
          ...p,
          salePrice: Math.floor(p.basePrice * 0.7), // 30% off
        }));
        setProducts(saleProducts.slice(0, limit));
      }

      setLoading(false);
    };

    fetchProducts();
  }, [limit]);

  return { products, loading };
};

export const useProduct = (slug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      const result = await productsService.getProduct(slug);

      if (result.success && result.data) {
        setProduct(result.data);
      } else {
        // Fallback to mock data
        const mockProduct = mockProducts.find((p) => p.slug === slug);
        setProduct(mockProduct || null);
      }

      setLoading(false);
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  return { product, loading, error };
};

export default useProducts;
