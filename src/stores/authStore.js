import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';
import {
  getSession,
  getStoredSession,
  storeSession,
  clearStoredSession,
  getUserProfile,
  signInWithPassword,
  signUpWithPassword,
  signOut as restSignOut,
} from '@/lib/supabase/restClient';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      profile: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,

      // Initialize auth state using REST API
      initialize: async () => {
        try {
          set({ isLoading: true, error: null });

          const isCallback = window.location.pathname.includes('/auth/callback');
          if (isCallback) {
            console.log('🔄 OAuth callback detected');
          }

          // Try to get session from REST API
          const { data, error } = await getSession();
          const session = data?.session;

          if (session?.user) {
            console.log('✅ Session found via REST API');

            // Fetch user profile
            let profile = null;
            try {
              const { data: profileData } = await getUserProfile(session.user.id);
              profile = profileData;
            } catch (e) {
              console.warn('Profile fetch failed:', e);
            }

            set({
              user: session.user,
              profile: profile || null,
              session,
              isAuthenticated: true,
              isLoading: false,
            });

            // Load cart
            setTimeout(async () => {
              try {
                const { useCartStore } = await import('./cartStore');
                const { mergeWithServer } = useCartStore.getState();
                await mergeWithServer();
              } catch (error) {
                console.error('Failed to load cart:', error);
              }
            }, 500);
          } else {
            set({
              user: null,
              profile: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({
            user: null,
            profile: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Sign in with email/password
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });

        const { data, error } = await signInWithPassword(email, password);

        if (error) {
          set({ isLoading: false, error: error.message });
          return { error };
        }

        const session = data.session;
        const user = session.user;

        // Fetch profile
        let profile = null;
        try {
          const { data: profileData } = await getUserProfile(user.id);
          profile = profileData;
        } catch (e) {
          console.warn('Profile fetch failed:', e);
        }

        set({
          user,
          profile,
          session,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { data };
      },

      // Sign up with email/password
      signUp: async (email, password, fullName) => {
        set({ isLoading: true, error: null });

        const { data, error } = await signUpWithPassword(email, password, fullName);

        if (error) {
          set({ isLoading: false, error: error.message });
          return { error };
        }

        set({ isLoading: false, error: null });
        return { data };
      },

      // Sign out
      signOut: async () => {
        await restSignOut();

        set({
          user: null,
          profile: null,
          session: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Set user and session after OAuth login
      setAuth: (user, session) => {
        // Store session for REST API
        if (session) {
          storeSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
            user: session.user,
          });
        }

        set({
          user,
          session,
          isAuthenticated: !!user,
          error: null,
        });
      },

      // Set profile after fetching
      setProfile: (profile) => {
        set({ profile });
      },

      // Update profile
      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return { error: 'Not authenticated' };

        try {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

          if (error) throw error;

          set({ profile: data });
          return { data, error: null };
        } catch (error) {
          return { data: null, error: error.message };
        }
      },

      // Clear auth state on logout
      clearAuth: () => {
        clearStoredSession();
        set({
          user: null,
          profile: null,
          session: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Set loading state
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Set error
      setError: (error) => {
        set({ error });
      },

      // Check if user has specific role
      hasRole: (role) => {
        const { profile } = get();
        return profile?.role === role;
      },

      // Check if user is admin or manager
      isAdmin: () => {
        const { profile } = get();
        return profile?.role === 'admin' || profile?.role === 'manager';
      },

      // Check if user is a customer
      isCustomer: () => {
        const { profile } = get();
        return profile?.role === 'customer';
      },

      // Get user's full name
      getFullName: () => {
        const { profile, user } = get();
        return profile?.full_name || user?.user_metadata?.full_name || 'User';
      },

      // Get user's initials
      getInitials: () => {
        const fullName = get().getFullName();
        return fullName
          .split(' ')
          .map((word) => word[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      },
    }),
    {
      name: 'almira-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              email: state.user.email,
            }
          : null,
        profile: state.profile
          ? {
              id: state.profile.id,
              full_name: state.profile.full_name,
              role: state.profile.role,
              avatar_url: state.profile.avatar_url,
            }
          : null,
      }),
    }
  )
);

// Auth state listener setup (call in App.jsx)
export const setupAuthListener = () => {
  const { setAuth, setProfile, clearAuth, initialize } = useAuthStore.getState();

  // Initialize on first load
  initialize();

  // Listen for auth changes (still use Supabase client for this)
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth event:', event);

    if (event === 'SIGNED_IN' && session?.user) {
      console.log('Setting auth for user:', session.user.email);
      setAuth(session.user, session);

      // Fetch profile
      getUserProfile(session.user.id).then(({ data: profile }) => {
        if (profile) {
          setProfile(profile);
        }
      });

      // Load cart
      setTimeout(async () => {
        try {
          const { useCartStore } = await import('./cartStore');
          const { mergeWithServer } = useCartStore.getState();
          await mergeWithServer();
        } catch (error) {
          console.error('Failed to load cart:', error);
        }
      }, 1000);
    } else if (event === 'SIGNED_OUT') {
      clearAuth();
    } else if (event === 'TOKEN_REFRESHED' && session) {
      setAuth(session.user, session);
    }
  });

  // Return cleanup function
  return () => {
    subscription?.unsubscribe();
  };
};

export default useAuthStore;
