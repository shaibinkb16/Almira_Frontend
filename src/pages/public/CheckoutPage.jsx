import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Truck, MapPin, ShoppingBag, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ordersService } from '@/services/api/ordersService';
import { paymentService } from '@/services/api/paymentService';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { ROUTES, generateRoute } from '@/config/routes';
import { addressValidation } from '@/services/addressValidation';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, session } = useAuthStore();
  const { items: cartItems, clearCart, loadFromServer, isLoading } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [pincodeValidation, setPincodeValidation] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    // Check if user is logged in
    if (!session || !user) {
      console.warn('Cart requires authentication, redirecting to login');
      navigate('/auth/login');
      return;
    }

    // Load cart from Supabase
    try {
      await loadFromServer();
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const calculateTotals = () => {
    if (!cartItems || cartItems.length === 0) return { subtotal: 0, shipping: 0, total: 0 };

    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.salePrice || item.basePrice;
      return sum + price * item.quantity;
    }, 0);

    const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
    const total = subtotal + shipping;

    return { subtotal, shipping, total };
  };

  const { subtotal, shipping, total } = calculateTotals();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    setAddressErrors((prev) => ({ ...prev, [name]: null }));

    // Real-time PIN code validation
    if (name === 'pincode' && value.length === 6) {
      validatePincode(value, shippingAddress.city, shippingAddress.state);
    }

    // Real-time phone validation
    if (name === 'phone' && value.length === 10) {
      if (!addressValidation.isValidPhoneFormat(value)) {
        setAddressErrors((prev) => ({
          ...prev,
          phone: 'Phone number must start with 6, 7, 8, or 9',
        }));
      }
    }
  };

  const validatePincode = (pincode, city, state) => {
    if (!addressValidation.isValidPinFormat(pincode)) {
      setPincodeValidation({ valid: false, message: 'Invalid PIN code format' });
      return;
    }

    // Check if PIN matches city and state
    const validation = addressValidation.validatePinForCity(pincode, city, state);
    setPincodeValidation(validation);

    if (!validation.valid) {
      setAddressErrors((prev) => ({
        ...prev,
        pincode: validation.error,
      }));
    } else {
      // Auto-suggest state if not filled
      const suggestedState = addressValidation.getStateFromPin(pincode);
      if (suggestedState && !state) {
        setShippingAddress((prev) => ({ ...prev, state: suggestedState }));
      }
    }
  };

  const validateForm = () => {
    // Comprehensive validation
    const validation = addressValidation.validateAddress(shippingAddress);

    if (!validation.valid) {
      const errorMessage = addressValidation.formatErrors(validation);
      alert('❌ Address Validation Failed\n\n' + errorMessage);

      // Set errors for display
      const errorsByField = {};
      validation.errors.forEach((err) => {
        errorsByField[err.field] = err.message;
      });
      setAddressErrors(errorsByField);

      return false;
    }

    // Check risk score for fraud detection
    if (validation.riskScore >= 20) {
      alert('⚠️ Security Alert\n\nYour address has been flagged for review. Please ensure all details are correct.');
      return false;
    }

    // Show warnings but allow to proceed
    if (validation.warnings.length > 0) {
      const warningMsg = validation.warnings.map(w => w.message).join('\n');
      const proceed = confirm(
        '⚠️ Please Review\n\n' + warningMsg + '\n\nDo you want to proceed?'
      );
      if (!proceed) return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Step 0: Ensure cart is synced to server
      console.log('📤 Syncing cart to server...', { itemCount: cartItems.length, items: cartItems });
      const { syncToServer } = useCartStore.getState();

      try {
        await syncToServer();
        console.log('✅ Cart synced to server successfully');
      } catch (syncError) {
        console.error('❌ Cart sync failed:', syncError);
        alert('Failed to sync cart to server. Please try again.\n\nError: ' + syncError.message);
        setLoading(false);
        return;
      }

      // Step 1: Save shipping address first
      const { supabase } = await import('@/lib/supabase/client');

      const addressData = {
        user_id: user.id,  // This references profiles(id)
        address_type: 'shipping',
        full_name: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address_line1: shippingAddress.address,
        address_line2: null,
        landmark: null,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.pincode,
        country: 'India',
        is_default: false,
        label: 'home',  // Must be lowercase: 'home', 'work', or 'other'
      };

      const { data: addressResult, error: addressError } = await supabase
        .from('addresses')
        .insert(addressData)
        .select()
        .single();

      if (addressError) {
        alert('Failed to save address: ' + addressError.message);
        setLoading(false);
        return;
      }

      // Step 2: Prepare cart items
      const items = cartItems.map(item => ({
        product_id: String(item.productId),  // Ensure string
        variant_id: item.variantId ? String(item.variantId) : null,  // Ensure string or null
        quantity: parseInt(item.quantity),  // Ensure integer
      }));

      console.log('📦 Prepared cart items:', items);

      // Step 3: Create order with correct format
      const orderData = {
        items: items,
        shipping_address_id: String(addressResult.id),  // Ensure string UUID
        payment_method: paymentMethod,
      };

      console.log('📦 Order data being sent:', orderData);

      const orderResult = await ordersService.createOrder(orderData);

      if (!orderResult.success) {
        console.error('❌ Order creation failed:', orderResult);

        // Format error message
        let errorMsg = 'Failed to create order:\n\n';
        if (Array.isArray(orderResult.error)) {
          errorMsg += orderResult.error.map(err =>
            typeof err === 'object' ? JSON.stringify(err, null, 2) : err
          ).join('\n');
        } else {
          errorMsg += orderResult.error;
        }

        alert(errorMsg);
        setLoading(false);
        return;
      }

      const orderId = orderResult.data.id;

      // Handle payment based on method
      if (paymentMethod === 'razorpay') {
        // Create Razorpay order
        const paymentOrderResult = await paymentService.createPaymentOrder(orderId);

        if (!paymentOrderResult.success) {
          alert('Failed to initialize payment');
          setLoading(false);
          return;
        }

        const { razorpayOrderId, amount, keyId } = paymentOrderResult.data;

        // Open Razorpay checkout
        paymentService.openCheckout({
          orderId: orderId,
          amount: amount,
          razorpayOrderId: razorpayOrderId,
          keyId: keyId,
          customerName: shippingAddress.fullName,
          customerEmail: user?.email || '',
          customerPhone: shippingAddress.phone,
          onSuccess: (response) => {
            console.log('Payment Success:', response);
            clearCart();
            navigate(generateRoute(ROUTES.ORDER_SUCCESS, { orderId }));
          },
          onFailure: (error) => {
            console.error('Payment Failed:', error);
            setLoading(false);
            navigate(generateRoute(ROUTES.ORDER_FAILURE, { orderId }));
          },
        });
      } else {
        // COD order - direct success
        clearCart();
        navigate(generateRoute(ROUTES.ORDER_SUCCESS, { orderId }));
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to checkout</p>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number (must start with 6-9)"
                    maxLength={10}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      addressErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  {addressErrors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {addressErrors.phone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="House No, Building Name, Street, Area"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        addressErrors.pincode
                          ? 'border-red-500 bg-red-50'
                          : pincodeValidation?.valid
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300'
                      }`}
                      required
                    />
                    {pincodeValidation?.valid && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                    )}
                    {addressErrors.pincode && (
                      <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600" />
                    )}
                  </div>
                  {addressErrors.pincode && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {addressErrors.pincode}
                    </p>
                  )}
                  {pincodeValidation?.valid && pincodeValidation?.message && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {pincodeValidation.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-4">
                {/* Razorpay */}
                <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-amber-500 transition-colors" htmlFor="razorpay">
                  <input
                    type="radio"
                    id="razorpay"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="h-5 w-5 text-gray-700" />
                      <span className="font-semibold text-gray-900">Online Payment</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Recommended</span>
                    </div>
                    <p className="text-sm text-gray-600">Pay via Cards, UPI, NetBanking, Wallets</p>
                    <p className="text-xs text-gray-500 mt-1">Instant confirmation • 100% Secure</p>
                  </div>
                </label>

                {/* COD */}
                <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-amber-500 transition-colors" htmlFor="cod">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Banknote className="h-5 w-5 text-gray-700" />
                      <span className="font-semibold text-gray-900">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-gray-600">Pay when you receive the product</p>
                    <p className="text-xs text-gray-500 mt-1">Available for all pincodes</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.variantName && (
                        <p className="text-xs text-gray-500">{item.variantName}</p>
                      )}
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{((item.salePrice || item.basePrice) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Truck className="h-5 w-5 mr-2" />
                    Place Order
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
