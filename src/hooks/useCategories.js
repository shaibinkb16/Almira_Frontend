/**
 * Categories Hook
 * Fetches categories from API with fallback to mock data
 */
import { useState, useEffect } from 'react';
import { categoriesService } from '@/services/api';

// Mock data fallback
const mockCategories = [
  {
    id: 1,
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Elegant necklaces for every occasion',
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 45,
    isActive: true,
  },
  {
    id: 2,
    name: 'Earrings',
    slug: 'earrings',
    description: 'Beautiful earrings to complete your look',
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 38,
    isActive: true,
  },
  {
    id: 3,
    name: 'Rings',
    slug: 'rings',
    description: 'Stunning rings for every finger',
    image: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 52,
    isActive: true,
  },
  {
    id: 4,
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Elegant bracelets and bangles',
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 29,
    isActive: true,
  },
  {
    id: 5,
    name: 'Sarees',
    slug: 'sarees',
    description: 'Traditional and designer sarees',
    image: 'https://images.pexels.com/photos/3651597/pexels-photo-3651597.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 67,
    isActive: true,
  },
  {
    id: 6,
    name: 'Ethnic Wear',
    slug: 'ethnic-wear',
    description: 'Traditional ethnic fashion',
    image: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=600',
    productCount: 54,
    isActive: true,
  },
];

export const useCategories = (params = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      const result = await categoriesService.getCategories(params);

      if (result.success && result.data.length > 0) {
        // Use API data
        setCategories(result.data);
      } else {
        // Fallback to mock data
        console.log('Using mock category data');
        setCategories(mockCategories);
      }

      setLoading(false);
    };

    fetchCategories();
  }, [JSON.stringify(params)]);

  return { categories, loading, error };
};

export const useCategory = (slug) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);

      const result = await categoriesService.getCategory(slug);

      if (result.success && result.data) {
        setCategory(result.data);
      } else {
        // Fallback to mock data
        const mockCategory = mockCategories.find((c) => c.slug === slug);
        setCategory(mockCategory || null);
      }

      setLoading(false);
    };

    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  return { category, loading, error };
};

export default useCategories;
