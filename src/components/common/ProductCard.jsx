import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { cn, formatPrice, calculateDiscount } from '@/lib/utils';
import { PLACEHOLDER_IMAGE } from '@/config/constants';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';

function ProductCard({
  product,
  className,
  showQuickView = true,
  showWishlist = true,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { addItem } = useCartStore();
  const { openQuickView, showSuccess } = useUIStore();

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
  } = product;

  const primaryImage = images?.[0]?.url || PLACEHOLDER_IMAGE;
  const secondaryImage = images?.[1]?.url;
  const discount = calculateDiscount(basePrice, salePrice);
  const isOutOfStock = stockQuantity === 0 || status === 'out_of_stock';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem(product);
    showSuccess(`${name} added to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    showSuccess(`${name} added to wishlist`);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <Link
      to={`/products/${slug}`}
      className={cn(
        'group block bg-white rounded-xl overflow-hidden',
        'transition-all duration-300',
        'hover:shadow-lg',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Primary Image */}
        <img
          src={imageError ? PLACEHOLDER_IMAGE : primaryImage}
          alt={name}
          className={cn(
            'w-full h-full object-cover transition-all duration-500',
            isHovered && secondaryImage ? 'opacity-0' : 'opacity-100',
            'group-hover:scale-105'
          )}
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Secondary Image (on hover) */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${name} - alternate view`}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
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
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div
          className={cn(
            'absolute top-3 right-3 flex flex-col gap-2',
            'transition-all duration-300',
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          )}
        >
          {showWishlist && (
            <button
              onClick={handleWishlist}
              className="p-2 bg-white rounded-full shadow-md hover:bg-amber-50 hover:text-amber-600 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
          )}
          {showQuickView && (
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md hover:bg-amber-50 hover:text-amber-600 transition-colors"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Add to Cart Button */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 p-3',
            'transition-all duration-300',
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-full'
          )}
        >
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full"
            size="sm"
            leftIcon={<ShoppingBag className="h-4 w-4" />}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
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
    </Link>
  );
}

export default ProductCard;
