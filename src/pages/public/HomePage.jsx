import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  HeroCarousel,
  BrandMarquee,
  TextMarquee,
  CategoryBento,
  FadeInOnScroll,
  StaggerChildren,
  StaggerItem,
  ParallaxSection,
  AnimatedProductCard,
  WhyChooseUs,
} from '@/components/ui';
import { ROUTES } from '@/config/routes';
import { useFeaturedProducts, useNewArrivals } from '@/hooks/useProducts';

// Hero carousel slides - Using Pexels for reliable images
const heroSlides = [
  {
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Timeless Elegance',
    subtitle: 'Discover our exquisite jewelry collection crafted with precision and love',
    badge: 'New Collection',
    cta: 'Shop Jewelry',
    link: '/categories/jewelry',
    secondaryCta: 'View Lookbook',
    secondaryLink: '/lookbook',
  },
  {
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Fashion Forward',
    subtitle: 'Trending styles curated for the modern Indian woman',
    badge: 'Trending Now',
    cta: 'Shop Fashion',
    link: '/categories/fashion',
    secondaryCta: 'Explore Trends',
    secondaryLink: '/trends',
  },
  {
    image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Wedding Season',
    subtitle: 'Make your special day unforgettable with our bridal collection',
    badge: 'Bridal Special',
    cta: 'Shop Bridal',
    link: '/categories/wedding',
    secondaryCta: 'Book Consultation',
    secondaryLink: '/consultation',
  },
];

// Categories for bento grid
const categories = [
  {
    id: 1,
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Elegant designs for every occasion',
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/categories/necklaces',
  },
  {
    id: 2,
    name: 'Earrings',
    slug: 'earrings',
    description: 'Statement pieces to complete your look',
    image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/categories/earrings',
  },
  {
    id: 3,
    name: 'Rings',
    slug: 'rings',
    description: 'From everyday wear to engagement',
    image: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/categories/rings',
  },
  {
    id: 4,
    name: 'Ethnic Wear',
    slug: 'ethnic-wear',
    description: 'Traditional elegance redefined',
    image: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/categories/ethnic-wear',
  },
  {
    id: 5,
    name: 'Western Wear',
    slug: 'western-wear',
    description: 'Contemporary fashion essentials',
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=600',
    href: '/categories/western-wear',
  },
];

// Brand partners
const brands = [
  'Tanishq',
  'Kalyan Jewellers',
  'Malabar Gold',
  'PC Jeweller',
  'Senco Gold',
  'Joyalukkas',
  'CaratLane',
  'BlueStone',
];

// Sample products (keeping as fallback in mock data - now loaded via hooks)

// Instagram images
const instagramImages = [
  'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=400',
];

// Testimonial images
const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'Absolutely loved my Kundan necklace! The quality is exceptional and delivery was super fast. Will definitely shop again.',
    rating: 5,
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Anjali Patel',
    location: 'Delhi',
    text: 'The bridal collection is stunning. Found the perfect set for my wedding. Customer service was very helpful too!',
    rating: 5,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Meera Reddy',
    location: 'Bangalore',
    text: 'Great selection of ethnic wear and jewelry. The prices are reasonable and the quality exceeds expectations.',
    rating: 5,
    image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

function HomePage() {
  // Fetch products from API with fallback to mock data
  const { products: featuredProducts, loading: featuredLoading } = useFeaturedProducts(8);
  const { products: newArrivals, loading: newArrivalsLoading } = useNewArrivals(8);

  return (
    <div className="overflow-hidden">
      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} autoPlay interval={6000} />

      {/* Brand Marquee */}
      <div className="py-8 bg-gray-50 border-y border-gray-100">
        <BrandMarquee brands={brands} speed={25} pauseOnHover />
      </div>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Categories Bento */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
                  Explore
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Shop by Category
                </h2>
                <p className="text-gray-600 mt-2 max-w-xl">
                  Discover curated collections of fine jewelry and fashion pieces for every occasion
                </p>
              </div>
              <Link
                to={ROUTES.CATEGORIES}
                className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 mt-4 md:mt-0 group"
              >
                View All Categories
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInOnScroll>
          <CategoryBento categories={categories} />
        </div>
      </section>

      {/* Text Marquee */}
      <div className="py-12 bg-gray-900 text-white overflow-hidden relative">
        <TextMarquee baseVelocity={-2} className="text-gray-700">
          ALMIRA • FASHION & JEWELRY • ELEGANCE REDEFINED •
        </TextMarquee>
      </div>

      {/* New Arrivals */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                  Just Dropped
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  New Arrivals
                </h2>
                <p className="text-gray-600 mt-2">
                  Fresh styles added every week
                </p>
              </div>
              <Link
                to="/products?filter=new"
                className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 mt-4 md:mt-0 group"
              >
                View All New
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInOnScroll>

          <StaggerChildren staggerDelay={0.1}>
            {newArrivalsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {newArrivals.map((product, index) => (
                  <StaggerItem key={product.id}>
                    <AnimatedProductCard product={product} index={index} />
                  </StaggerItem>
                ))}
              </div>
            )}
          </StaggerChildren>
        </div>
      </section>

      {/* Parallax Banner */}
      <ParallaxSection
        backgroundImage="https://images.pexels.com/photos/1030946/pexels-photo-1030946.jpeg?auto=compress&cs=tinysrgb&w=1920"
        className="h-[500px] md:h-[600px]"
      >
        <div className="h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl text-white">
              <FadeInOnScroll direction="up">
                <span className="inline-block px-4 py-1.5 bg-amber-500 text-white text-sm font-semibold rounded-full mb-6">
                  Limited Time Offer
                </span>
              </FadeInOnScroll>
              <FadeInOnScroll direction="up" delay={0.1}>
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                  Wedding Season Sale
                </h2>
              </FadeInOnScroll>
              <FadeInOnScroll direction="up" delay={0.2}>
                <p className="text-lg text-gray-200 mb-8">
                  Up to 40% off on bridal jewelry and ethnic wear. Make your special day even more memorable.
                </p>
              </FadeInOnScroll>
              <FadeInOnScroll direction="up" delay={0.3}>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link to="/categories/wedding">Shop Now</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white/10"
                    asChild
                  >
                    <Link to="/lookbook/bridal">View Lookbook</Link>
                  </Button>
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-100 text-rose-700 rounded-full text-sm font-medium mb-4">
                  <Star className="h-4 w-4 fill-rose-500" />
                  Best Sellers
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Featured Products
                </h2>
                <p className="text-gray-600 mt-2">
                  Handpicked favorites loved by our customers
                </p>
              </div>
              <Link
                to={ROUTES.PRODUCTS}
                className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 mt-4 md:mt-0 group"
              >
                View All Products
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInOnScroll>

          <StaggerChildren staggerDelay={0.1}>
            {featuredLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product, index) => (
                  <StaggerItem key={`featured-${product.id}`}>
                    <AnimatedProductCard product={product} index={index} />
                  </StaggerItem>
                ))}
              </div>
            )}
          </StaggerChildren>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
            </div>
          </FadeInOnScroll>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={index}>
                <motion.div
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">{testimonial.text}</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Follow Us on Instagram
              </h2>
              <p className="text-gray-600">@almira.official</p>
            </div>
          </FadeInOnScroll>

          <StaggerChildren className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
            {instagramImages.map((image, index) => (
              <StaggerItem key={index}>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-square rounded-xl overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={image}
                    alt={`Instagram post ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.a>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <FadeInOnScroll>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay in the Loop
              </h2>
              <p className="text-gray-400 mb-8">
                Subscribe to get exclusive offers, new arrivals, and style tips delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button type="submit" size="lg">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
