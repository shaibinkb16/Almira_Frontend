import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUIStore } from '@/stores/uiStore';
import { emailMarketingService } from '@/services/api/emailMarketingService';

/**
 * Exit-Intent Email Capture Popup
 * Shows when user is about to leave the site
 */
export function EmailCapturePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const { showSuccess, showError } = useUIStore();

  useEffect(() => {
    // Check if popup was already dismissed
    const dismissed = localStorage.getItem('emailPopupDismissed');
    const subscribed = localStorage.getItem('emailSubscribed');

    if (dismissed || subscribed || hasShown) return;

    // Exit intent detection
    const handleMouseLeave = (e) => {
      // Trigger when mouse leaves viewport from top
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    // Also show after 30 seconds if not shown yet
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('emailPopupDismissed', Date.now().toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const result = await emailMarketingService.subscribe(email, 'exit_popup');

      if (result.success) {
        showSuccess('Welcome! Check your email for your 10% discount code');
        localStorage.setItem('emailSubscribed', 'true');
        setIsOpen(false);
      } else {
        showError(result.error || 'Failed to subscribe');
      }
    } catch (error) {
      showError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-20">
                  <Sparkles className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <Gift className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Wait! Don't Miss Out</h2>
                  <p className="text-amber-50">
                    Get <span className="font-bold text-white">10% OFF</span> your first order
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-gray-600 mb-6">
                  Join our exclusive community and receive:
                </p>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">
                      10% discount code instantly
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">
                      Early access to new collections
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">
                      Exclusive deals & jewelry care tips
                    </span>
                  </li>
                </ul>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    leftIcon={<Mail className="h-4 w-4" />}
                    className="w-full"
                    required
                  />

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full"
                    size="lg"
                  >
                    Get My 10% Discount
                  </Button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Inline Newsletter Signup (for homepage, etc.)
 */
export function NewsletterSignup({ variant = 'default', className }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useUIStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const result = await emailMarketingService.subscribe(email, 'inline_form');

      if (result.success) {
        showSuccess('Thank you for subscribing!');
        setEmail('');
      } else {
        showError(result.error || 'Failed to subscribe');
      }
    } catch (error) {
      showError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={className}>
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="flex-1"
            required
          />
          <Button type="submit" loading={loading}>
            Subscribe
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Join Our Newsletter
      </h3>
      <p className="text-gray-600 mb-4">
        Get exclusive offers and jewelry care tips delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          leftIcon={<Mail className="h-4 w-4" />}
          className="flex-1"
          required
        />
        <Button type="submit" loading={loading}>
          Subscribe
        </Button>
      </form>
    </div>
  );
}

export default EmailCapturePopup;
