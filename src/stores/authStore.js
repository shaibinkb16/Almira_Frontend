import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';

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

      // Initialize auth state from Supabase
      initialize: async () => {
        try {
          // Skip initialization if we're in OAuth callback
          if (window.location.pathname.includes('/auth/callback')) {
            console.log('⏭️ Skipping auth initialization during OAuth callback');
            set({ isLoading: false });
            return;
          }

          set({ isLoading: true, error: null });

          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user) {
            // Fetch user profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Profile fetch error:', profileError);
            }

            set({
              user: session.user,
              profile: profile || null,
              session,
              isAuthenticated: true,
              isLoading: false,
            });

            // Load cart for already logged-in user (with delay to avoid race condition)
            console.log('🛒 User already logged in, loading cart...');
            setTimeout(async () => {
              try {
                const { useCartStore } = await import('./cartStore');
                const { mergeWithServer } = useCartStore.getState();
                await mergeWithServer();
                console.log('✅ Cart loaded successfully');
              } catch (error) {
                console.error('❌ Failed to load cart:', error);
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
            error: error.message,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },

      // Set user and session after login
      setAuth: (user, session) => {
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
        // Only persist essential data
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

  // Listen for auth changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth event:', event);

    if (event === 'SIGNED_IN' && session?.user) {
      console.log('Setting auth for user:', session.user.email);
      setAuth(session.user, session);

      // Fetch profile (don't use await - use .then() to avoid production build issues)
      console.log('Fetching profile for user:', session.user.id);
      supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profile, error }) => {
          if (error) {
            console.error('Profile fetch error:', error);
          } else if (profile) {
            console.log('Profile fetched successfully:', profile.email);
            setProfile(profile);
          } else {
            console.warn('No profile data returned');
          }
        })
        .catch(err => {
          console.error('Profile fetch exception:', err);
        });

      // Load and merge cart from server (with delay to avoid race condition)
      console.log('🛒 Loading cart for logged-in user...');
      setTimeout(async () => {
        try {
          // Dynamically import cart store to avoid circular dependencies
          const { useCartStore } = await import('./cartStore');
          const { mergeWithServer } = useCartStore.getState();
          await mergeWithServer();
          console.log('✅ Cart loaded and merged successfully');
        } catch (error) {
          console.error('❌ Failed to load cart:', error);
        }
      }, 1000);
    } else if (event === 'SIGNED_OUT') {
      clearAuth();

      // Clear cart on logout (optional - or keep in localStorage for guest cart)
      console.log('🛒 User signed out');
      // Uncomment below if you want to clear cart on logout
      // try {
      //   const { useCartStore } = await import('./cartStore');
      //   const { reset } = useCartStore.getState();
      //   reset();
      // } catch (error) {
      //   console.error('Failed to clear cart:', error);
      // }
    } else if (event === 'TOKEN_REFRESHED' && session) {
      setAuth(session.user, session);
    } else if (event === 'USER_UPDATED' && session?.user) {
      setAuth(session.user, session);
    }
  });

  // Return cleanup function
  return () => {
    subscription?.unsubscribe();
  };
};

export default useAuthStore;
