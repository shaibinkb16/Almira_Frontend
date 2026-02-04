import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Guards
import { AuthGuard, GuestGuard, AdminGuard } from './guards';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
  </div>
);

// Lazy load pages
// Public Pages
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const CategoryPage = lazy(() => import('@/pages/public/CategoryPage'));
const NewArrivalsPage = lazy(() => import('@/pages/public/NewArrivalsPage'));
const SalePage = lazy(() => import('@/pages/public/SalePage'));
const ProductListPage = lazy(() => import('@/pages/public/ProductListPage'));
const ProductDetailPage = lazy(() => import('@/pages/public/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/public/CartPage'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/public/UnauthorizedPage'));

// Auth Pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));

// User Pages
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage'));
const UserOrdersPage = lazy(() => import('@/pages/user/OrdersPage'));
const WishlistPage = lazy(() => import('@/pages/user/WishlistPage'));
const AddressesPage = lazy(() => import('@/pages/user/AddressesPage'));

// Admin Pages
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/ProductsPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/OrdersPage'));

// Router configuration
export const router = createBrowserRouter([
  // Public routes with MainLayout
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'categories/:categorySlug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CategoryPage />
          </Suspense>
        ),
      },
      {
        path: 'new-arrivals',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NewArrivalsPage />
          </Suspense>
        ),
      },
      {
        path: 'sale',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SalePage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProductListPage />
          </Suspense>
        ),
      },
      {
        path: 'products/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'cart',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CartPage />
          </Suspense>
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
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            ),
          },
          {
            path: 'profile',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            ),
          },
          {
            path: 'orders',
            element: (
              <Suspense fallback={<PageLoader />}>
                <UserOrdersPage />
              </Suspense>
            ),
          },
          {
            path: 'wishlist',
            element: (
              <Suspense fallback={<PageLoader />}>
                <WishlistPage />
              </Suspense>
            ),
          },
          {
            path: 'addresses',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AddressesPage />
              </Suspense>
            ),
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
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResetPasswordPage />
          </Suspense>
        ),
      },
      {
        path: 'verify-email',
        element: (
          <Suspense fallback={<PageLoader />}>
            <VerifyEmailPage />
          </Suspense>
        ),
      },
    ],
  },

  // Admin routes
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'orders',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminOrdersPage />
          </Suspense>
        ),
      },
    ],
  },

  // Error routes
  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<PageLoader />}>
        <UnauthorizedPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export default router;
