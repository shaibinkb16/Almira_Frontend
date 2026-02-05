import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Home, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ordersService } from '@/services/api/ordersService';
import { paymentService } from '@/services/api/paymentService';

export default function OrderFailurePage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

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

  const handleRetryPayment = async () => {
    setRetrying(true);

    try {
      // Create new Razorpay order
      const paymentOrderResult = await paymentService.createPaymentOrder(orderId);

      if (!paymentOrderResult.success) {
        alert('Failed to initialize payment. Please try again.');
        setRetrying(false);
        return;
      }

      const { razorpayOrderId, amount, keyId } = paymentOrderResult.data;

      // Open Razorpay checkout
      paymentService.openCheckout({
        orderId: orderId,
        amount: amount,
        razorpayOrderId: razorpayOrderId,
        keyId: keyId,
        customerName: order?.shippingAddress?.fullName || '',
        customerEmail: '',
        customerPhone: order?.shippingAddress?.phone || '',
        onSuccess: (response) => {
          console.log('Payment Success:', response);
          navigate(`/order/success/${orderId}`);
        },
        onFailure: (error) => {
          console.error('Payment Failed:', error);
          setRetrying(false);
          alert('Payment failed again. Please try a different payment method.');
        },
      });
    } catch (error) {
      console.error('Retry error:', error);
      alert('Failed to retry payment. Please try again.');
      setRetrying(false);
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
        {/* Failure Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600">
            Your payment could not be processed
          </p>
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
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{order?.totalAmount?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Payment Status */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Status</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                Failed
              </span>
            </div>

            {/* Order Status */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Status</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                Pending Payment
              </span>
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <HelpCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900 mb-1">Why did this happen?</p>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Insufficient funds in your account</li>
                <li>• Payment gateway timeout</li>
                <li>• Network connectivity issues</li>
                <li>• Payment cancelled by you</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Retry Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <RefreshCw className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-1">Want to try again?</p>
              <p className="text-sm text-blue-800">
                You can retry payment or choose Cash on Delivery instead.
                Your order is still saved and waiting for payment.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full"
            size="lg"
            onClick={handleRetryPayment}
            disabled={retrying}
          >
            {retrying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                Retry Payment
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/user/orders')}
          >
            View My Orders
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/products')}
          >
            <Home className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-2">Need help?</p>
          <Button
            variant="link"
            onClick={() => navigate('/contact')}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
