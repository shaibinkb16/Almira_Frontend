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
import { fetchCategories } from '@/lib/supabase/restClient';

function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
  const [navLinks, setNavLinks] = useState([{ label: 'Home', href: ROUTES.HOME }]);

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

  // Fetch categories from database using REST API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data: categories, error } = await fetchCategories();

        if (error) throw error;
        if (!categories) return;

        // Transform categories into navLinks structure
        const parentCategories = categories.filter(cat => !cat.parent_id);
        const links = [{ label: 'Home', href: ROUTES.HOME }];

        parentCategories.forEach(parent => {
          const children = categories
            .filter(cat => cat.parent_id === parent.id)
            .map(child => ({
              label: child.name,
              href: `/categories/${child.slug}`,
              image: child.image_url,
            }));

          if (children.length > 0) {
            links.push({
              label: parent.name,
              href: `/categories/${parent.slug}`,
              image: parent.image_url,
              children,
            });
          } else {
            links.push({
              label: parent.name,
              href: parent.slug === 'new-arrivals' ? '/new-arrivals' : parent.slug === 'sale' ? '/sale' : `/categories/${parent.slug}`,
              image: parent.image_url,
            });
          }
        });

        setNavLinks(links);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    loadCategories();
  }, []);

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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-xl font-bold text-amber-600">{APP_NAME}</span>
            <button onClick={closeMobileMenu} className="p-2">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
            {navLinks.map((link) => (
              <div key={link.label} className="mb-3">
                {link.children ? (
                  <div>
                    <button
                      onClick={() => setExpandedMobileMenu(expandedMobileMenu === link.label ? null : link.label)}
                      className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg font-bold text-lg"
                    >
                      {link.label}
                      <ChevronDown className={expandedMobileMenu === link.label ? 'rotate-180' : ''} />
                    </button>
                    {expandedMobileMenu === link.label && (
                      <div className="mt-2 ml-4">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            onClick={closeMobileMenu}
                            className="block p-3 mb-2 bg-amber-50 rounded-lg"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    onClick={closeMobileMenu}
                    className="block p-4 bg-gray-100 rounded-lg font-bold text-lg"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            {!isAuthenticated && (
              <div className="mt-6 space-y-3">
                <Link to={ROUTES.LOGIN} onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to={ROUTES.REGISTER} onClick={closeMobileMenu}>
                  <Button className="w-full bg-amber-600">Create Account</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
