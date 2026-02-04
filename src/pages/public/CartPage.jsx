import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ChevronRight,
  Tag,
  Truck,
  Shield,
  ArrowRight,
  X,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
  AnimatedProductCard,
} from '@/components/ui';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';
import { sampleProducts, IMAGES } from '@/data/sampleData';

// Recommended products (take last 4 products from sample)
const recommendedProducts = sampleProducts.slice(1, 5);

function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { showSuccess } = useUIStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = getTotal();
  const shipping = subtotal > 2999 ? 0 : 99;
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0; // 10% discount
  const total = subtotal + shipping - discount;

  const handleQuantityChange = (itemId, delta) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        updateQuantity(itemId, newQuantity);
      }
    }
  };

  const handleRemoveItem = (itemId, itemName) => {
    removeItem(itemId);
    showSuccess(`${itemName} removed from cart`);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    // Simulate API call
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'ALMIRA10') {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 10 });
        showSuccess('Coupon applied successfully!');
      } else {
        useUIStore.getState().showError('Invalid coupon code');
      }
      setIsApplyingCoupon(false);
    }, 500);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate(ROUTES.CHECKOUT);
    } else {
      navigate(ROUTES.LOGIN, { state: { from: ROUTES.CHECKOUT } });
    }
  };

  if (items.length === 0) {
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
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added anything to your cart yet.
              Start shopping to fill it up!
            </p>
            <Button size="lg" asChild>
              <Link to={ROUTES.PRODUCTS}>
                Start Shopping
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>

            {/* Recommended Products */}
            <div className="mt-16">
              <h2 className="text-xl font-bold text-gray-900 mb-6">You might like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedProducts.map((product, index) => (
                  <AnimatedProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <FadeInOnScroll>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Shopping Cart ({getItemCount()} items)
            </h1>
          </FadeInOnScroll>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <StaggerChildren staggerDelay={0.1}>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <StaggerItem key={item.id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="bg-white rounded-2xl p-4 md:p-6 shadow-sm"
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <Link
                            to={`/products/${item.slug}`}
                            className="flex-shrink-0"
                          >
                            <motion.div
                              className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-100"
                              whileHover={{ scale: 1.05 }}
                            >
                              <img
                                src={item.images?.[0]?.url || IMAGES.necklace1}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <div>
                                <Link
                                  to={`/products/${item.slug}`}
                                  className="font-medium text-gray-900 hover:text-amber-600 transition-colors line-clamp-2"
                                >
                                  {item.name}
                                </Link>
                                {item.selectedColor && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Color: {item.selectedColor}
                                  </p>
                                )}
                              </div>
                              <motion.button
                                onClick={() => handleRemoveItem(item.id, item.name)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="h-5 w-5" />
                              </motion.button>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              {/* Quantity */}
                              <div className="flex items-center border border-gray-200 rounded-lg">
                                <motion.button
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Minus className="h-4 w-4" />
                                </motion.button>
                                <span className="w-10 text-center font-medium text-sm">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="p-2 hover:bg-gray-50"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Plus className="h-4 w-4" />
                                </motion.button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <div className="font-bold text-gray-900">
                                  {formatPrice((item.salePrice || item.basePrice) * item.quantity)}
                                </div>
                                {item.salePrice && (
                                  <div className="text-sm text-gray-400 line-through">
                                    {formatPrice(item.basePrice * item.quantity)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </AnimatePresence>
              </div>
            </StaggerChildren>

            {/* Clear Cart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex justify-end"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearCart();
                  showSuccess('Cart cleared');
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <FadeInOnScroll direction="right">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Have a coupon?
                  </label>
                  {appliedCoupon ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">
                          {appliedCoupon.code}
                        </span>
                        <Badge variant="success" size="sm">
                          {appliedCoupon.discount}% off
                        </Badge>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        leftIcon={<Tag className="h-4 w-4" />}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        isLoading={isApplyingCoupon}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Try: ALMIRA10 for 10% off
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className={cn(
                      'font-medium',
                      shipping === 0 ? 'text-green-600' : 'text-gray-900'
                    )}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600 font-medium">-{formatPrice(discount)}</span>
                    </motion.div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between py-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">{formatPrice(total)}</span>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 2999 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3 bg-amber-50 rounded-xl border border-amber-200"
                  >
                    <div className="flex items-center gap-2 text-amber-700 text-sm">
                      <Truck className="h-4 w-4" />
                      <span>
                        Add {formatPrice(2999 - subtotal)} more for free shipping!
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-amber-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(subtotal / 2999) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Checkout Button */}
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleCheckout}
                    rightIcon={<ChevronRight className="h-5 w-5" />}
                  >
                    {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                  </Button>
                </motion.div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout with SSL encryption</span>
                </div>

                {/* Payment Methods */}
                <div className="mt-4 flex items-center justify-center gap-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png"
                    alt="Visa"
                    className="h-6 object-contain grayscale opacity-50"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png"
                    alt="Mastercard"
                    className="h-6 object-contain grayscale opacity-50"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/100px-PayPal.svg.png"
                    alt="PayPal"
                    className="h-6 object-contain grayscale opacity-50"
                  />
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </div>

        {/* Recommended Products */}
        <section className="mt-16">
          <FadeInOnScroll>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          </FadeInOnScroll>
          <StaggerChildren staggerDelay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {recommendedProducts.map((product, index) => (
                <StaggerItem key={product.id}>
                  <AnimatedProductCard product={product} index={index} />
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </section>
      </div>
    </div>
  );
}

export default CartPage;
