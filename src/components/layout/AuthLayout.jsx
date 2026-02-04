import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { APP_NAME } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import { ToastContainer } from '@/components/ui/Toast';

function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-16 xl:px-20 bg-gradient-to-br from-white via-amber-50/30 to-white">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="font-display text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 tracking-wide inline-block mb-12 hover:scale-105 transition-transform duration-300"
          >
            {APP_NAME}
          </Link>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>

          {/* Footer Text */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-amber-600 hover:text-amber-700 font-medium">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-amber-600 hover:text-amber-700 font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image Showcase (hidden on mobile) */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-gradient-to-br from-amber-100 to-amber-50">
        {/* Main Image */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full w-full object-cover"
            src="https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Luxury jewelry"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold border border-white/20">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Premium Collection</span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-4xl xl:text-5xl font-bold leading-tight">
              Discover Timeless
              <br />
              <span className="text-amber-300">Elegance</span>
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-200 max-w-md leading-relaxed">
              Explore our curated collection of exquisite jewelry and fashion pieces,
              handcrafted with precision and passion for those who appreciate luxury.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-amber-300">5000+</p>
                <p className="text-sm text-gray-300">Happy Customers</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold text-amber-300">1000+</p>
                <p className="text-sm text-gray-300">Premium Products</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold text-amber-300">4.9★</p>
                <p className="text-sm text-gray-300">Average Rating</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default AuthLayout;
