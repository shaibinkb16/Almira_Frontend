import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/config/routes';

/**
 * Guard for routes that should only be accessed by guests
 * Redirects to home (or intended page) if already authenticated
 */
export function GuestGuard({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading, profile } = useAuthStore();

  // Show nothing while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    // Get the intended destination from state, or use default based on role
    const from = location.state?.from?.pathname;

    if (from) {
      return <Navigate to={from} replace />;
    }

    // Redirect admin to admin dashboard, customers to home
    if (profile?.role === 'admin' || profile?.role === 'manager') {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }

    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}

export default GuestGuard;
