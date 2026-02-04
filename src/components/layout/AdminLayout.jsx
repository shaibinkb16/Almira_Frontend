import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Star,
  Ticket,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ToastContainer } from '@/components/ui/Toast';

const sidebarLinks = [
  {
    label: 'Dashboard',
    href: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Products',
    href: ROUTES.ADMIN_PRODUCTS,
    icon: Package,
  },
  {
    label: 'Categories',
    href: ROUTES.ADMIN_CATEGORIES,
    icon: FolderTree,
  },
  {
    label: 'Orders',
    href: ROUTES.ADMIN_ORDERS,
    icon: ShoppingCart,
  },
  {
    label: 'Customers',
    href: ROUTES.ADMIN_USERS,
    icon: Users,
  },
  {
    label: 'Reviews',
    href: ROUTES.ADMIN_REVIEWS,
    icon: Star,
  },
  {
    label: 'Coupons',
    href: ROUTES.ADMIN_COUPONS,
    icon: Ticket,
  },
  {
    label: 'Settings',
    href: ROUTES.ADMIN_SETTINGS,
    icon: Settings,
  },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { profile } = useAuthStore();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200',
          'transform transition-transform duration-300 lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            className="text-xl font-bold text-amber-600"
          >
            {APP_NAME}
          </Link>
          <button
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive =
              location.pathname === link.href ||
              location.pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to Store */}
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            to={ROUTES.HOME}
            className="block text-center text-sm text-gray-500 hover:text-amber-600 transition-colors"
          >
            &larr; Back to Store
          </Link>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page Title (could be dynamic) */}
          <h1 className="text-lg font-semibold text-gray-900 lg:text-xl">
            Admin Panel
          </h1>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar
                  src={profile?.avatar_url}
                  name={profile?.full_name}
                  size="sm"
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {profile?.full_name || 'Admin'}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {/* Dropdown */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to={ROUTES.PROFILE}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to={ROUTES.ADMIN_SETTINGS}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default AdminLayout;
