import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Trash2,
  ShoppingBag,
  Share2,
  Grid3X3,
  LayoutGrid,
  HeartOff,
} from 'lucide-react';
import { cn, formatPrice, calculateDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
  AnimatedProductCard,
} from '@/components/ui';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';
import { sampleProducts } from '@/data/sampleData';

// Use sample products for wishlist
const sampleWishlist = sampleProducts.map((product, index) => ({
  ...product,
  addedAt: `2024-01-${15 + index}`,
}));

function WishlistPage() {
  const [wishlist, setWishlist] = useState(sampleWishlist);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const { addItem } = useCartStore();
  const { showSuccess, showError } = useUIStore();

  const handleRemoveItem = (itemId, itemName) => {
    setWishlist(prev => prev.filter(item => item.id !== itemId));
    showSuccess(`${itemName} removed from wishlist`);
  };

  const handleAddToCart = (item) => {
    if (item.stockQuantity === 0) {
      showError('This item is currently out of stock');
      return;
    }
    addItem(item);
    showSuccess(`${item.name} added to cart`);
  };

  const handleAddAllToCart = () => {
    const availableItems = wishlist.filter(item => item.stockQuantity > 0);
    if (availableItems.length === 0) {
      showError('No items available to add to cart');
      return;
    }
    availableItems.forEach(item => addItem(item));
    showSuccess(`${availableItems.length} items added to cart`);
  };

  const handleClearWishlist = () => {
    setWishlist([]);
    showSuccess('Wishlist cleared');
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
            <motion.div
              className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <HeartOff className="h-12 w-12 text-gray-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h1>
            <p className="text-gray-500 mb-8">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Button size="lg" asChild>
              <Link to={ROUTES.PRODUCTS}>Discover Products</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInOnScroll>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-500">{wishlist.length} saved items</p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white rounded-lg p-1 border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100'
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100'
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
              <Button
                variant="outline"
                onClick={handleAddAllToCart}
                leftIcon={<ShoppingBag className="h-4 w-4" />}
              >
                Add All to Cart
              </Button>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleClearWishlist}
              >
                Clear All
              </Button>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Wishlist Items */}
        {viewMode === 'grid' ? (
          <StaggerChildren staggerDelay={0.05}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {wishlist.map((item, index) => (
                  <StaggerItem key={item.id}>
                    <motion.div
                      layout
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group relative"
                    >
                      <AnimatedProductCard product={item} index={index} />
                      {/* Remove Button */}
                      <motion.button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="absolute top-3 right-3 z-20 p-2 bg-white rounded-full shadow-lg text-red-500 hover:bg-red-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  </StaggerItem>
                ))}
              </AnimatePresence>
            </div>
          </StaggerChildren>
        ) : (
          <StaggerChildren staggerDelay={0.1}>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {wishlist.map((item) => {
                  const discount = calculateDiscount(item.basePrice, item.salePrice);
                  const isOutOfStock = item.stockQuantity === 0;

                  return (
                    <StaggerItem key={item.id}>
                      <motion.div
                        layout
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-2xl p-4 md:p-6 shadow-sm"
                      >
                        <div className="flex gap-4 md:gap-6">
                          {/* Image */}
                          <Link
                            to={`/products/${item.slug}`}
                            className="flex-shrink-0"
                          >
                            <motion.div
                              className={cn(
                                'w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden',
                                isOutOfStock && 'opacity-60'
                              )}
                              whileHover={{ scale: 1.05 }}
                            >
                              <img
                                src={item.images[0].url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                          </Link>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                              <div>
                                <Link
                                  to={`/products/${item.slug}`}
                                  className="font-medium text-gray-900 hover:text-amber-600 transition-colors line-clamp-2"
                                >
                                  {item.name}
                                </Link>
                                <div className="flex items-center gap-2 mt-1">
                                  {item.isNewArrival && (
                                    <Badge variant="primary" size="sm">New</Badge>
                                  )}
                                  {discount > 0 && (
                                    <Badge variant="danger" size="sm">-{discount}%</Badge>
                                  )}
                                  {isOutOfStock && (
                                    <Badge variant="secondary" size="sm">Out of Stock</Badge>
                                  )}
                                </div>
                              </div>

                              {/* Price */}
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(item.salePrice || item.basePrice)}
                                </span>
                                {item.salePrice && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(item.basePrice)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mt-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={cn(
                                      'w-4 h-4',
                                      i < Math.floor(item.rating) ? 'text-amber-400' : 'text-gray-200'
                                    )}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                ({item.reviewCount} reviews)
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 mt-4">
                              <Button
                                size="sm"
                                onClick={() => handleAddToCart(item)}
                                disabled={isOutOfStock}
                                leftIcon={<ShoppingBag className="h-4 w-4" />}
                              >
                                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                              </Button>
                              <motion.button
                                onClick={() => handleRemoveItem(item.id, item.name)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="h-5 w-5" />
                              </motion.button>
                              <motion.button
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Share2 className="h-5 w-5" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  );
                })}
              </AnimatePresence>
            </div>
          </StaggerChildren>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
