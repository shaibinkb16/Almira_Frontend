import { Heart, Award, Users, Sparkles, Shield, Leaf } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { APP_NAME } from '@/config/constants';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About {APP_NAME}</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Crafting timeless elegance and empowering women through exquisite jewelry since 2018
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-12">
        {/* Our Story */}
        <Card className="p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Founded in 2018, {APP_NAME} began with a simple vision: to make beautiful, high-quality
              jewelry accessible to every woman. What started as a small boutique in Mumbai has grown
              into one of India's most trusted online jewelry destinations.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              We believe that jewelry is more than just an accessory—it's a form of self-expression,
              a celebration of milestones, and a connection to cherished memories. Every piece in our
              collection is carefully curated or crafted to embody elegance, quality, and timeless style.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Today, we serve thousands of customers across India, offering an extensive collection of
              jewelry ranging from traditional ethnic designs to contemporary fashion pieces. Our
              commitment to authenticity, quality, and customer satisfaction remains unwavering.
            </p>
          </div>
        </Card>

        {/* Our Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We source only the finest materials and work with skilled artisans to ensure every
                piece meets our rigorous quality standards.
              </p>
            </Card>

            <Card className="p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authenticity</h3>
              <p className="text-gray-600">
                Every piece comes with a certificate of authenticity. We guarantee 100% genuine
                products with transparent pricing and hallmarking.
              </p>
            </Card>

            <Card className="p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Delight</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. From browsing to delivery and beyond, we strive
                to provide an exceptional experience at every touchpoint.
              </p>
            </Card>

            <Card className="p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Craftsmanship</h3>
              <p className="text-gray-600">
                We celebrate traditional jewelry-making techniques while embracing modern design
                innovations to create pieces that are both timeless and contemporary.
              </p>
            </Card>

            <Card className="p-6">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We support local artisans and craftspeople, providing fair wages and helping
                preserve traditional jewelry-making arts for future generations.
              </p>
            </Card>

            <Card className="p-6">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Leaf className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to ethical sourcing and sustainable practices, minimizing our
                environmental impact while creating beautiful jewelry.
              </p>
            </Card>
          </div>
        </div>

        {/* Our Promise */}
        <Card className="p-8 md:p-12 mb-12 bg-gradient-to-br from-amber-50 to-orange-50">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Promise to You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-amber-600 font-bold text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">100% Authentic Products</h3>
                <p className="text-gray-600 text-sm">
                  Every piece is genuine and comes with certificates of authenticity and hallmarking.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-amber-600 font-bold text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Shopping</h3>
                <p className="text-gray-600 text-sm">
                  256-bit SSL encryption and PCI DSS compliance for safe, secure transactions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-amber-600 font-bold text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">30-Day Returns</h3>
                <p className="text-gray-600 text-sm">
                  Hassle-free returns and exchanges with free pickup from your doorstep.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-amber-600 font-bold text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
                <p className="text-gray-600 text-sm">
                  Our knowledgeable team is here to help you find the perfect piece.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-amber-600 font-bold text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
                <p className="text-gray-600 text-sm">
                  Enjoy free delivery on orders over ₹2,999 with secure, insured packaging.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-amber-600 font-bold text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Lifetime Support</h3>
                <p className="text-gray-600 text-sm">
                  Free cleaning, polishing, and maintenance services for life on select items.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* By the Numbers */}
        <Card className="p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{APP_NAME} by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">50K+</div>
              <p className="text-gray-600 font-medium">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">5000+</div>
              <p className="text-gray-600 font-medium">Unique Designs</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">4.8★</div>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">100%</div>
              <p className="text-gray-600 font-medium">Certified Genuine</p>
            </div>
          </div>
        </Card>

        {/* Our Team */}
        <Card className="p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Team</h2>
          <p className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
            Behind {APP_NAME} is a passionate team of jewelry experts, designers, artisans, and
            customer service professionals dedicated to bringing you the best shopping experience.
            From our design studio to our quality control team, everyone shares the same commitment
            to excellence and customer satisfaction.
          </p>
        </Card>

        {/* Join Us Section */}
        <Card className="p-8 md:p-12 bg-gray-900 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join the {APP_NAME} Family</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Become part of our growing community. Sign up for exclusive offers, early access to new
            collections, and style tips delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Shop Now
            </button>
            <button
              onClick={() => window.location.href = '/careers'}
              className="px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Join Our Team
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
