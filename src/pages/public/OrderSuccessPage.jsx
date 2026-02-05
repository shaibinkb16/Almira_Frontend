import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ordersService } from '@/services/api/ordersService';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const result = await ordersService.getOrderDetails(orderId);
      if (result.success) {
        setOrder(result.data);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-lg font-semibold text-gray-900">#{order?.id?.slice(0, 8)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Order Total</p>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{order?.totalAmount?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Payment Status */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900">
                {order?.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
              </span>
            </div>

            {order?.paymentMethod === 'razorpay' && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order?.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order?.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            )}

            {/* Order Status */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Status</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {order?.status || 'Pending'}
              </span>
            </div>

            {/* Shipping Address */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
              <div className="text-gray-900">
                <p className="font-medium">{order?.shippingAddress?.fullName}</p>
                <p className="text-sm">{order?.shippingAddress?.address}</p>
                <p className="text-sm">
                  {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pincode}
                </p>
                <p className="text-sm">Phone: {order?.shippingAddress?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-1">What happens next?</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You will receive an order confirmation email shortly</li>
                <li>• Your order will be processed within 24 hours</li>
                <li>• You can track your order status in "My Orders"</li>
                {order?.paymentMethod === 'cod' && (
                  <li>• Keep exact cash ready for payment on delivery</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/user/orders')}
          >
            <Package className="h-4 w-4 mr-2" />
            View My Orders
          </Button>
          <Button
            className="flex-1"
            onClick={() => navigate('/products')}
          >
            <Home className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        {/* Support */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">Need help with your order?</p>
          <Link to="/contact" className="text-amber-600 hover:text-amber-700 text-sm font-medium inline-flex items-center gap-1 mt-1">
            Contact Support <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
