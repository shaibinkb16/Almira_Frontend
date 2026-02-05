import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/routes';
import { APP_NAME } from '@/config/constants';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

const navLinks = [
  { label: 'Home', href: ROUTES.HOME },
  {
    label: 'Jewelry',
    href: '/categories/jewelry',
    children: [
      { label: 'Necklaces', href: '/categories/necklaces' },
      { label: 'Earrings', href: '/categories/earrings' },
      { label: 'Rings', href: '/categories/rings' },
      { label: 'Bracelets', href: '/categories/bracelets' },
      { label: 'Bangles', href: '/categories/bangles' },
      { label: 'Pendants', href: '/categories/pendants' },
    ],
  },
  {
    label: 'Fashion',
    href: '/categories/fashion',
    children: [
      { label: 'Ethnic Wear', href: '/categories/ethnic-wear' },
      { label: 'Western Wear', href: '/categories/western-wear' },
      { label: 'Sarees', href: '/categories/sarees' },
      { label: 'Accessories', href: '/categories/accessories' },
    ],
  },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Sale', href: '/sale' },
];

function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { isAuthenticated, profile } = useAuthStore();
  const { getItemCount } = useCartStore();
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    openSearch,
    openCartDrawer,
  } = useUIStore();

  const cartCount = getItemCount();

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location, closeMobileMenu]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg'
          : 'bg-white/95 backdrop-blur-sm shadow-sm'
      )}
    >
      {/* Top bar - hidden on mobile */}
      <div className="hidden lg:block bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white text-xs">
        <div className="container mx-auto px-6 py-2.5 flex justify-between items-center">
          <p className="font-medium">✨ Free shipping on orders over ₹2,999</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-amber-100 transition-colors font-medium">
              Contact Us
            </Link>
            <Link to="/about" className="hover:text-amber-100 transition-colors font-medium">
              About
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2.5 -ml-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="text-2xl lg:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 tracking-wide hover:scale-105 transition-transform duration-300"
          >
            {APP_NAME}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  className={cn(
                    'px-5 py-2.5 text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 rounded-lg',
                    'hover:text-amber-600 hover:bg-amber-50/50',
                    location.pathname === link.href
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-gray-700'
                  )}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      activeDropdown === link.label && "rotate-180"
                    )} />
                  )}
                </Link>

                {/* Dropdown */}
                {link.children && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 py-3 min-w-[220px] overflow-hidden">
                      {link.children.map((child, idx) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 hover:pl-6"
                          style={{ animationDelay: `${idx * 30}ms` }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 lg:gap-2">
            {/* Search */}
            <button
              onClick={openSearch}
              className="p-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist - hidden on mobile */}
            <Link
              to={ROUTES.WISHLIST}
              className="hidden sm:block p-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={openCartDrawer}
              className="p-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <Link to={ROUTES.PROFILE} className="hidden sm:block ml-2">
                <Avatar
                  src={profile?.avatar_url}
                  name={profile?.full_name}
                  size="sm"
                  className="cursor-pointer hover:ring-2 hover:ring-amber-500 hover:scale-105 transition-all"
                />
              </Link>
            ) : (
              <Link to={ROUTES.LOGIN} className="hidden sm:block ml-2">
                <Button variant="outline" size="sm" className="font-semibold border-2 hover:bg-amber-50 hover:border-amber-600 hover:text-amber-600">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 transition-transform duration-300 shadow-2xl',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
            <span className="text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">
              {APP_NAME}
            </span>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  to={link.href}
                  className={cn(
                    'block px-4 py-3.5 text-base font-semibold rounded-xl transition-all duration-200',
                    location.pathname === link.href
                      ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 text-amber-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 active:scale-95'
                  )}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-2 mt-2 space-y-1 pl-4 border-l-2 border-amber-300">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile auth links */}
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={ROUTES.PROFILE}
                    className="flex items-center gap-3 px-4 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    <User className="h-5 w-5" />
                    My Account
                  </Link>
                  <Link
                    to={ROUTES.ORDERS}
                    className="flex items-center gap-3 px-4 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Orders
                  </Link>
                  <Link
                    to={ROUTES.WISHLIST}
                    className="flex items-center gap-3 px-4 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </Link>
                </>
              ) : (
                <div className="space-y-3 pt-2">
                  <Link to={ROUTES.LOGIN} className="block">
                    <Button variant="outline" className="w-full font-semibold py-6 border-2 hover:bg-amber-50 hover:border-amber-600 hover:text-amber-600">
                      Sign In
                    </Button>
                  </Link>
                  <Link to={ROUTES.REGISTER} className="block">
                    <Button className="w-full font-semibold py-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
