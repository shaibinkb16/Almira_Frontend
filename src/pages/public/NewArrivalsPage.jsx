import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';
import {
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
  AnimatedProductCard,
  ParallaxSection,
  TextMarquee,
} from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useNewArrivals } from '@/hooks/useProducts';

// Sample new arrival products (keeping as fallback in mock data - now loaded via hook)
const newProductsMock = [
  {
    id: 1,
    name: 'Polki Diamond Choker',
    slug: 'polki-diamond-choker',
    basePrice: 89999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isNewArrival: true,
    rating: 5.0,
    reviewCount: 12,
    addedDate: '2026-02-01',
  },
  {
    id: 2,
    name: 'Emerald Pendant Set',
    slug: 'emerald-pendant-set',
    basePrice: 45999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/1030946/pexels-photo-1030946.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 8,
    addedDate: '2026-02-01',
  },
  {
    id: 3,
    name: 'Contemporary Gold Bangles',
    slug: 'contemporary-gold-bangles',
    basePrice: 32999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 15,
    addedDate: '2026-01-30',
  },
  {
    id: 4,
    name: 'Ruby Studded Earrings',
    slug: 'ruby-studded-earrings',
    basePrice: 28999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 10,
    addedDate: '2026-01-28',
  },
  {
    id: 5,
    name: 'Pearl Layered Necklace',
    slug: 'pearl-layered-necklace',
    basePrice: 18999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isNewArrival: true,
    rating: 4.6,
    reviewCount: 18,
    addedDate: '2026-01-28',
  },
  {
    id: 6,
    name: 'Antique Silver Anklets',
    slug: 'antique-silver-anklets',
    basePrice: 8999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isNewArrival: true,
    rating: 4.5,
    reviewCount: 22,
    addedDate: '2026-01-25',
  },
  {
    id: 7,
    name: 'Designer Cocktail Ring',
    slug: 'designer-cocktail-ring',
    basePrice: 22999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 7,
    addedDate: '2026-01-25',
  },
  {
    id: 8,
    name: 'Floral Diamond Studs',
    slug: 'floral-diamond-studs',
    basePrice: 12999,
    salePrice: null,
    images: [
      { url: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600' },
    ],
    status: 'active',
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 14,
    addedDate: '2026-01-22',
  },
];

// Collection highlights
const highlights = [
  {
    icon: Sparkles,
    title: 'Freshly Curated',
    description: 'New designs added every week',
  },
  {
    icon: TrendingUp,
    title: 'Trending Now',
    description: 'Most popular in the last 30 days',
  },
  {
    icon: Clock,
    title: 'Limited Availability',
    description: 'Get them before they\'re gone',
  },
];

function NewArrivalsPage() {
  // Fetch new arrivals from API with fallback to mock data
  const { products: newProducts, loading } = useNewArrivals(12);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <ParallaxSection
        backgroundImage="https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1920"
        className="h-[450px] md:h-[550px]"
      >
        <div className="h-full flex items-center justify-center">
          <div className="container mx-auto px-4">
            <FadeInOnScroll direction="up">
              <div className="max-w-2xl text-white text-center mx-auto space-y-6">
                {/* Badge */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/90 backdrop-blur-sm rounded-full text-sm font-semibold shadow-lg">
                    <Sparkles className="h-4 w-4" />
                    <span>Just Dropped</span>
                  </div>
                </div>

                {/* Heading */}
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                    New Arrivals
                  </h1>
                  <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full" />
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-200 max-w-xl mx-auto leading-relaxed">
                  Discover the latest additions to our collection. Fresh designs and exclusive pieces.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    to="/categories/jewelry"
                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105 text-base shadow-xl"
                  >
                    Shop Jewelry
                  </Link>
                  <Link
                    to="/categories/fashion"
                    className="w-full sm:w-auto px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-semibold hover:bg-white/20 transition-all hover:scale-105 text-base"
                  >
                    Shop Fashion
                  </Link>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </ParallaxSection>

      {/* Marquee */}
      <div className="py-12 bg-amber-600 text-white overflow-hidden">
        <TextMarquee baseVelocity={3} className="text-white/90">
          NEW ARRIVALS • FRESH STYLES • TRENDING NOW • LIMITED STOCK •
        </TextMarquee>
      </div>

      {/* Highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <StaggerItem key={index}>
                <motion.div
                  className="text-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl mb-4">
                    <highlight.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600">{highlight.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Latest Additions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {newProducts.length} stunning new pieces added this month
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
                {newProducts.map((product, index) => (
                  <StaggerItem key={product.id}>
                    <AnimatedProductCard product={product} index={index} />
                  </StaggerItem>
                ))}
              </div>
            )}
          </StaggerChildren>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More Products
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="max-w-lg mx-auto text-center text-white space-y-6">
              {/* Heading */}
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Don't Miss Out
                </h2>
                <div className="w-16 h-1 bg-white/80 mx-auto rounded-full" />
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                Get notified when we add new products. Be the first to shop the latest collections.
              </p>

              {/* Form */}
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-base shadow-lg"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-white text-amber-600 hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
                >
                  Subscribe
                </Button>
              </form>

              {/* Privacy Note */}
              <p className="text-xs text-white/70">
                By subscribing, you agree to our Privacy Policy
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
}

export default NewArrivalsPage;
