import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Truck,
  MapPin,
  ShoppingBag,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  Lock,
  User,
  Mail,
  Phone,
  Home,
  Edit2,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CheckoutTrustIndicators } from '@/components/ui/TrustBadges';
import { ordersService } from '@/services/api/ordersService';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';
import { supabase } from '@/lib/supabase/client';

const STEPS = [
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, session } = useAuthStore();
  const { items: cartItems, clearCart, getTotals } = useCartStore();
  const { showSuccess, showError } = useUIStore();

  const [currentStep, setCurrentStep] = useState('shipping');
  const [loading, setLoading] = useState(false);
  const [isGuestCheckout, setIsGuestCheckout] = useState(!session);

  // Guest info
  const [guestInfo, setGuestInfo] = useState({
    email: '',
    fullName: '',
    phone: '',
  });

  // Shipping address
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  // Saved addresses (for logged-in users)
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }

    if (session && user) {
      setIsGuestCheckout(false);
      loadSavedAddresses();
    }
  }, [cartItems, session, user]);

  const loadSavedAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;

      setSavedAddresses(data || []);

      // Auto-select default address
      const defaultAddr = data?.find((addr) => addr.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setShippingAddress({
          address: defaultAddr.address_line1,
          city: defaultAddr.city,
          state: defaultAddr.state,
          pincode: defaultAddr.pincode,
          country: defaultAddr.country || 'India',
        });
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const validateShippingStep = () => {
    const newErrors = {};

    if (isGuestCheckout) {
      if (!guestInfo.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email))
        newErrors.email = 'Invalid email format';
      if (!guestInfo.fullName) newErrors.fullName = 'Full name is required';
      if (!guestInfo.phone) newErrors.phone = 'Phone is required';
      else if (!/^\d{10}$/.test(guestInfo.phone))
        newErrors.phone = 'Invalid phone number (10 digits)';
    }

    if (!shippingAddress.address) newErrors.address = 'Address is required';
    if (!shippingAddress.city) newErrors.city = 'City is required';
    if (!shippingAddress.state) newErrors.state = 'State is required';
    if (!shippingAddress.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(shippingAddress.pincode))
      newErrors.pincode = 'Invalid pincode (6 digits)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateShippingStep()) {
      setCurrentStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContinueToReview = () => {
    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      // Prepare order data
      const orderData = {
        shipping_address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.pincode}, ${shippingAddress.country}`,
        payment_method: paymentMethod,
        notes: isGuestCheckout
          ? `Guest: ${guestInfo.fullName} (${guestInfo.email}, ${guestInfo.phone})`
          : null,
      };

      // For guest checkout, we'd need to create an account or handle differently
      // For now, require login
      if (isGuestCheckout) {
        showError('Please create an account to complete your order');
        navigate('/auth/register');
        return;
      }

      const result = await ordersService.createOrder(orderData);

      if (result.success) {
        clearCart();
        showSuccess('Order placed successfully!');
        navigate(`/order/success/${result.data.id}`);
      } else {
        showError(result.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      showError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSavedAddress = (address) => {
    setSelectedAddressId(address.id);
    setShippingAddress({
      address: address.address_line1,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country || 'India',
    });
  };

  const totals = getTotals();

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase in a few simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                      currentStepIndex >= index
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    )}
                  >
                    {currentStepIndex > index ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm mt-2 font-medium',
                      currentStepIndex >= index ? 'text-gray-900' : 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-4 transition-all',
                      currentStepIndex > index ? 'bg-amber-500' : 'bg-gray-300'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {currentStep === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Shipping Information
                    </h2>

                    {/* Guest/Login Toggle */}
                    {!session && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-blue-900 mb-2">
                              Already have an account?{' '}
                              <button
                                onClick={() => navigate('/auth/login')}
                                className="font-semibold underline hover:text-blue-700"
                              >
                                Sign in
                              </button>{' '}
                              for faster checkout
                            </p>
                            <label className="flex items-center gap-2 text-sm text-blue-800">
                              <input
                                type="checkbox"
                                checked={isGuestCheckout}
                                onChange={(e) => setIsGuestCheckout(e.target.checked)}
                                className="rounded border-blue-300"
                              />
                              Continue as guest
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Guest Contact Info */}
                    {isGuestCheckout && (
                      <div className="space-y-4 mb-6 pb-6 border-b">
                        <h3 className="font-semibold text-gray-900">Contact Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <Input
                              value={guestInfo.fullName}
                              onChange={(e) =>
                                setGuestInfo({ ...guestInfo, fullName: e.target.value })
                              }
                              placeholder="John Doe"
                              error={errors.fullName}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email *
                            </label>
                            <Input
                              type="email"
                              value={guestInfo.email}
                              onChange={(e) =>
                                setGuestInfo({ ...guestInfo, email: e.target.value })
                              }
                              placeholder="john@example.com"
                              leftIcon={<Mail className="h-4 w-4" />}
                              error={errors.email}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone *
                            </label>
                            <Input
                              type="tel"
                              value={guestInfo.phone}
                              onChange={(e) =>
                                setGuestInfo({ ...guestInfo, phone: e.target.value })
                              }
                              placeholder="9876543210"
                              leftIcon={<Phone className="h-4 w-4" />}
                              error={errors.phone}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Saved Addresses (for logged-in users) */}
                    {!isGuestCheckout && savedAddresses.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Saved Addresses</h3>
                        <div className="space-y-3">
                          {savedAddresses.map((addr) => (
                            <button
                              key={addr.id}
                              onClick={() => handleSelectSavedAddress(addr)}
                              className={cn(
                                'w-full text-left p-4 rounded-lg border-2 transition-all',
                                selectedAddressId === addr.id
                                  ? 'border-amber-500 bg-amber-50'
                                  : 'border-gray-200 hover:border-amber-300'
                              )}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900">
                                      {addr.label || 'Address'}
                                    </span>
                                    {addr.is_default && (
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {addr.address_line1}, {addr.city}, {addr.state}{' '}
                                    {addr.pincode}
                                  </p>
                                </div>
                                {selectedAddressId === addr.id && (
                                  <CheckCircle className="h-5 w-5 text-amber-500" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 text-center">
                          <button
                            onClick={() => setSelectedAddressId(null)}
                            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                          >
                            + Use a different address
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Address Form */}
                    {(isGuestCheckout || !selectedAddressId || savedAddresses.length === 0) && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address *
                          </label>
                          <Input
                            value={shippingAddress.address}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                address: e.target.value,
                              })
                            }
                            placeholder="Street address, apartment, suite, etc."
                            leftIcon={<Home className="h-4 w-4" />}
                            error={errors.address}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                            </label>
                            <Input
                              value={shippingAddress.city}
                              onChange={(e) =>
                                setShippingAddress({ ...shippingAddress, city: e.target.value })
                              }
                              placeholder="Mumbai"
                              error={errors.city}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State *
                            </label>
                            <Input
                              value={shippingAddress.state}
                              onChange={(e) =>
                                setShippingAddress({ ...shippingAddress, state: e.target.value })
                              }
                              placeholder="Maharashtra"
                              error={errors.state}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pincode *
                            </label>
                            <Input
                              value={shippingAddress.pincode}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  pincode: e.target.value,
                                })
                              }
                              placeholder="400001"
                              maxLength={6}
                              error={errors.pincode}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Country
                            </label>
                            <Input
                              value={shippingAddress.country}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleContinueToPayment} size="lg">
                        Continue to Payment
                        <ChevronRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

                    <div className="space-y-3 mb-6">
                      {/* COD */}
                      <button
                        onClick={() => setPaymentMethod('cod')}
                        className={cn(
                          'w-full text-left p-4 rounded-lg border-2 transition-all',
                          paymentMethod === 'cod'
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-amber-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                            💵
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                            <p className="text-sm text-gray-600">
                              Pay when you receive your order
                            </p>
                          </div>
                          {paymentMethod === 'cod' && (
                            <CheckCircle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                      </button>

                      {/* UPI */}
                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={cn(
                          'w-full text-left p-4 rounded-lg border-2 transition-all',
                          paymentMethod === 'upi'
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-amber-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                            📱
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">UPI Payment</h3>
                            <p className="text-sm text-gray-600">
                              PhonePe, Google Pay, Paytm, etc.
                            </p>
                          </div>
                          {paymentMethod === 'upi' && (
                            <CheckCircle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                      </button>

                      {/* Card */}
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={cn(
                          'w-full text-left p-4 rounded-lg border-2 transition-all',
                          paymentMethod === 'card'
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-amber-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                            <CreditCard className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Credit/Debit Card</h3>
                            <p className="text-sm text-gray-600">
                              Visa, Mastercard, Amex, RuPay
                            </p>
                          </div>
                          {paymentMethod === 'card' && (
                            <CheckCircle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                      </button>
                    </div>

                    <CheckoutTrustIndicators className="mb-6" />

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('shipping')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button onClick={handleContinueToReview} className="flex-1" size="lg">
                        Continue to Review
                        <ChevronRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>

                    {/* Shipping Info Summary */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                        <button
                          onClick={() => setCurrentStep('shipping')}
                          className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
                        >
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        {isGuestCheckout && (
                          <>
                            {guestInfo.fullName}
                            <br />
                            {guestInfo.email} • {guestInfo.phone}
                            <br />
                          </>
                        )}
                        {shippingAddress.address}
                        <br />
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
                        <br />
                        {shippingAddress.country}
                      </p>
                    </div>

                    {/* Payment Method Summary */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">Payment Method</h3>
                        <button
                          onClick={() => setCurrentStep('payment')}
                          className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
                        >
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI Payment' : 'Credit/Debit Card'}</p>
                    </div>

                    {/* Terms */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="mb-2">
                            By placing your order, you agree to our{' '}
                            <a href="/terms" className="underline">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="underline">
                              Privacy Policy
                            </a>
                            .
                          </p>
                          <p>All orders are subject to product availability.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('payment')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handlePlaceOrder}
                        loading={loading}
                        className="flex-1"
                        size="lg"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Place Order - {formatPrice(totals.total)}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order Summary
              </h3>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice((item.salePrice || item.basePrice) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {totals.shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(totals.shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">{formatPrice(totals.tax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-amber-600">
                    {formatPrice(totals.total)}
                  </span>
                </div>
              </div>

              {totals.shipping === 0 && totals.subtotal >= 2999 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    🎉 You've unlocked FREE shipping!
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
