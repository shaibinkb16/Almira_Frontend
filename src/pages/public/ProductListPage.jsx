import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  ChevronDown,
  X,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Drawer } from '@/components/ui/Drawer';
import {
  AnimatedProductCard,
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
  Skeleton,
} from '@/components/ui';
import { useMediaQuery } from '@/hooks';
import { sampleProducts } from '@/data/sampleData';

// Filter options
const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'rings', label: 'Rings' },
  { value: 'bangles', label: 'Bangles' },
  { value: 'anklets', label: 'Anklets' },
  { value: 'ethnic-wear', label: 'Ethnic Wear' },
  { value: 'western-wear', label: 'Western Wear' },
];

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-5000', label: 'Under ₹5,000' },
  { value: '5000-15000', label: '₹5,000 - ₹15,000' },
  { value: '15000-30000', label: '₹15,000 - ₹30,000' },
  { value: '30000+', label: 'Above ₹30,000' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Filter states from URL params
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const priceRange = searchParams.get('price') || 'all';
  const sortBy = searchParams.get('sort') || 'featured';
  const filterType = searchParams.get('filter') || '';

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProducts(sampleProducts);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    // Price range filter
    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(v => v.replace('+', ''));
      result = result.filter(p => {
        const price = p.salePrice || p.basePrice;
        if (max) {
          return price >= parseInt(min) && price <= parseInt(max);
        }
        return price >= parseInt(min);
      });
    }

    // Filter type (new, featured, sale)
    if (filterType === 'new') {
      result = result.filter(p => p.isNewArrival);
    } else if (filterType === 'featured') {
      result = result.filter(p => p.isFeatured);
    } else if (filterType === 'sale') {
      result = result.filter(p => p.salePrice);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'price-low':
        result.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
        break;
      case 'price-high':
        result.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, search, category, priceRange, sortBy, filterType]);

  // Update URL params
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
  };

  // Active filters count
  const activeFiltersCount = [
    category !== 'all' ? 1 : 0,
    priceRange !== 'all' ? 1 : 0,
    filterType ? 1 : 0,
    search ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => updateFilters('search', e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              onClick={() => updateFilters('category', cat.value)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                category === cat.value
                  ? 'bg-amber-100 text-amber-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-600'
              )}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <motion.button
              key={range.value}
              onClick={() => updateFilters('price', range.value)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                priceRange === range.value
                  ? 'bg-amber-100 text-amber-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-600'
              )}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {range.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filter Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Filters
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'new', label: 'New Arrivals' },
            { value: 'featured', label: 'Featured' },
            { value: 'sale', label: 'On Sale' },
          ].map((tag) => (
            <Badge
              key={tag.value}
              variant={filterType === tag.value ? 'primary' : 'secondary'}
              className="cursor-pointer"
              onClick={() => updateFilters('filter', filterType === tag.value ? '' : tag.value)}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-amber-600 to-amber-500 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <FadeInOnScroll>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {filterType === 'new' ? 'New Arrivals' :
                 filterType === 'featured' ? 'Featured Products' :
                 filterType === 'sale' ? 'Sale' :
                 category !== 'all' ? categories.find(c => c.value === category)?.label :
                 'All Products'}
              </h1>
              <p className="text-amber-100">
                Discover {filteredProducts.length} beautiful pieces
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          {!isMobile && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 flex-shrink-0"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </h2>
                <FilterContent />
              </div>
            </motion.aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Mobile Filter Button */}
                {isMobile && (
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(true)}
                    leftIcon={<Filter className="h-4 w-4" />}
                  >
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="primary" size="sm" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                )}

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-500" />
                  <Select
                    value={sortBy}
                    onChange={(e) => updateFilters('sort', e.target.value)}
                    className="w-48"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Grid Toggle (Desktop) */}
                {!isMobile && (
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setGridCols(3)}
                      className={cn(
                        'p-2 rounded-md transition-colors',
                        gridCols === 3 ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      )}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setGridCols(4)}
                      className={cn(
                        'p-2 rounded-md transition-colors',
                        gridCols === 4 ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Results Count */}
                <p className="text-sm text-gray-500 ml-auto">
                  Showing {filteredProducts.length} products
                </p>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-wrap gap-2 mt-4 pt-4 border-t"
                >
                  {search && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {search}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => updateFilters('search', '')}
                      />
                    </Badge>
                  )}
                  {category !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {categories.find(c => c.value === category)?.label}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => updateFilters('category', 'all')}
                      />
                    </Badge>
                  )}
                  {priceRange !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {priceRanges.find(p => p.value === priceRange)?.label}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => updateFilters('price', 'all')}
                      />
                    </Badge>
                  )}
                  {filterType && (
                    <Badge variant="secondary" className="gap-1">
                      {filterType === 'new' ? 'New Arrivals' :
                       filterType === 'featured' ? 'Featured' : 'On Sale'}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => updateFilters('filter', '')}
                      />
                    </Badge>
                  )}
                </motion.div>
              )}
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className={cn(
                'grid gap-4 md:gap-6',
                isMobile ? 'grid-cols-2' : gridCols === 3 ? 'grid-cols-3' : 'grid-cols-4'
              )}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <Skeleton className="aspect-[3/4]" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-12 text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </motion.div>
            ) : (
              <StaggerChildren staggerDelay={0.05}>
                <div className={cn(
                  'grid gap-4 md:gap-6',
                  isMobile ? 'grid-cols-2' : gridCols === 3 ? 'grid-cols-3' : 'grid-cols-4'
                )}>
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                      <StaggerItem key={product.id}>
                        <AnimatedProductCard product={product} index={index} />
                      </StaggerItem>
                    ))}
                  </AnimatePresence>
                </div>
              </StaggerChildren>
            )}

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
              >
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filters"
        position="left"
      >
        <FilterContent />
      </Drawer>
    </div>
  );
}

export default ProductListPage;
