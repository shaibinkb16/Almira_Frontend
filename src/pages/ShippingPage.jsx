import { Package, Truck, Clock, MapPin, Shield, Gift } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shipping Information
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fast, reliable, and secure shipping across India. Learn about our shipping options,
            delivery times, and policies.
          </p>
        </div>

        {/* Shipping Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders above ₹2,999</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">3-5 days in metro cities</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Packaging</h3>
            <p className="text-sm text-gray-600">Safe & tamper-proof boxes</p>
          </Card>
        </div>

        {/* Shipping Options */}
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Package className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-900">Shipping Options</h2>
          </div>

          <div className="space-y-6">
            <div className="pb-6 border-b">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Standard Shipping</h3>
                  <p className="text-gray-600 text-sm">Our standard delivery option</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-amber-600">₹99</p>
                  <p className="text-sm text-gray-500">FREE over ₹2,999</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Delivery: 5-7 business days</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>Available across India</span>
                </li>
              </ul>
            </div>

            <div className="pb-6 border-b">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Express Shipping</h3>
                  <p className="text-gray-600 text-sm">Faster delivery for urgent orders</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-amber-600">₹199</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Delivery: 2-3 business days</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>Available in metro cities and major towns</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Same-Day Delivery</h3>
                  <p className="text-gray-600 text-sm">Ultra-fast delivery within the city</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-amber-600">₹299</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Delivery: Same day (order by 12 PM)</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>Available in Mumbai, Delhi, Bangalore (select areas)</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Delivery Timeline */}
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-900">Estimated Delivery Times</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 font-semibold text-gray-900">Location Type</th>
                  <th className="py-3 px-4 font-semibold text-gray-900">Standard</th>
                  <th className="py-3 px-4 font-semibold text-gray-900">Express</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 px-4 text-gray-700">Metro Cities</td>
                  <td className="py-3 px-4 text-gray-600">3-5 days</td>
                  <td className="py-3 px-4 text-gray-600">2-3 days</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Tier 1 Cities</td>
                  <td className="py-3 px-4 text-gray-600">4-6 days</td>
                  <td className="py-3 px-4 text-gray-600">3-4 days</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Tier 2 Cities</td>
                  <td className="py-3 px-4 text-gray-600">5-7 days</td>
                  <td className="py-3 px-4 text-gray-600">Not Available</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">Remote Areas</td>
                  <td className="py-3 px-4 text-gray-600">7-10 days</td>
                  <td className="py-3 px-4 text-gray-600">Not Available</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            * Delivery times are estimates and may vary due to external factors like weather,
            festivals, or courier delays. You will receive tracking information to monitor your order.
          </p>
        </Card>

        {/* Order Processing */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Processing & Tracking</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
              <p className="text-gray-600 text-sm">
                Orders are typically processed within 1-2 business days. You will receive an order
                confirmation email immediately after placing your order. Once shipped, you'll get a
                tracking number via email and SMS.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Tracking</h3>
              <p className="text-gray-600 text-sm mb-3">
                Track your order in real-time using:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Account Dashboard - View all your orders and their status</li>
                <li>Tracking Link - Sent via email and SMS</li>
                <li>Order Number - Track using your order confirmation number</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Attempt</h3>
              <p className="text-gray-600 text-sm">
                Our courier partner will make 3 delivery attempts. If delivery is unsuccessful, the
                package will be held at the local courier facility for 7 days. You can reschedule
                delivery or arrange for pickup from the facility.
              </p>
            </div>
          </div>
        </Card>

        {/* Packaging */}
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-900">Packaging & Gift Wrapping</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Packaging</h3>
              <p className="text-gray-600 text-sm">
                All jewelry items are packed in premium boxes with protective cushioning. Each
                package is sealed with tamper-proof tape to ensure your order arrives safely and
                securely.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Gift Wrapping</h3>
              <p className="text-gray-600 text-sm mb-2">
                We offer complimentary gift wrapping for all orders. Select the gift wrap option
                during checkout and add a personalized message.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Standard Gift Wrap - FREE</li>
                <li>Premium Gift Box - ₹199 (includes designer box and gift card)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* International Shipping */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">International Shipping</h2>
          <p className="text-gray-600 mb-4">
            We currently ship only within India. We are working on expanding our services to
            international destinations.
          </p>
          <p className="text-sm text-gray-500">
            Subscribe to our newsletter to be notified when international shipping becomes available.
          </p>
        </Card>

        {/* Important Notes */}
        <Card className="p-8 bg-amber-50 border-amber-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Important Notes</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                Shipping charges are calculated at checkout based on your delivery location and chosen
                shipping method.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                Free shipping applies only to standard shipping. Express and same-day delivery have
                additional charges.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                Delivery times may be extended during sale periods, festivals, or due to unforeseen
                circumstances.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                A valid phone number and complete address are required for successful delivery.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                COD orders may require signature and ID proof verification at the time of delivery.
              </span>
            </li>
          </ul>
        </Card>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Have questions about shipping?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() => window.location.href = '/faqs'}
              className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium border-2 border-gray-200 hover:border-amber-200 transition-colors"
            >
              View FAQs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
