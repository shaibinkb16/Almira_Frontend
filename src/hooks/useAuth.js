import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { auth } from '@/lib/supabase/client';
import { ROUTES } from '@/config/routes';

export function useAuth() {
  const navigate = useNavigate();
  const {
    user,
    profile,
    isAuthenticated,
    isLoading,
    isAdmin,
    setAuth,
    setProfile,
    clearAuth,
    setLoading,
    setError,
  } = useAuthStore();

  const { mergeWithServer, reset: resetCart } = useCartStore();
  const { showSuccess, showError, closeAuthModal } = useUIStore();

  // Login with email/password
  const login = useCallback(
    async ({ email, password }) => {
      try {
        setLoading(true);
        setError(null);

        const { user, session } = await auth.signIn({ email, password });
        setAuth(user, session);

        // Fetch profile
        const { data: profileData } = await import('@/lib/supabase/client').then(
          (mod) =>
            mod.supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single()
        );

        if (profileData) {
          setProfile(profileData);
        }

        // Merge cart
        await mergeWithServer();

        closeAuthModal();
        showSuccess('Welcome back!');

        // Redirect based on role
        if (profileData?.role === 'admin' || profileData?.role === 'manager') {
          navigate(ROUTES.ADMIN_DASHBOARD);
        }

        return { success: true };
      } catch (error) {
        setError(error.message);
        showError(error.message || 'Failed to login');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [navigate, setAuth, setProfile, setLoading, setError, mergeWithServer, closeAuthModal, showSuccess, showError]
  );

  // Register new user
  const register = useCallback(
    async ({ email, password, fullName }) => {
      try {
        setLoading(true);
        setError(null);

        await auth.signUp({ email, password, fullName });

        showSuccess('Registration successful! Please check your email to verify your account.');
        closeAuthModal();

        return { success: true };
      } catch (error) {
        setError(error.message);
        showError(error.message || 'Failed to register');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, closeAuthModal, showSuccess, showError]
  );

  // Login with OAuth
  const loginWithOAuth = useCallback(
    async (provider) => {
      try {
        setLoading(true);
        setError(null);

        await auth.signInWithOAuth(provider);
        // OAuth redirects, so we don't need to do anything else here

        return { success: true };
      } catch (error) {
        setError(error.message);
        showError(error.message || 'Failed to login');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, showError]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      setLoading(true);

      await auth.signOut();
      clearAuth();
      resetCart();

      showSuccess('You have been logged out');
      navigate(ROUTES.HOME);

      return { success: true };
    } catch (error) {
      showError(error.message || 'Failed to logout');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [navigate, clearAuth, resetCart, setLoading, showSuccess, showError]);

  // Request password reset
  const requestPasswordReset = useCallback(
    async (email) => {
      try {
        setLoading(true);
        setError(null);

        await auth.resetPassword(email);

        showSuccess('Password reset link sent! Check your email.');
        return { success: true };
      } catch (error) {
        setError(error.message);
        showError(error.message || 'Failed to send reset link');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, showSuccess, showError]
  );

  // Update password
  const updatePassword = useCallback(
    async (newPassword) => {
      try {
        setLoading(true);
        setError(null);

        await auth.updatePassword(newPassword);

        showSuccess('Password updated successfully!');
        return { success: true };
      } catch (error) {
        setError(error.message);
        showError(error.message || 'Failed to update password');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, showSuccess, showError]
  );

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    isAdmin: isAdmin(),
    login,
    register,
    loginWithOAuth,
    logout,
    requestPasswordReset,
    updatePassword,
  };
}

export default useAuth;
