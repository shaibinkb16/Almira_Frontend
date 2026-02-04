import { useRef, useEffect, useState } from 'react';
import { motion, useAnimationControls, useInView } from 'framer-motion';
import { Truck, Shield, RefreshCw, Headphones, Award, Heart, Gem, Clock } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: Truck,
    title: 'Free Shipping',
    description: 'Complimentary delivery on orders above ₹2,999',
    image: 'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 2,
    icon: Shield,
    title: 'Secure Payment',
    description: '100% encrypted & secure transactions',
    image: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 3,
    icon: Gem,
    title: 'Certified Quality',
    description: 'Hallmarked & certified jewelry',
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 4,
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '7-day hassle-free return policy',
    image: 'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 5,
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round the clock customer assistance',
    image: 'https://images.pexels.com/photos/7709219/pexels-photo-7709219.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-rose-500 to-red-600',
  },
  {
    id: 6,
    icon: Award,
    title: 'Best Prices',
    description: 'Competitive pricing guaranteed',
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-cyan-500 to-blue-600',
  },
];

// Feature Card Component
function FeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <motion.div
      className="relative flex-shrink-0 w-[280px] md:w-[320px] h-[400px] md:h-[450px] rounded-3xl overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${feature.gradient} opacity-60 mix-blend-multiply`} />

      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Floating Icon */}
      <motion.div
        className="absolute top-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
        animate={{
          y: isHovered ? -5 : 0,
          rotate: isHovered ? 5 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="h-7 w-7 text-white" />
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/10 blur-3xl"
        animate={{
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.3 : 0.1,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          viewport={{ once: true }}
        >
          {/* Number Badge */}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-bold mb-4">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Title */}
          <motion.h3
            className="font-display text-2xl md:text-3xl font-bold text-white mb-2"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {feature.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-white/80 text-sm md:text-base leading-relaxed"
            animate={{
              opacity: isHovered ? 1 : 0.8,
              y: isHovered ? -2 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {feature.description}
          </motion.p>

          {/* Animated Line */}
          <motion.div
            className={`h-1 rounded-full bg-gradient-to-r ${feature.gradient} mt-4`}
            initial={{ width: '30%' }}
            animate={{ width: isHovered ? '100%' : '30%' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </motion.div>
      </div>

      {/* Shine Effect on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: '-200%' }}
        animate={{ x: isHovered ? '200%' : '-200%' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

// Main WhyChooseUs Component
export function WhyChooseUs() {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const checkScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-sm font-semibold tracking-luxury uppercase mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Gem className="h-4 w-4" />
            Why Choose Almira
          </motion.span>

          <motion.h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Almira</span> Experience
          </motion.h2>

          <motion.p
            className="font-accent text-gray-600 text-xl md:text-2xl max-w-2xl mx-auto italic"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Discover why thousands of customers trust us for their jewelry and fashion needs
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scroll Buttons */}
          <motion.button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 ${
              canScrollLeft ? 'opacity-100 hover:scale-110 hover:bg-amber-50' : 'opacity-0 pointer-events-none'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 ${
              canScrollRight ? 'opacity-100 hover:scale-110 hover:bg-amber-50' : 'opacity-0 pointer-events-none'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-[5] pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-[5] pointer-events-none" />

          {/* Scrollable Cards */}
          <div
            ref={containerRef}
            className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide px-8 md:px-12 py-4 -mx-4 md:-mx-8"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {features.map((feature, index) => (
              <div key={feature.id} style={{ scrollSnapAlign: 'start' }}>
                <FeatureCard feature={feature} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {[
            { value: '50K+', label: 'Happy Customers' },
            { value: '10K+', label: 'Products' },
            { value: '500+', label: 'Cities' },
            { value: '99%', label: 'Satisfaction' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100"
              whileHover={{ y: -5, boxShadow: '0 20px 40px -20px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="font-display text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 mb-1">
                {stat.value}
              </div>
              <div className="font-accent text-gray-600 text-sm md:text-base italic">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
