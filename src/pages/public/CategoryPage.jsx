import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  X,
  SlidersHorizontal,
  Grid3x3,
  LayoutGrid,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
  AnimatedProductCard,
  ParallaxSection,
} from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { useCategory } from '@/hooks/useCategories';

// Filters data
const priceRanges = [
  { label: 'Under ₹5,000', value: '0-5000' },
  { label: '₹5,000 - ₹10,000', value: '5000-10000' },
  { label: '₹10,000 - ₹25,000', value: '10000-25000' },
  { label: '₹25,000 - ₹50,000', value: '25000-50000' },
  { label: 'Above ₹50,000', value: '50000-999999' },
];

const materials = [
  { label: 'Gold', value: 'gold' },
  { label: 'Silver', value: 'silver' },
  { label: 'Platinum', value: 'platinum' },
  { label: 'Diamond', value: 'diamond' },
  { label: 'Pearl', value: 'pearl' },
  { label: 'Gemstone', value: 'gemstone' },
];

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Rating', value: 'rating' },
];

// Sample products (replace with API data)
const sampleProducts = [
  {
    id: 1,
    name: 'Kundan Necklace Set',
    slug: 'kundan-necklace-set',
    basePrice: 15999,
    salePrice: 12999,
    images: [
      { url: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 124,
    material: 'Gold',
  },
  {
    id: 2,
    name: 'Temple Jhumkas',
    slug: 'temple-jhumkas',
    basePrice: 4999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 4.6,
    reviewCount: 89,
    material: 'Gold',
  },
  {
    id: 3,
    name: 'Diamond Studs',
    slug: 'diamond-studs',
    basePrice: 8999,
    salePrice: 7499,
    images: [
      { url: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 156,
    material: 'Diamond',
  },
  {
    id: 4,
    name: 'Pearl Necklace',
    slug: 'pearl-necklace',
    basePrice: 12999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 4.7,
    reviewCount: 92,
    material: 'Pearl',
  },
  {
    id: 5,
    name: 'Silver Bangles Set',
    slug: 'silver-bangles-set',
    basePrice: 6999,
    salePrice: 5999,
    images: [
      { url: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isNewArrival: true,
    rating: 4.5,
    reviewCount: 78,
    material: 'Silver',
  },
  {
    id: 6,
    name: 'Emerald Ring',
    slug: 'emerald-ring',
    basePrice: 24999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/1030946/pexels-photo-1030946.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 5.0,
    reviewCount: 67,
    material: 'Gemstone',
  },
  {
    id: 7,
    name: 'Gold Chain',
    slug: 'gold-chain',
    basePrice: 18999,
    salePrice: 16999,
    images: [
      { url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 4.4,
    reviewCount: 103,
    material: 'Gold',
  },
  {
    id: 8,
    name: 'Platinum Band',
    slug: 'platinum-band',
    basePrice: 34999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isFeatured: true,
    rating: 4.8,
    reviewCount: 45,
    material: 'Platinum',
  },
];

function CategoryPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'large-grid'

  // Get current filters from URL
  const currentSort = searchParams.get('sort') || 'featured';
  const currentPriceRange = searchParams.get('price');
  const currentMaterials = searchParams.getAll('material');

  // Fetch category and products from API with fallback to mock data
  const { category, loading: categoryLoading } = useCategory(categorySlug);
  const { products: allProducts, loading: productsLoading } = useProducts({ category: categorySlug });

  // Category data (use API data or fallback)
  const categoryData = category || {
    name: categorySlug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'All Products',
    description: 'Discover our exquisite collection of handcrafted pieces',
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1920',
    productCount: allProducts.length,
  };

  // Filter products (client-side for demo)
  const filteredProducts = allProducts.filter(product => {
    // Price filter
    if (currentPriceRange) {
      const [min, max] = currentPriceRange.split('-').map(Number);
      const price = product.salePrice || product.basePrice;
      if (price < min || price > max) return false;
    }

    // Material filter
    if (currentMaterials.length > 0) {
      if (!currentMaterials.includes(product.material.toLowerCase())) return false;
    }

    return true;
  });

  const handleFilterChange = (filterType, value) => {
    const params = new URLSearchParams(searchParams);

    if (filterType === 'price') {
      if (currentPriceRange === value) {
        params.delete('price');
      } else {
        params.set('price', value);
      }
    } else if (filterType === 'material') {
      const materials = params.getAll('material');
      if (materials.includes(value)) {
        params.delete('material');
        materials.filter(m => m !== value).forEach(m => params.append('material', m));
      } else {
        params.append('material', value);
      }
    } else if (filterType === 'sort') {
      params.set('sort', value);
    }

    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount = [
    currentPriceRange ? 1 : 0,
    currentMaterials.length,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <ParallaxSection
        backgroundImage={categoryData.image}
        className="h-[300px] md:h-[400px]"
      >
        <div className="h-full flex items-center">
          <div className="container mx-auto px-4">
            <FadeInOnScroll direction="up">
              <div className="max-w-xl text-white">
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                  <span className="text-gray-400">/</span>
                  <span className="text-white">{categoryData.name}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-3">
                  {categoryData.name}
                </h1>
                <p className="text-base text-gray-200 mb-2">
                  {categoryData.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>{categoryData.productCount} Products</span>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </ParallaxSection>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Filter Header */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                  </div>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label
                        key={range.value}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="price"
                          value={range.value}
                          checked={currentPriceRange === range.value}
                          onChange={() => handleFilterChange('price', range.value)}
                          className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Material</h4>
                  <div className="space-y-2">
                    {materials.map((material) => (
                      <label
                        key={material.value}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          value={material.value}
                          checked={currentMaterials.includes(material.value)}
                          onChange={() => handleFilterChange('material', material.value)}
                          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">
                          {material.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Results Count & Mobile Filter */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                  </p>
                </div>

                {/* View Mode & Sort */}
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'p-2 rounded-md transition-colors',
                        viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      )}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('large-grid')}
                      className={cn(
                        'p-2 rounded-md transition-colors',
                        viewMode === 'large-grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={currentSort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Pills */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-gray-600">Active filters:</span>
                {currentPriceRange && (
                  <Badge variant="outline" className="gap-2">
                    {priceRanges.find(r => r.value === currentPriceRange)?.label}
                    <button
                      onClick={() => handleFilterChange('price', currentPriceRange)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {currentMaterials.map((material) => (
                  <Badge key={material} variant="outline" className="gap-2">
                    {materials.find(m => m.value === material)?.label}
                    <button
                      onClick={() => handleFilterChange('material', material)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Products Grid */}
            <StaggerChildren staggerDelay={0.05}>
              {productsLoading ? (
                <div
                  className={cn(
                    'grid gap-4 md:gap-6',
                    viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-2'
                  )}
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-2xl aspect-[3/4] animate-pulse" />
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    'grid gap-4 md:gap-6',
                    viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-2'
                  )}
                >
                  {filteredProducts.map((product, index) => (
                    <StaggerItem key={product.id}>
                      <AnimatedProductCard product={product} index={index} />
                    </StaggerItem>
                  ))}
                </div>
              )}
            </StaggerChildren>

            {/* Empty State */}
            {!productsLoading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Filter className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more products
                </p>
                <Button onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Same filter content as desktop sidebar */}
                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label
                          key={range.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="price-mobile"
                            value={range.value}
                            checked={currentPriceRange === range.value}
                            onChange={() => handleFilterChange('price', range.value)}
                            className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                          />
                          <span className="text-sm text-gray-600">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Materials */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Material</h4>
                    <div className="space-y-2">
                      {materials.map((material) => (
                        <label
                          key={material.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={material.value}
                            checked={currentMaterials.includes(material.value)}
                            onChange={() => handleFilterChange('material', material.value)}
                            className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                          />
                          <span className="text-sm text-gray-600">{material.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-1"
                  >
                    View {filteredProducts.length} Products
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CategoryPage;
