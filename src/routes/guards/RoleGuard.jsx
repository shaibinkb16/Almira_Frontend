import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/config/routes';

/**
 * Guard for routes that require specific roles
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export function RoleGuard({ children, allowedRoles = [] }) {
  const { isAuthenticated, isLoading, profile } = useAuthStore();

  // Show nothing while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check if user has required role
  const userRole = profile?.role;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
}

/**
 * Shorthand guard for admin routes
 */
export function AdminGuard({ children }) {
  return <RoleGuard allowedRoles={['admin', 'manager']}>{children}</RoleGuard>;
}

export default RoleGuard;
