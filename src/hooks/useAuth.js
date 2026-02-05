import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { supabase } from '@/lib/supabase/client';
import {
  signInWithPassword,
  signUpWithPassword,
  signOut as restSignOut,
  getUserProfile,
  storeSession,
  clearStoredSession,
} from '@/lib/supabase/restClient';
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

  // Login with email/password using REST API
  const login = useCallback(
    async ({ email, password }) => {
      try {
        setLoading(true);
        setError(null);

        // Use REST API for login
        const { data, error } = await signInWithPassword(email, password);

        if (error) {
          throw new Error(error.message);
        }

        const session = data.session;
        const loggedInUser = session.user;

        setAuth(loggedInUser, session);

        // Fetch profile using REST API
        let profileData = null;
        try {
          const { data: fetchedProfile } = await getUserProfile(loggedInUser.id);
          profileData = fetchedProfile;
          if (profileData) {
            setProfile(profileData);
          }
        } catch (e) {
          console.warn('Profile fetch failed:', e);
        }

        // Merge cart
        try {
          await mergeWithServer();
        } catch (e) {
          console.warn('Cart merge failed:', e);
        }

        closeAuthModal();
        showSuccess('Welcome back!');

        return {
          success: true,
          profile: profileData
        };
      } catch (error) {
        setError(error.message);
        showError(error.message || 'Failed to login');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setProfile, setLoading, setError, mergeWithServer, closeAuthModal, showSuccess, showError]
  );

  // Register new user using REST API
  const register = useCallback(
    async ({ email, password, fullName }) => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await signUpWithPassword(email, password, fullName);

        if (error) {
          throw new Error(error.message);
        }

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

  // Login with OAuth (still uses Supabase client for redirect)
  const loginWithOAuth = useCallback(
    async (provider) => {
      try {
        setLoading(true);
        setError(null);

        // OAuth needs the Supabase client for redirect handling
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          throw error;
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
    [setLoading, setError, showError]
  );

  // Logout using REST API
  const logout = useCallback(async () => {
    try {
      setLoading(true);

      await restSignOut();
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

  // Request password reset (still uses Supabase client)
  const requestPasswordReset = useCallback(
    async (email) => {
      try {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) throw error;

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

  // Update password (still uses Supabase client)
  const updatePassword = useCallback(
    async (newPassword) => {
      try {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw error;

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
