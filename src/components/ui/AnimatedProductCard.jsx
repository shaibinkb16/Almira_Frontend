import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { cn, formatPrice, calculateDiscount } from '@/lib/utils';
import { PLACEHOLDER_IMAGE } from '@/config/constants';
import { Badge } from './Badge';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';

export function AnimatedProductCard({
  product,
  className,
  index = 0,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const { addItem } = useCartStore();
  const { showSuccess } = useUIStore();

  const {
    id,
    name,
    slug,
    basePrice,
    salePrice,
    images,
    status,
    isFeatured,
    isNewArrival,
    stockQuantity,
    rating,
    reviewCount,
  } = product;

  const primaryImage = images?.[0]?.url || PLACEHOLDER_IMAGE;
  const secondaryImage = images?.[1]?.url;
  const discount = calculateDiscount(basePrice, salePrice);
  const isOutOfStock = stockQuantity === 0 || status === 'out_of_stock';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotationX = (y - centerY) / 25;
    const rotationY = -(x - centerX) / 25;

    setRotation({ x: rotationX, y: rotationY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product);
    showSuccess(`${name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn('group', className)}
    >
      <Link to={`/products/${slug}`}>
        <motion.div
          ref={cardRef}
          className="relative bg-white rounded-2xl overflow-hidden shadow-sm"
          style={{
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            {/* Primary Image */}
            <motion.img
              src={imageError ? PLACEHOLDER_IMAGE : primaryImage}
              alt={name}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1,
                opacity: isHovered && secondaryImage ? 0 : 1,
              }}
              transition={{ duration: 0.5 }}
              onError={() => setImageError(true)}
              loading="lazy"
            />

            {/* Secondary Image (on hover) */}
            {secondaryImage && (
              <motion.img
                src={secondaryImage}
                alt={`${name} - alternate view`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {isNewArrival && (
                <Badge variant="primary" size="sm">
                  New
                </Badge>
              )}
              {discount > 0 && (
                <Badge variant="danger" size="sm">
                  -{discount}%
                </Badge>
              )}
              {isFeatured && (
                <Badge variant="warning" size="sm">
                  Featured
                </Badge>
              )}
            </div>

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <span className="text-white font-semibold px-4 py-2 bg-black/30 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Quick Actions */}
            <motion.div
              className="absolute top-3 right-3 flex flex-col gap-2 z-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  showSuccess(`${name} added to wishlist`);
                }}
                className="p-2.5 bg-white rounded-full shadow-lg hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                <Heart className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="p-2.5 bg-white rounded-full shadow-lg hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                <Eye className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </motion.button>
            </motion.div>

            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: isHovered ? '100%' : '-100%' }}
              transition={{ duration: 0.6 }}
            />
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-gray-900">{rating}</span>
                {reviewCount && (
                  <span className="text-sm text-gray-500">({reviewCount})</span>
                )}
              </div>
            )}

            {/* Product Name */}
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
              {name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(salePrice || basePrice)}
              </span>
              {salePrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(basePrice)}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default AnimatedProductCard;
