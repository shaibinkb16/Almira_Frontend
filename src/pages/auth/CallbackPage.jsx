import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { ROUTES } from '@/config/routes';

function CallbackPage() {
  const navigate = useNavigate();
  const { setAuth, setProfile } = useAuthStore();
  const { mergeWithServer } = useCartStore();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; // Prevent double execution
    hasRun.current = true;

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      console.error('⏱️ Authentication timeout');
      navigate(ROUTES.LOGIN, {
        state: { error: 'Authentication timeout. Please try again.' }
      });
    }, 10000);

    const handleCallback = async () => {
      try {
        console.log('🔄 Starting OAuth callback...');
        console.log('Current URL:', window.location.href);
        console.log('URL params:', window.location.search);
        console.log('URL hash:', window.location.hash);

        // Exchange the code for a session
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(
          new URL(window.location.href).searchParams.get('code') || ''
        ).catch(async () => {
          // Fallback to getSession if exchangeCodeForSession fails
          console.log('⚠️ exchangeCodeForSession failed, trying getSession...');
          return await supabase.auth.getSession();
        });

        if (error) {
          console.error('❌ OAuth callback error:', error);
          navigate(ROUTES.LOGIN, {
            state: { error: 'Authentication failed. Please try again.' }
          });
          return;
        }

        if (session) {
          console.log('✅ Session obtained:', session.user.email);

          // Set auth state
          setAuth(session.user, session);

          // Fetch or create profile
          console.log('🔍 Fetching user profile...');
          let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // If profile doesn't exist (first time Google login), create it
          if (profileError || !profile) {
            console.log('⚠️ Profile not found, creating new profile...');
            console.log('Profile error:', profileError);

            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name ||
                           session.user.user_metadata?.name ||
                           session.user.email?.split('@')[0],
                avatar_url: session.user.user_metadata?.avatar_url ||
                           session.user.user_metadata?.picture,
                role: 'customer',
              })
              .select()
              .single();

            if (createError) {
              console.error('❌ Error creating profile:', createError);
              // Continue anyway - user is authenticated
            } else {
              console.log('✅ Profile created successfully');
              profile = newProfile;
            }
          } else {
            console.log('✅ Profile found');
          }

          if (profile) {
            setProfile(profile);
            console.log('✅ Profile set in store');
          }

          // Merge cart with server
          console.log('🛒 Merging cart...');
          try {
            await mergeWithServer();
            console.log('✅ Cart merged');
          } catch (cartError) {
            console.error('⚠️ Cart merge failed (non-critical):', cartError);
          }

          // Check for stored OAuth redirect destination
          const oauthRedirect = localStorage.getItem('oauth_redirect');
          if (oauthRedirect) {
            localStorage.removeItem('oauth_redirect');
            console.log('🔀 Redirecting to stored destination:', oauthRedirect);
            navigate(oauthRedirect);
          } else {
            // Redirect based on role
            console.log('🔀 Redirecting to:', profile?.role === 'admin' ? 'Admin Dashboard' : 'Home');
            if (profile?.role === 'admin' || profile?.role === 'manager') {
              navigate(ROUTES.ADMIN_DASHBOARD);
            } else {
              navigate(ROUTES.HOME);
            }
          }
        } else {
          console.log('❌ No session found');
          // No session found
          navigate(ROUTES.LOGIN);
        }
      } catch (error) {
        console.error('❌ Callback error:', error);
        alert('Authentication error: ' + error.message);
        navigate(ROUTES.LOGIN, {
          state: { error: 'Authentication failed. Please try again.' }
        });
      } finally {
        clearTimeout(timeout);
      }
    };

    handleCallback();

    return () => clearTimeout(timeout);
  }, [navigate, setAuth, setProfile, mergeWithServer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900">Signing you in...</h2>
        <p className="text-gray-600 mt-2">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}

export default CallbackPage;
