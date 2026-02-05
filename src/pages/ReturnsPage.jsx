import { RefreshCw, CheckCircle, XCircle, Clock, Package, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { APP_NAME } from '@/config/constants';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Returns & Exchanges Policy
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We want you to love your purchase! If you're not completely satisfied, we offer a
            hassle-free 30-day return and exchange policy.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">30-Day Returns</h3>
            <p className="text-sm text-gray-600">From date of delivery</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Pickup</h3>
            <p className="text-sm text-gray-600">We collect from your address</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Refunds</h3>
            <p className="text-sm text-gray-600">Processed in 5-7 days</p>
          </Card>
        </div>

        {/* Return Policy */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Policy</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Eligibility</h3>
              <p className="text-gray-600 mb-3">
                You can return items within 30 days of delivery if they meet the following conditions:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Product is unused, unworn, and in original condition</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Original tags and labels are attached</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Product is in its original packaging with all accessories</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Jewelry items include original boxes and certificates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Product is not damaged or altered in any way</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Non-Returnable Items</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Pierced jewelry (earrings) - for hygiene reasons</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Personalized or customized items</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Items marked as "Final Sale" or "Non-Returnable"</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Gift cards and vouchers</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Products without original tags or packaging</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* How to Return */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return an Item</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Initiate Return</h3>
                <p className="text-gray-600 text-sm">
                  Log into your account, go to "My Orders", select the order, and click "Return Item".
                  Choose the item(s) you want to return and select a reason.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Schedule Pickup</h3>
                <p className="text-gray-600 text-sm">
                  Our logistics partner will contact you to schedule a free pickup from your address.
                  Package the item securely in its original box with all accessories.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Quality Check</h3>
                <p className="text-gray-600 text-sm">
                  Once we receive your return, our team will inspect the item to ensure it meets return
                  conditions. This process takes 2-3 business days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Receive Refund</h3>
                <p className="text-gray-600 text-sm">
                  After approval, your refund will be processed within 5-7 business days to your
                  original payment method. You'll receive an email confirmation.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Exchange Policy */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchange Policy</h2>

          <div className="space-y-4">
            <p className="text-gray-600">
              You can exchange items for a different size, color, or design within 30 days of delivery.
              Exchanges are subject to product availability.
            </p>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Exchange Process</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 ml-4">
                <li>Initiate an exchange request from your account</li>
                <li>Select the product variant you want to exchange for</li>
                <li>We'll arrange pickup of the original item</li>
                <li>Once received and verified, the new item will be shipped</li>
                <li>No additional shipping charges for exchanges</li>
              </ol>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Price Difference</h4>
                  <p className="text-sm text-blue-800">
                    If the exchanged item costs more, you'll need to pay the difference. If it costs
                    less, the difference will be refunded to your original payment method or as store
                    credit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Refund Policy */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Policy</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Refund Timeline</h3>
              <p className="text-gray-600 text-sm mb-3">
                Once your return is received and inspected, we will send you an email notification
                regarding the approval or rejection of your refund.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Quality inspection: 2-3 business days</li>
                <li>• Refund processing: 5-7 business days after approval</li>
                <li>• Bank credit: Additional 5-10 business days (varies by bank)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Refund Methods</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 font-semibold text-gray-900">Payment Method</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Refund Method</th>
                      <th className="py-3 px-4 font-semibold text-gray-900">Timeline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-4 text-gray-700">Credit/Debit Card</td>
                      <td className="py-3 px-4 text-gray-600">Original card</td>
                      <td className="py-3 px-4 text-gray-600">5-10 days</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-700">UPI/Net Banking</td>
                      <td className="py-3 px-4 text-gray-600">Original account</td>
                      <td className="py-3 px-4 text-gray-600">5-7 days</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-700">Wallet</td>
                      <td className="py-3 px-4 text-gray-600">Original wallet</td>
                      <td className="py-3 px-4 text-gray-600">3-5 days</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-700">Cash on Delivery</td>
                      <td className="py-3 px-4 text-gray-600">Bank transfer</td>
                      <td className="py-3 px-4 text-gray-600">7-10 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Shipping Charges</h4>
                  <p className="text-sm text-amber-800">
                    Original shipping charges are non-refundable. Only the product cost will be
                    refunded unless the return is due to our error or a defective product.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Damaged or Defective Items */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Damaged or Defective Items</h2>

          <div className="space-y-4">
            <p className="text-gray-600">
              We take great care in packaging, but if you receive a damaged or defective item:
            </p>

            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">1.</span>
                <span>
                  Contact us within 48 hours of delivery with photos of the damaged item and packaging
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">2.</span>
                <span>
                  We'll arrange immediate pickup and send a replacement at no extra cost
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">3.</span>
                <span>
                  If replacement is not available, we'll process a full refund including shipping charges
                </span>
              </li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800">
                    For damaged/defective items, do not use or alter the product. Keep all packaging
                    materials for inspection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Important Notes */}
        <Card className="p-8 bg-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Important Notes</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                Returns are free. We arrange pickup from your address at no additional cost.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                Sale and clearance items can be returned unless marked as "Final Sale".
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                Refunds do not include original shipping charges unless the return is due to our error.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                If your return is rejected due to not meeting return conditions, the item will be sent
                back to you.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                For COD orders, provide your bank account details for refund processing.
              </span>
            </li>
          </ul>
        </Card>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need help with a return or exchange?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Contact Support
            </button>
            <button
              onClick={() => window.location.href = 'mailto:returns@almira.com'}
              className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium border-2 border-gray-200 hover:border-amber-200 transition-colors"
            >
              Email returns@almira.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
