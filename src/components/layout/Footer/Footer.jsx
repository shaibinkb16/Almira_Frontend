import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { APP_NAME } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SecurityBadges, PaymentMethods } from '@/components/ui/TrustBadges';

const footerLinks = {
  shop: {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', href: '/products?filter=new' },
      { label: 'Jewelry', href: '/categories/jewelry' },
      { label: 'Fashion', href: '/categories/fashion' },
      { label: 'Accessories', href: '/categories/accessories' },
      { label: 'Sale', href: '/products?filter=sale' },
    ],
  },
  help: {
    title: 'Help',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns & Exchanges', href: '/returns' },
      { label: 'Size Guide', href: '/size-guide' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Store Locator', href: '/stores' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
              Stay in the Loop
            </h3>
            <p className="font-accent text-gray-400 text-lg italic mb-6">
              Subscribe to our newsletter for exclusive offers, new arrivals, and
              style inspiration.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500"
                required
              />
              <Button type="submit" className="sm:w-auto">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link
              to={ROUTES.HOME}
              className="font-display text-2xl font-black italic text-amber-500 tracking-wider inline-block mb-4"
            >
              {APP_NAME}
            </Link>
            <p className="font-accent text-gray-400 mb-6 max-w-xs italic">
              Discover the finest collection of jewelry and fashion. Quality
              craftsmanship meets timeless elegance.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </a>
              <a
                href="mailto:support@almira.com"
                className="flex items-center gap-3 text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>support@almira.com</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>123 Fashion Street, Mumbai, Maharashtra 400001</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-display font-semibold text-white mb-4 tracking-wide">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-amber-500 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Security Badges Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <SecurityBadges className="text-gray-400" />
          </div>

          {/* Payment Methods */}
          <div className="mb-8">
            <PaymentMethods variant="default" className="text-gray-400" />
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>

          {/* Trust Statement */}
          <p className="text-gray-500 text-sm text-center">
            🔒 Safe & Secure Shopping
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
