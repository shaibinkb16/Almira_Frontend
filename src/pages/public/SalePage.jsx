import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Percent, Tag, Clock, Zap, Gift } from 'lucide-react';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
  AnimatedProductCard,
  ParallaxSection,
  TextMarquee,
} from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useSaleProducts } from '@/hooks/useProducts';

// Sample sale products (keeping as fallback in mock data - now loaded via hook)
const saleProductsMock = [
  {
    id: 1,
    name: 'Kundan Necklace Set',
    slug: 'kundan-necklace-set',
    basePrice: 15999,
    salePrice: 11999,
    images: [
      { url: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 4.8,
    reviewCount: 124,
    discount: 25,
  },
  {
    id: 2,
    name: 'Designer Silk Saree',
    slug: 'designer-silk-saree',
    basePrice: 24999,
    salePrice: 17999,
    images: [
      { url: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 4.9,
    reviewCount: 256,
    discount: 28,
  },
  {
    id: 3,
    name: 'Diamond Studs',
    slug: 'diamond-studs',
    basePrice: 8999,
    salePrice: 5999,
    images: [
      { url: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 4.7,
    reviewCount: 98,
    discount: 33,
  },
  {
    id: 4,
    name: 'Silver Bangles Set',
    slug: 'silver-bangles-set',
    basePrice: 6999,
    salePrice: 4499,
    images: [
      { url: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 4.6,
    reviewCount: 145,
    discount: 36,
  },
  {
    id: 5,
    name: 'Gold Chain',
    slug: 'gold-chain',
    basePrice: 18999,
    salePrice: 13999,
    images: [
      { url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 4.5,
    reviewCount: 87,
    discount: 26,
  },
  {
    id: 6,
    name: 'Pearl Drop Earrings',
    slug: 'pearl-drop-earrings',
    basePrice: 3499,
    salePrice: 2299,
    images: [
      { url: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 4.4,
    reviewCount: 67,
    discount: 34,
  },
  {
    id: 7,
    name: 'Ethnic Maang Tikka',
    slug: 'ethnic-maang-tikka',
    basePrice: 7999,
    salePrice: 4999,
    images: [
      { url: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 4.8,
    reviewCount: 112,
    discount: 38,
  },
  {
    id: 8,
    name: 'Gemstone Bracelet',
    slug: 'gemstone-bracelet',
    basePrice: 12999,
    salePrice: 8999,
    images: [
      { url: 'https://images.pexels.com/photos/1030946/pexels-photo-1030946.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    rating: 4.7,
    reviewCount: 94,
    discount: 31,
  },
];

// Sale categories (counts will be calculated dynamically)
const getSaleCategories = (products) => [
  { label: 'All Sale Items', value: 'all', count: products.length },
  { label: 'Up to 25% Off', value: '25', count: products.filter(p => {
    const discount = p.salePrice ? Math.round(((p.basePrice - p.salePrice) / p.basePrice) * 100) : 0;
    return discount >= 25;
  }).length },
  { label: 'Up to 35% Off', value: '35', count: products.filter(p => {
    const discount = p.salePrice ? Math.round(((p.basePrice - p.salePrice) / p.basePrice) * 100) : 0;
    return discount >= 35;
  }).length },
  { label: 'Up to 40% Off', value: '40', count: products.filter(p => {
    const discount = p.salePrice ? Math.round(((p.basePrice - p.salePrice) / p.basePrice) * 100) : 0;
    return discount >= 40;
  }).length },
];

// Benefits
const benefits = [
  {
    icon: Percent,
    title: 'Up to 40% Off',
    description: 'Massive discounts on selected items',
  },
  {
    icon: Gift,
    title: 'Free Shipping',
    description: 'On all orders above ₹5,000',
  },
  {
    icon: Clock,
    title: 'Limited Time',
    description: 'Sale ends in 7 days',
  },
  {
    icon: Zap,
    title: 'Flash Deals',
    description: 'New deals every hour',
  },
];

function SalePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch sale products from API with fallback to mock data
  const { products: saleProducts, loading } = useSaleProducts(12);

  const saleCategories = getSaleCategories(saleProducts);

  const filteredProducts = selectedCategory === 'all'
    ? saleProducts
    : saleProducts.filter(p => {
        const discount = p.salePrice ? Math.round(((p.basePrice - p.salePrice) / p.basePrice) * 100) : 0;
        return discount >= parseInt(selectedCategory);
      });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <ParallaxSection
        backgroundImage="https://images.pexels.com/photos/1030946/pexels-photo-1030946.jpeg?auto=compress&cs=tinysrgb&w=1920"
        className="h-[500px] md:h-[600px]"
      >
        <div className="h-full flex items-center justify-center">
          <div className="container mx-auto px-4">
            <FadeInOnScroll direction="up">
              <div className="max-w-2xl text-white text-center mx-auto space-y-6">
                {/* Badge */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-red-600 rounded-full text-sm font-bold shadow-2xl animate-pulse">
                    <Tag className="h-4 w-4" />
                    <span>MEGA SALE LIVE</span>
                  </div>
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight">
                    SALE
                  </h1>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-1 bg-yellow-400 rounded-full" />
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300">
                      Up to 40% OFF
                    </p>
                    <div className="w-12 h-1 bg-yellow-400 rounded-full" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-100 max-w-lg mx-auto leading-relaxed">
                  Limited time offer on jewelry & fashion. Shop now before it's too late!
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-yellow-400 text-gray-900 hover:bg-yellow-300 text-base px-10 py-5 rounded-xl font-bold shadow-2xl hover:scale-105 transition-all"
                  >
                    Shop Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-white border-2 border-white hover:bg-white/10 text-base px-10 py-5 rounded-xl font-bold hover:scale-105 transition-all"
                  >
                    View Flash Deals
                  </Button>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </ParallaxSection>

      {/* Marquee */}
      <div className="py-10 bg-red-600 text-white overflow-hidden">
        <TextMarquee baseVelocity={-4} className="text-white/90">
          🔥 MEGA SALE • UP TO 40% OFF • LIMITED STOCK • SHOP NOW • 🔥
        </TextMarquee>
      </div>

      {/* Countdown Timer */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white text-center">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6" />
              <span className="text-xl font-semibold">Sale Ends In:</span>
            </div>
            <div className="flex items-center gap-4">
              {[
                { value: '06', label: 'Days' },
                { value: '14', label: 'Hours' },
                { value: '32', label: 'Minutes' },
                { value: '45', label: 'Seconds' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px]">
                    <span className="text-3xl font-bold">{item.value}</span>
                  </div>
                  <span className="text-sm mt-1">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <StaggerItem key={index}>
                <motion.div
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 text-red-600 rounded-xl mb-4">
                    <benefit.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {saleCategories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="lg"
                onClick={() => setSelectedCategory(category.value)}
                className={cn(
                  'rounded-full font-semibold',
                  selectedCategory === category.value && 'bg-red-600 hover:bg-red-700'
                )}
              >
                {category.label}
                <Badge className="ml-2">{category.count}</Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Hot Deals
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Showing {filteredProducts.length} products with amazing discounts
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerChildren staggerDelay={0.05}>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <StaggerItem key={product.id}>
                    <AnimatedProductCard product={product} index={index} />
                  </StaggerItem>
                ))}
              </div>
            )}
          </StaggerChildren>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-red-600 text-red-600 hover:bg-red-50"
            >
              Load More Deals
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="max-w-lg mx-auto text-center text-white space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <Zap className="h-10 w-10" />
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-black">
                  Don't Miss Out!
                </h2>
                <div className="w-16 h-1 bg-white/80 mx-auto rounded-full" />
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                These prices won't last forever. Shop now and save big on your favorite items.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/categories/jewelry"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-base hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl"
                >
                  Shop Jewelry Sale
                </Link>
                <Link
                  to="/categories/fashion"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold text-base hover:bg-white/20 transition-all hover:scale-105 shadow-2xl"
                >
                  Shop Fashion Sale
                </Link>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
}

export default SalePage;
