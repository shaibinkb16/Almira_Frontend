import { createBrowserRouter, Outlet } from 'react-router-dom';

// Guards
import { AuthGuard, GuestGuard, AdminGuard } from './guards';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Error Boundary
import RouteErrorBoundary from '@/components/RouteErrorBoundary';

// Public Pages - Direct imports (no lazy loading)
import HomePage from '@/pages/public/HomePage';
import CategoryPage from '@/pages/public/CategoryPage';
import NewArrivalsPage from '@/pages/public/NewArrivalsPage';
import SalePage from '@/pages/public/SalePage';
import ProductListPage from '@/pages/public/ProductListPage';
import ProductDetailPage from '@/pages/public/ProductDetailPage';
import CartPage from '@/pages/public/CartPage';
import CheckoutPage from '@/pages/public/CheckoutPage';
import OrderSuccessPage from '@/pages/public/OrderSuccessPage';
import OrderFailurePage from '@/pages/public/OrderFailurePage';
import SizeGuidePage from '@/pages/SizeGuidePage';
import ContactPage from '@/pages/ContactPage';
import FAQPage from '@/pages/FAQPage';
import ShippingPage from '@/pages/ShippingPage';
import ReturnsPage from '@/pages/ReturnsPage';
import AboutPage from '@/pages/AboutPage';
import CareersPage from '@/pages/CareersPage';
import StoreLocatorPage from '@/pages/StoreLocatorPage';
import BlogPage from '@/pages/BlogPage';
import PrivacyPage from '@/pages/legal/PrivacyPage';
import TermsPage from '@/pages/legal/TermsPage';
import CookiePolicyPage from '@/pages/legal/CookiePolicyPage';
import NotFoundPage from '@/pages/public/NotFoundPage';
import UnauthorizedPage from '@/pages/public/UnauthorizedPage';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import CallbackPage from '@/pages/auth/CallbackPage';

// User Pages
import ProfilePage from '@/pages/user/ProfilePage';
import UserOrdersPage from '@/pages/user/OrdersPage';
import WishlistPage from '@/pages/user/WishlistPage';
import AddressesPage from '@/pages/user/AddressesPage';

// Admin Pages
import DashboardPage from '@/pages/admin/DashboardPage';
import AdminProductsPage from '@/pages/admin/ProductsPage';
import AdminOrdersPage from '@/pages/admin/OrdersPage';
import AdminCategoriesPage from '@/pages/admin/CategoriesPage';
import AdminUsersPage from '@/pages/admin/UsersPage';
import AdminReviewsPage from '@/pages/admin/ReviewsPage';
import AdminCouponsPage from '@/pages/admin/CouponsPage';

// Router configuration
export const router = createBrowserRouter([
  // Public routes with MainLayout
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'categories/:categorySlug',
        element: <CategoryPage />,
      },
      {
        path: 'new-arrivals',
        element: <NewArrivalsPage />,
      },
      {
        path: 'sale',
        element: <SalePage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
      {
        path: 'products/:slug',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'size-guide',
        element: <SizeGuidePage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'faqs',
        element: <FAQPage />,
      },
      {
        path: 'shipping',
        element: <ShippingPage />,
      },
      {
        path: 'returns',
        element: <ReturnsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'careers',
        element: <CareersPage />,
      },
      {
        path: 'stores',
        element: <StoreLocatorPage />,
      },
      {
        path: 'blog',
        element: <BlogPage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'cookies',
        element: <CookiePolicyPage />,
      },
      {
        path: 'checkout',
        element: (
          <AuthGuard>
            <CheckoutPage />
          </AuthGuard>
        ),
      },
      {
        path: 'order/success/:orderId',
        element: (
          <AuthGuard>
            <OrderSuccessPage />
          </AuthGuard>
        ),
      },
      {
        path: 'order/failure/:orderId',
        element: (
          <AuthGuard>
            <OrderFailurePage />
          </AuthGuard>
        ),
      },
      // Protected user routes
      {
        path: 'account',
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <ProfilePage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'orders',
            element: <UserOrdersPage />,
          },
          {
            path: 'wishlist',
            element: <WishlistPage />,
          },
          {
            path: 'addresses',
            element: <AddressesPage />,
          },
        ],
      },
    ],
  },

  // Auth routes
  {
    path: '/auth',
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'verify-email',
        element: <VerifyEmailPage />,
      },
    ],
  },

  // OAuth Callback (outside GuestGuard to allow auth processing)
  {
    path: '/auth/callback',
    element: <CallbackPage />,
  },

  // Admin routes
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'products',
        element: <AdminProductsPage />,
      },
      {
        path: 'categories',
        element: <AdminCategoriesPage />,
      },
      {
        path: 'orders',
        element: <AdminOrdersPage />,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
      {
        path: 'reviews',
        element: <AdminReviewsPage />,
      },
      {
        path: 'coupons',
        element: <AdminCouponsPage />,
      },
    ],
  },

  // Error routes
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
