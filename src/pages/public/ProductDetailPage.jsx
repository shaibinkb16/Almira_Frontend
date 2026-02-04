import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Share2,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  RefreshCw,
  ChevronRight,
  Minus,
  Plus,
  Check,
  ZoomIn,
} from 'lucide-react';
import { cn, formatPrice, calculateDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
  AnimatedProductCard,
  Skeleton,
} from '@/components/ui';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { useMediaQuery } from '@/hooks';
import { sampleProductDetail, sampleProducts, sampleReviews, IMAGES } from '@/data/sampleData';

// Related products (take first 4 products from sample)
const relatedProducts = sampleProducts.slice(1, 5);

// Use imported reviews
const reviews = sampleReviews;

function ProductDetailPage() {
  const { slug } = useParams();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const { addItem } = useCartStore();
  const { showSuccess } = useUIStore();

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProduct(sampleProductDetail);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    showSuccess(`${product.name} added to cart`);
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, product?.stockQuantity || 1)));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount(product.basePrice, product.salePrice);
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link to={`/categories/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-gray-700">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <FadeInOnScroll direction="left">
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div
                className="relative aspect-square rounded-2xl overflow-hidden bg-white cursor-zoom-in"
                onClick={() => setIsZoomOpen(true)}
                whileHover={{ scale: 1.01 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage].url}
                    alt={product.images[selectedImage].alt}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNewArrival && (
                    <Badge variant="primary">New</Badge>
                  )}
                  {discount > 0 && (
                    <Badge variant="danger">-{discount}%</Badge>
                  )}
                </div>

                {/* Zoom Icon */}
                <div className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full">
                  <ZoomIn className="h-5 w-5 text-gray-700" />
                </div>
              </motion.div>

              {/* Thumbnail Grid */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                      selectedImage === index ? 'border-amber-500' : 'border-transparent'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeInOnScroll>

          {/* Product Info */}
          <FadeInOnScroll direction="right">
            <div className="space-y-6">
              {/* Title & Rating */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                    <span className="text-sm font-medium text-gray-900 ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.salePrice || product.basePrice)}
                </span>
                {product.salePrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.basePrice)}
                    </span>
                    <Badge variant="success">Save {formatPrice(product.basePrice - product.salePrice)}</Badge>
                  </>
                )}
              </div>

              {/* Color Selection */}
              {product.colors && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Color: <span className="text-gray-900">{product.colors[selectedColor].name}</span>
                  </label>
                  <div className="flex gap-3">
                    {product.colors.map((color, index) => (
                      <motion.button
                        key={color.name}
                        onClick={() => setSelectedColor(index)}
                        className={cn(
                          'w-10 h-10 rounded-full border-2 flex items-center justify-center',
                          selectedColor === index ? 'border-gray-900' : 'border-gray-200'
                        )}
                        style={{ backgroundColor: color.value }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {selectedColor === index && (
                          <Check className="h-5 w-5 text-white drop-shadow-md" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-xl">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stockQuantity}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stockQuantity} in stock
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="w-full"
                    leftIcon={<ShoppingBag className="h-5 w-5" />}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  <Heart className="h-6 w-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  <Share2 className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto text-amber-500 mb-2" />
                  <p className="text-xs text-gray-600">Free Delivery</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto text-amber-500 mb-2" />
                  <p className="text-xs text-gray-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="h-6 w-6 mx-auto text-amber-500 mb-2" />
                  <p className="text-xs text-gray-600">7-Day Returns</p>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Material</span>
                  <span className="text-gray-900 font-medium">{product.material}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Weight</span>
                  <span className="text-gray-900 font-medium">{product.weight}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Dimensions</span>
                  <span className="text-gray-900 font-medium">{product.dimensions}</span>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {['description', 'features', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'py-4 text-sm font-medium border-b-2 transition-colors capitalize',
                    activeTab === tab
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="py-8"
            >
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                </div>
              )}

              {activeTab === 'features' && (
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="flex items-center gap-8 p-6 bg-white rounded-2xl">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{product.rating}</div>
                      <div className="flex items-center gap-1 justify-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-4 w-4',
                              i < Math.floor(product.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            )}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{product.reviewCount} reviews</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 w-6">{star}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review List */}
                  <StaggerChildren staggerDelay={0.1}>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <StaggerItem key={review.id}>
                          <motion.div
                            className="bg-white rounded-2xl p-6"
                            whileHover={{ y: -2 }}
                          >
                            <div className="flex items-start gap-4">
                              <img
                                src={review.avatar}
                                alt={review.user}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">{review.user}</span>
                                  <span className="text-sm text-gray-400">{review.date}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        'h-3 w-3',
                                        i < review.rating
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-gray-300'
                                      )}
                                    />
                                  ))}
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                                <p className="text-gray-600 text-sm">{review.content}</p>
                                {review.images && (
                                  <div className="flex gap-2 mt-3">
                                    {review.images.map((img, i) => (
                                      <img
                                        key={i}
                                        src={img}
                                        alt="Review"
                                        className="w-20 h-20 object-cover rounded-lg"
                                      />
                                    ))}
                                  </div>
                                )}
                                <div className="mt-3 text-sm text-gray-500">
                                  {review.helpful} people found this helpful
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </StaggerItem>
                      ))}
                    </div>
                  </StaggerChildren>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <FadeInOnScroll>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          </FadeInOnScroll>
          <StaggerChildren staggerDelay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <StaggerItem key={relatedProduct.id}>
                  <AnimatedProductCard product={relatedProduct} index={index} />
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </section>
      </div>

      {/* Image Zoom Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title=""
        size="full"
      >
        <div className="flex items-center justify-center min-h-[80vh]">
          <img
            src={product.images[selectedImage].url}
            alt={product.images[selectedImage].alt}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                'w-16 h-16 rounded-lg overflow-hidden border-2',
                selectedImage === index ? 'border-amber-500' : 'border-transparent'
              )}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default ProductDetailPage;
